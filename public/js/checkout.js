paypal
  .Buttons({
    style: {
      size: 'responsive',
      // layout: "vertical",
      layout: 'horizontal',
      color: 'gold',
      shape: 'rect',
      label: 'checkout',
    },
    createOrder: function () {
      return fetch('/paypalCheckout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            { courseId: '61da965e70d6135b6a2c1057', quantity: 1 },
            { courseId: '61da971470d6135b6a2c1058', quantity: 1 },
            { courseId: '61da978070d6135b6a2c1059', quantity: 1 },
            { courseId: '61da97fa70d6135b6a2c105a', quantity: 1 },
            { courseId: '61da985f70d6135b6a2c105b', quantity: 1 },
          ],
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
          create_time: details.purchase_units[0].payments.captures[0].create_time,
          update_time: details.purchase_units[0].payments.captures[0].update_time,
          courses: details.purchase_units[0].items,
        };
        fetch('/paypalCheckout/success', {
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
