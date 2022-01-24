const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth');
const siteController = require('../controllers/SiteController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

router.get('/login', siteController.login);
router.post('/login', auth.login);
router.post('/socialLogin', auth.socialLogin);
router.get('/search', verifyToken, siteController.search);
router.get('/register', siteController.register);
router.post('/register', auth.register);
router.get('/registerTrainer', siteController.registerTrainer);
router.post('/registerTrainer', auth.registerTrainer);
router.get('/info', verifyToken, checkRole.trainee, siteController.info);
router.get(
  '/overview/:id',
  verifyToken,
  checkRole.trainee,
  siteController.overview,
);
router.get(
  '/video/:slug/:id',
  verifyToken,
  checkRole.trainee,
  siteController.video,
);
router.post('/video_update', verifyToken, siteController.video_update);
router.post('/comment', verifyToken, siteController.Comment);
router.post('/reply', verifyToken, siteController.Reply);
router.post('/:id/review', verifyToken, siteController.review);
router.post('/:slug', verifyToken, siteController.getComment);
router.get('/:slug', verifyToken, siteController.detailCourse);
router.get('/', verifyToken, siteController.home);
router.post('/', siteController.logout);

module.exports = router;
