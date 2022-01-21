const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, courseController.getCourses);
router.get('/', verifyToken, courseController.index);

module.exports = router;
