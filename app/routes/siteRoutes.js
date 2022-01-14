const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth');
const siteController = require('../controllers/SiteController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/login', siteController.login);
router.post('/login', auth.login);
router.get('/search', siteController.search);
router.get('/register', siteController.register);
router.post('/register', auth.register);
router.get('/info', verifyToken, siteController.info);
router.get('/', verifyToken, siteController.home);
router.post('/', siteController.logout);

module.exports = router;
