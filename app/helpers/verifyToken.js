const Course = require("../models/Course")
const User = require("../models/User")
const jwt = require("jsonwebtoken")

async function verifyToken(req, res, viewRender) {
  try {
    const courses = await Course.find({})
    const token = req.cookies.access_token
    // token found
    if (token) {
      try {
        const decoded = jwt.verify(token, `${process.env.signature}`)
        const user = await User.findOne({ _id: decoded._id })
        return res.render(viewRender, { courses, user, isLoggedIn: "true" })
      } catch (err) {
        // token expired or invalid
        const refreshToken = req.cookies.refresh_token
        user = await User.findOne({ refreshToken })
        // generate new accessToken
        if (user) {
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
          return res.render(viewRender, { courses, user, isLoggedIn: "true" })
        }
        // invalid token
        else {
          return res
            .status(403)
            .clearCookie("access_token")
            .clearCookie("refresh_token")
            .render("error", { err, message: "Token không hợp lệ, xin vui lòng đăng nhập lại" })
        }
      }
    }
    // token not found
    else {
      return res.render(viewRender, { courses, isLoggedIn: "false", user: {} })
    }
  } catch (err) {
    return res.render("error", { err, message: "Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại" })
  }
}
module.exports = verifyToken
