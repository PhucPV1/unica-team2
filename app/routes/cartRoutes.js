const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');
const verifyToken = require('../middlewares/verifyToken');

router.delete('/delete/:id', verifyToken, cartController.delete);
router.post('/add', verifyToken, cartController.addCourse);
router.get('/', verifyToken, cartController.index);

module.exports = router;
