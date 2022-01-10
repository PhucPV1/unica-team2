const express = require('express');
const router = express.Router();
const traineeController = require('../controllers/TraineeController');

router.get('/:id/updateProfile', traineeController.getUpdateProfileView);
router.patch('/:id/updateProfile', traineeController.updateProfile);
router.get('/:id/createTrainer', traineeController.getCreateTrainerView);
router.patch('/:id/createTrainer', traineeController.createTrainer);
// router.get('/', traineeController.getUpdateProfileView);
module.exports = router;
