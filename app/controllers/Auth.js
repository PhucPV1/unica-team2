require("dotenv").config()
const User = require("../models/User.js")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

const auth = {
  // [POST] /Register
  register: async (req, res) => {
    const email = req.body.email
    const phone_number = req.body.phone_number
    const password = req.body.password
    try {
      // check for existing user
      const user = (await User.findOne({ email })) || (await User.findOne({ phone_number }))
      if (user) {
        return res.render("register", { invalidInfoMessage: "Email hoặc số điện thoại này đã tồn tại" })
      } else {
        //   all good
        const hashedPassword = await argon2.hash(password)
        await User.create({ ...req.body, password: hashedPassword })
        return res.render("login", { isRegistered: "yes", invalidInfoMessage: "" })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).render("error", { err, message: "Xảy ra lỗi trong quá trình đăng ký, xin thử lại" })
    }
  },
  // [POST] /Login
  login: async (req, res) => {
    const { email_or_phone, password } = req.body
    try {
      const user =
        (await User.findOne({ email: email_or_phone }).populate("courses")) ||
        (await User.findOne({ phone_number: email_or_phone }).populate("courses"))
      //   check for existing email or phone
      if (!user) {
        return res.render("login", { isRegistered: "no", invalidInfoMessage: "Email hoặc mật khẩu không chính xác" })
      }
      //   authenticate password
      const isPasswordValid = await argon2.verify(user.password, password)
      if (!isPasswordValid) {
        return res.render("login", { isRegistered: "no", invalidInfoMessage: "Email hoặc mật khẩu không chính xác" })
      }
      //   all good
      const accessToken = jwt.sign({ _id: user._id }, `${process.env.signature}`, { expiresIn: "1d" })
      const refreshToken = jwt.sign({ _id: user._id }, `${process.env.signature}`, { expiresIn: "10d" })
      await User.updateOne({ _id: user._id }, { refreshToken })
      res.cookie("access_token", accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true;
      })
      res.cookie("refresh_token", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true;
      })
      return res.render("info", { user, isLoggedIn: "true" })
    } catch (err) {
      res.status(500).render("error", { err, success: false, message: "Đã xảy ra lỗi, vui lòng thử lại" })
    }
  },
}
module.exports = auth
