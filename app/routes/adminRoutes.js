const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

router.get(
  '/:id/listCourse',
  verifyToken,
  checkRole.admin,
  adminController.listCourse
);
router.get(
  '/createCategory',
  verifyToken,
  checkRole.admin,
  adminController.getCreateCategoryView
);
router.get(
  '/:id/updateCategory',
  verifyToken,
  checkRole.admin,
  adminController.getUpdateCategoryView
);

router.post(
  '/createCategory',
  verifyToken,
  checkRole.admin,
  adminController.postCreateCategory
);
router.patch(
  '/:id/updateCategory',
  verifyToken,
  checkRole.admin,
  adminController.updateCategory
);
router.delete(
  '/:id/deleteCategory',
  verifyToken,
  checkRole.admin,
  adminController.deleteCategory
);
router.get('/', verifyToken, checkRole.admin, adminController.getDashboardView);
module.exports = router;
