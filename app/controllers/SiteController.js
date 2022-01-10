const Course = require('../models/Course');
const User = require('../models/User');
const Trainee_courses = require("../models/Trainee_course")

const SiteController = {
  // [GET] / home
  home: async (req, res) => {
    try {
      const courses = await Course.find({});
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('home', { courses, user });
      } else {
        res.render('home', { courses, user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
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
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('courses');
        const trainee_courses = await Trainee_courses.find({ trainee_id: user._id })
        const courses = []
        for (let index = 0; index < trainee_courses.length; index++) {
          courses.push( await Course.findOne({_id: trainee_courses[index].course_id}))
          
        }
        res.render('info', { courses, user });
      } else {
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
      res.cookie('isLoggedIn', 'false');
      res.render('home', {
        courses: courses,
        user: '',
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
