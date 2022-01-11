const paypal = require('@paypal/checkout-server-sdk');
const stripe = require('stripe')(process.env.stripe_private_key);
const Course = require('../models/Course');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const Environment = paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(process.env.paypalClientId, process.env.paypalSecret),
);

const CheckoutController = {
  // [GET] / order
  order: async (req, res) => {
    try {
      const courses = await Course.find({});
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('cart', { courses, user });
      } else {
        res.render('cart', { courses, user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // [POST] / paypalCheckout
  paypalCheckout: async (req, res) => {
    const request = new paypal.orders.OrdersCreateRequest();
    const coursesOrder = req.body.items;
    var total = 0;
    rate = 23300;
    var items = [];
    for (i = 0; i < coursesOrder.length; i++) {
      const course = await Course.findById(coursesOrder[i].courseId);
      const coursePriceToUsd = Number((course.present_price / rate).toFixed(2));
      total = total + coursePriceToUsd;

      item = {
        name: course.name,
        unit_amount: {
          currency_code: 'USD',
          value: coursePriceToUsd,
        },
        quantity: 1,
        sku: course._id,
      };
      items.push(item);
    }
    // console.log('🚀 items', items);
    // console.log('🚀 total', total.toFixed(2));

    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: total.toFixed(2),
              },
            },
          },
          items: items,
        },
      ],
    });
    try {
      const order = await paypalClient.execute(request);
      res.json({ id: order.result.id });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  // [POST] / checkout/success
  paypalCheckoutSuccess: async (req, res) => {
    const { transaction_id, status, amount, trainee_email, courses } = req.body;
    const courseIds = courses.reduce((array, course) => {
      array.push(course.sku);
      return array;
    }, []);
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, `${process.env.signature}`);
    const user = await User.findOne({ _id: decoded._id });
    // console.log('🚀 user', {
    //   payment_method: 'Paypal',
    //   transaction_id,
    //   status,
    //   amount,
    //   trainee_id: user._id,
    //   trainee_email,
    //   create_time,
    //   update_time,
    //   courses: courseIds,
    // });
    await Transaction.create({
      payment_method: 'Paypal',
      transaction_id,
      status,
      amount,
      trainee_id: user._id,
      trainee_email,
      courses: courseIds,
    });
    await User.updateOne({ _id: decoded._id }, { $push: { courses: courseIds } });
    res.json({ success: true });
  },
  // [POST] / stripeCheckout
  stripeCheckout: async (req, res) => {
    try {
      const coursesOrder = req.body.items;
      var total = 0;
      rate = 23300;
      var items = [];
      for (i = 0; i < coursesOrder.length; i++) {
        const course = await Course.findById(coursesOrder[i].courseId);
        const coursePriceToUsd = Number((course.present_price / rate).toFixed(2));
        total = total + coursePriceToUsd;

        item = {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.name + ' - ' + course._id,
              description: course.description,
            },
            unit_amount: coursePriceToUsd * 100,
          },
          quantity: 1,
        };
        items.push(item);
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: items,
        success_url: 'http://localhost:3000/order/stripeCheckout/success?id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cart',
      });
      res.json({ url: session.url });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  },
  // [GET] / stripeCheckoutSuccess
  stripeCheckoutSuccess: async (req, res) => {
    try {
      const token = req.cookies.access_token;
      const decoded = jwt.verify(token, `${process.env.signature}`);
      const user = await User.findOne({ _id: decoded._id });
      const session = await stripe.checkout.sessions.retrieve(req.query.id, {
        expand: ['line_items'],
      });
      const courses = session.line_items.data;
      const courseIds = courses.reduce((array, course) => {
        courseId = course.description.split(' - ').pop();
        array.push(courseId);
        return array;
      }, []);
      await Transaction.create({
        payment_method: 'Stripe',
        transaction_id: session.payment_intent,
        status: session.payment_status.toUpperCase(),
        amount: session.amount_total / 100,
        trainee_id: user._id,
        trainee_email: session.customer_details.email,
        courses: courseIds,
      });
      await User.updateOne({ _id: decoded._id }, { $push: { courses: courseIds } });
      res.redirect('/info');
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};
module.exports = CheckoutController;
