const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/updateProfile', verifyToken, userController.getUpdateProfileView);
router.patch('/:id/updateProfile', userController.updateProfile);
module.exports = router;
