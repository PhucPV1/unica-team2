const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/TrainerController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/createCourse', verifyToken, trainerController.getCreateCourseView);
router.post('/createCourse', verifyToken, trainerController.postCreateCourse);
router.get(
  '/:id/updateCourse',
  verifyToken,
  trainerController.getUpdateCourseView
);
router.get(
  '/:id/listTrainee',
  verifyToken,
  trainerController.getListTraineeView
);
router.patch('/:id/updateCourse', verifyToken, trainerController.updateCourse);
router.delete('/:id/deleteCourse', verifyToken, trainerController.deleteCourse);
router.get('/', verifyToken, trainerController.listTrainerCourse);
// router.get('/updateCourse', trainerController.getUpdateView);
// router.patch('/updateCourse', trainerController.update);
module.exports = router;
