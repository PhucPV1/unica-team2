const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/TrainerController');

router.get('/createCourse', trainerController.create);
router.get('/updateCourse', trainerController.getUpdateView);
router.patch('/updateCourse', trainerController.update);
module.exports = router;
