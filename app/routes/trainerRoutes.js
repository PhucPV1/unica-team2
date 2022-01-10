const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/TrainerController');

router.get('/createCourse', trainerController.getCreateCourseView);
router.post('/createCourse', trainerController.postCreateCourse);
router.get('/:id/updateCourse', trainerController.getUpdateCourseView);
router.patch('/:id/updateCourse', trainerController.updateCourse);
router.delete('/:id/deleteCourse', trainerController.deleteCourse);
router.get('/', trainerController.listTrainerCourse);
// router.get('/updateCourse', trainerController.getUpdateView);
// router.patch('/updateCourse', trainerController.update);
module.exports = router;
