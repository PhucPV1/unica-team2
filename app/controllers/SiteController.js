const Course = require('../models/Course');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../helpers/verifyToken');

const SiteController = {
  // [GET] / home
  home: (req, res) => {
    verifyToken(req, res, 'home');
  },
  // [GET] / login
  login: (req, res) => {
    res.render('login');
  },
  // [GET] / register
  register: (req, res) => {
    res.render('trainee_view/register');
  },
  // [GET] / info
  info: async (req, res) => {
    try {
      const token = req.cookies.access_token;
      // token found
      if (token) {
        try {
          const decoded = jwt.verify(token, `${process.env.signature}`);
          const user = await User.findOne({ _id: decoded._id }).populate(
            'courses'
          );
          return res.render('info', { user, isLoggedIn: 'true' });
        } catch (err) {
          // token expired or invalid
          const refreshToken = req.cookies.refresh_token;
          user = await User.findOne({ refreshToken }).populate('courses');
          // generate new accessToken
          if (user) {
            const accessToken = jwt.sign(
              { _id: user._id },
              `${process.env.signature}`,
              { expiresIn: '10s' }
            );
            const refreshToken = jwt.sign(
              { _id: user._id },
              `${process.env.signature}`,
              { expiresIn: '10h' }
            );
            await User.updateOne({ _id: user._id }, { refreshToken });
            res.cookie('access_token', accessToken, {
              maxAge: 7 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              // secure: true;
            });
            res.cookie('refresh_token', refreshToken, {
              maxAge: 7 * 24 * 60 * 60 * 1000,
              httpOnly: true,
              // secure: true;
            });
            return res.render('info', { user, isLoggedIn: 'true' });
          }
          // invalid token
          else {
            return res
              .status(403)
              .clearCookie('access_token')
              .clearCookie('refresh_token')
              .render('error', {
                err,
                message: 'Token không hợp lệ, xin vui lòng đăng nhập lại',
              });
          }
        }
      }
      // token not found
      else {
        return res.status(401).render('error', {
          err: '',
          message: 'Xin vui lòng đăng nhập để truy cập trang này',
        });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // [POST] / info/logout
  logout: async (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    const refreshToken = req.cookies.refresh_token;
    await User.updateOne({ refreshToken }, { refreshToken: '' });
    try {
      const courses = await Course.find({});
      res.render('home', {
        courses: courses,
        isLoggedIn: 'false',
        user: {},
      });
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
};
module.exports = SiteController;
