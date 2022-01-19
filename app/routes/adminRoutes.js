const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

router.get('/', verifyToken, checkRole.admin, adminController.getDashboardView);
router.get('/:id/listCourse', verifyToken, checkRole.admin, adminController.listCourse);
module.exports = router;
