const express = require("express")
const router = express.Router()
const auth = require("../controllers/Auth")
const siteController = require("../controllers/SiteController")

router.get("/login", siteController.login)
router.get("/register", siteController.register)
router.post("/register", auth.register)
router.get("/info", siteController.info)
router.post("/info", auth.login)
router.get("/", siteController.home)
router.post("/", siteController.logout)

module.exports = router
