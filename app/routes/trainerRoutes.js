const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/TrainerController');
const verifyToken = require('../middlewares/verifyToken');
const checkTrainerRole = require('../middlewares/checkTrainerRole');

router.get('/createCourse', verifyToken, checkTrainerRole, trainerController.getCreateCourseView);
router.post('/createCourse', verifyToken, checkTrainerRole, trainerController.postCreateCourse);
router.get('/:id/updateCourse', verifyToken, checkTrainerRole, trainerController.getUpdateCourseView);
router.get('/:id/listTrainee', verifyToken, checkTrainerRole, trainerController.getListTraineeView);
router.patch('/:id/updateCourse', verifyToken, checkTrainerRole, trainerController.updateCourse);
router.delete('/:id/deleteCourse', verifyToken, checkTrainerRole, trainerController.deleteCourse);
router.get('/', verifyToken, checkTrainerRole, trainerController.listTrainerCourse);
module.exports = router;
