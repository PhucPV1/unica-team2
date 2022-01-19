const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, adminController.getDashboardView);
router.get('/:id/listCourse', verifyToken, adminController.listCourse);
module.exports = router;
