const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth');
const siteController = require('../controllers/SiteController');
const checkoutController = require('../controllers/CheckoutController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/login', siteController.login);
router.post('/login', auth.login);
router.get('/register', siteController.register);
router.post('/register', auth.register);
router.get('/info', verifyToken, siteController.info);
router.post('/paypalCheckout/success', checkoutController.paypalCheckoutSuccess);
router.post('/paypalCheckout', checkoutController.paypalCheckout);
router.get('/cart', verifyToken, checkoutController.cart);
router.get('/', verifyToken, siteController.home);
router.post('/', siteController.logout);

module.exports = router;
