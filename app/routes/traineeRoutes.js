const express = require('express');
const router = express.Router();
const traineeController = require('../controllers/TraineeController');
const verifyToken = require('../middlewares/verifyToken');

router.get(
  '/updateProfile',
  verifyToken,
  traineeController.getUpdateProfileView,
);
router.patch('/:id/updateProfile', traineeController.updateProfile);
module.exports = router;
