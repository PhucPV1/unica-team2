const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/paypalCheckout/success', PaymentController.paypalCheckoutSuccess);
router.post('/paypalCheckout', PaymentController.paypalCheckout);
router.get('/stripeCheckout/success', PaymentController.stripeCheckoutSuccess);
router.post('/stripeCheckout', PaymentController.stripeCheckout);
router.get('/', verifyToken, PaymentController.order);

module.exports = router;
