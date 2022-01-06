const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth');
const siteController = require('../controllers/SiteController');

router.get("/login", siteController.login)
router.post("/login", auth.login)
router.get("/register", siteController.register)
router.post("/register", auth.register)
router.get("/info", siteController.info)
router.get("/", siteController.home)
router.post("/", siteController.logout)

module.exports = router;
