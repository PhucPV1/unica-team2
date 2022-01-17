const express = require('express');
const router = express.Router();
const traineeController = require('../controllers/TraineeController');

router.get('/updateProfile', traineeController.getUpdateProfileView);
router.patch('/updateProfile', traineeController.updateProfile);
// router.get('/', traineeController.getUpdateProfileView);
module.exports = router;
