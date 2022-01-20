const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/TrainerController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

router.get('/createCourse', verifyToken, checkRole.trainer, trainerController.getCreateCourseView);
router.post('/createCourse', verifyToken, checkRole.trainer, trainerController.postCreateCourse);
router.get('/:id/updateCourse', verifyToken, checkRole.trainer, trainerController.getUpdateCourseView);
router.get('/:id/listTrainee', verifyToken, checkRole.trainer, trainerController.getListTraineeView);
router.patch('/:id/updateCourse', verifyToken, checkRole.trainer, trainerController.updateCourse);
router.delete('/:id/deleteCourse', verifyToken, checkRole.trainer, trainerController.deleteCourse);
router.get('/', verifyToken, checkRole.trainer, trainerController.listTrainerCourse);
module.exports = router;
