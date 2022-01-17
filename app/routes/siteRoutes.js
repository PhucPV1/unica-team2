const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth');
const siteController = require('../controllers/SiteController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/:slug',verifyToken,siteController.detailCourse);
router.get('/donggia', verifyToken, siteController.samePrice);
router.get('/login', siteController.login);
router.post('/login', auth.login);
router.get('/search', verifyToken, siteController.search);
router.post('/register', auth.register);
router.get('/info', verifyToken, siteController.info);
router.get('/', verifyToken, siteController.home);
router.post('/', siteController.logout);

module.exports = router;
