require('dotenv').config();
const paypal = require('@paypal/checkout-server-sdk');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Course = require('../models/Course');
const Transaction = require('../models/Transaction');
const Trainee_course = require('../models/Trainee_course');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const Environment = paypal.core.SandboxEnvironment;
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(process.env.PAYPALCLIENTID, process.env.PAYPALSECRET),
);

const MSPClient = require('@multisafepay/api-wrapper').default;
const client = new MSPClient('c261554a06301b1b0bfbf9946f2ae4edf5e43585', {
  environment: 'test',
});

const CheckoutController = {
  // [GET] / order
  order: async (req, res) => {
    try {
      const courses = await Course.find({});
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('cart');
        res.render('order', { courses, user });
      } else {
        res.render('order', { courses, user: '' });
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
    const orderPrice = req.body.price;
    // console.log('🚀 items', items);
    // console.log('🚀 total', total.toFixed(2));

    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: orderPrice.toString(),
          },
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
  // [POST] / paypalCheckout/success
  paypalCheckoutSuccess: async (req, res) => {
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, `${process.env.signature}`);
    const user = await User.findOne({ _id: decoded._id });
    const { transaction_id, status, amount, trainee_email, courses } = req.body;
    const courseIds = courses.reduce((array, course) => {
      array.push(course.sku);
      return array;
    }, []);
    const traineeCourseDocuments = courses.reduce((array, course) => {
      array.push({
        trainee_id: user._id,
        course_id: course.sku,
        status: 0,
      });
      return array;
    }, []);
    await Transaction.create({
      payment_method: 'Paypal',
      transaction_id,
      status,
      amount,
      trainee_id: user._id,
      trainee_email,
      courses: courseIds,
    });
    await User.updateOne(
      { _id: decoded._id },
      { $push: { courses: courseIds } },
    );
    await Trainee_course.insertMany(traineeCourseDocuments);
    await User.updateOne({ _id: decoded._id }, { cart: [] });
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
        const coursePriceToUsd = Number(
          (course.present_price / rate).toFixed(2),
        );
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
        success_url:
          process.env.BASE_URL +
          '/order/stripeCheckout/success?id={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.BASE_URL + '/order',
      });
      res.json({ url: session.url });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  },
  // [GET] / stripeCheckout/success
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
      const traineeCourseDocuments = courses.reduce((array, course) => {
        array.push({
          trainee_id: user._id,
          course_id: course.description.split(' - ').pop(),
          status: 0,
        });
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
      await User.updateOne(
        { _id: decoded._id },
        { $push: { courses: courseIds } },
      );
      await Trainee_course.insertMany(traineeCourseDocuments);
      await User.updateOne({ _id: decoded._id }, { cart: [] });
      res.redirect('/info');
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  multisafepay: async (req, res) => {
    try {
      const newOrder = await client.orders.create({
        type: 'redirect',
        order_id: Math.random(), //replace here with a new order ID
        gateway: '',
        currency: 'EUR',
        amount: '1000',
        description: 'Test Order Description',
        payment_options: {
          notification_url: 'http://localhost:3000',
          redirect_url: 'http://localhost:3000/cart',
          cancel_url: 'http://localhost:3000/order',
          close_window: '',
        },
        customer: {
          locale: 'nl_NL',
          ip_address: '89.20.162.110',
          first_name: 'Testperson-nl',
          last_name: 'Approved',
          address1: 'Kraanspoor',
          house_number: '39C',
          zip_code: '1033SC',
          city: 'Amsterdam',
          country: 'NL',
          phone: '0208500500',
          email: 'test@example.com',
          referrer: 'http://test.com',
          user_agent:
            'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
        },
        second_chance: {
          send_email: true,
        },
      });
      res.json({ message: newOrder });
    } catch (error) {
      console.log(error);
    }
  },
  sendMail: async (req, res) => {
    const mailjet = require('node-mailjet').connect(
      '230f51e10677df7df217e27dff1fc024',
      '9867e6581b5b784fabc6440036097488',
    );
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'phucv172@gmail.com',
            Name: 'Phuc',
          },
          To: [
            {
              Email: 'cong.tran@smartdev.com',
              Name: 'Cong',
            },
          ],
          Cc: [
            {
              Email: 'quy.tran@smartdev.com',
              Name: 'Quy',
            },
            {
              Email: 'hung.tran@smartdev.com',
              Name: 'Hung',
            },
          ],
          Subject: 'Greetings from Mailjet.',
          TextPart: 'My first Mailjet email',
          HTMLPart:
            "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
          CustomID: 'AppGettingStartedTest',
        },
      ],
    });
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
    res.json({ ok: 'OK' });
  },
};
module.exports = CheckoutController;
