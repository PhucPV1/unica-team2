var price = 11.11;
paypal
  .Buttons({
    style: {
      size: 'responsive',
      // size: 'large',
      // height: 55,
      layout: 'vertical',
      // layout: 'horizontal',
      color: 'gold',
      shape: 'rect',
      label: 'checkout',
      tagline: 'false',
    },
    createOrder: function () {
      return fetch('/order/paypalCheckout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: price,
        }),
      })
        .then((res) => {
          return res.json();
          // return res.json().then((json) => Promise.reject(json))
        })
        .then(({ id }) => {
          return id;
        })
        .catch((e) => {
          console.error(e.error);
        });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        console.log('ok ' + JSON.stringify(details));
        transactionInfo = {
          transaction_id: details.purchase_units[0].payments.captures[0].id,
          status: details.purchase_units[0].payments.captures[0].status,
          amount: details.purchase_units[0].payments.captures[0].amount.value,
          trainee_email: details.payer.email_address,
          // create_time: details.purchase_units[0].payments.captures[0].create_time,
          // update_time: details.purchase_units[0].payments.captures[0].update_time,
          courses: details.purchase_units[0].items,
        };
        fetch('order/paypalCheckout/success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionInfo),
        })
          .then((response) => response.json())
          .then(() => {
            window.location.href = '../info';
          })
          .catch((e) => {
            console.error(e.error);
          });
      });
    },
  })
  .render('#paypal');

// paypal
//   .Marks({
//     fundingSource: paypal.FUNDING.BANCONTACT,
//   })
//   .render('#bancontact-mark');

// paypal
//   .PaymentFields({
//     fundingSource: paypal.FUNDING.BANCONTACT,
//     style: {},
//     fields: {
//       name: {
//         value: '',
//       },
//     },
//   })
//   .render('#bancontact-container');

// paypal
//   .Buttons({
//     fundingSource: paypal.FUNDING.BANCONTACT,
//     style: {
//       label: 'pay',
//     },
//     createOrder(data, actions) {
//       return actions.order.create(order);
//     },
//     onApprove(data, actions) {
//       fetch(`/capture/${data.orderID}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           swal(
//             'Order Captured!',
//             `Id: ${data.id}, ${Object.keys(data.payment_source)[0]}, ${
//               data.purchase_units[0].payments.captures[0].amount.currency_code
//             } ${data.purchase_units[0].payments.captures[0].amount.value}`,
//             'success',
//           );
//         })
//         .catch(console.error);
//     },
//     onCancel(data, actions) {
//       swal('Order Canceled', `ID: ${data.orderID}`, 'warning');
//     },
//     onError(err) {
//       // console.error(err);
//       console.log('error');
//     },
//   })
//   .render('#bancontact-btn');

/* Stripe checkout */
const button = document.querySelector('#stripe');
button.addEventListener('click', () => {
  fetch('/order/stripeCheckout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: listCourses,
    }),
  })
    .then((res) => {
      return res.json();
      // return res.json().then((json) => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch((e) => {
      console.error(e.error);
    });
});

/* multisafepay checkout */
const button1 = document.querySelector('#multisafepay');
button1.addEventListener('click', () => {
  fetch('/order/multisafepay', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
      // return res.json().then((json) => Promise.reject(json));
    })
    .then((session) => {
      window.location.href = session.message.data.payment_url;
    })
    .catch((e) => {
      console.log(e);
    });
});

mailBtn = document.querySelector('#mail');
mailBtn.onclick = () => {
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch('http://localhost:3000/order/sendMail', options)
    .then((response) => response.json())
    .then(() => {
      alert('ok');
    });
};
