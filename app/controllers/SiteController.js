const Course = require('../models/Course');
const User = require('../models/User');
const Trainee_courses = require('../models/Trainee_course');
const Category = require('../models/Course_category');

const SiteController = {
  // [GET] / home
  home: async (req, res) => {
    try {
      const courses = await Course.find({}).populate('trainer_id');
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
  // [GET] / register Trainee
  register: (req, res) => {
    res.render('trainee_view/register');
  },
  // [GET] / register Trainer
  registerTrainer: (req, res) => {
    res.render('trainer_view/register');
  },
  // [GET] / info
  info: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate({
          path: 'courses',
          populate: { path: 'trainer_id' },
        });
        // const trainee_courses = await Trainee_courses.find({ trainee_id: user._id });
        // const courses = [];
        // for (let index = 0; index < trainee_courses.length; index++) {
        //   courses.push(await Course.findOne({ _id: trainee_courses[index].course_id }));
        // }
        const courses = user.courses;
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
  // [GET] / donggia
  samePrice: async (req, res) => {
    try {
      let title = '';
      const categories = await Category.find();
      if (req.query.key && req.query.key !== '') {
        courses = await Course.find({
          name: {
            $regex: `.*${req.query.key}.*`,
            $options: '$i',
          },
        });
        title = req.query.key;
      } else if (req.query.c && req.query.c !== '') {
        courses = await Course.find({ category_id: req.query.c });
      } else {
        courses = await Course.find();
      }
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        user.title_search = title;
        res.render('same_price', { user, courses, categories });
      } else {
        res.render('same_price', { user: { title_search: title }, courses, categories, title });
      }
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // [GET] search
  search: async (req, res) => {
    try {
      const sort = {};
      if (req.query._sort) {
        const str = req.query._sort.split(':');
        if (str[1] === 'desc') {
          sort[str[0]] = -1;
        } else {
          sort[str[0]] = 1;
        }
      }
      const courses = await Course.find({
        name: {
          $regex: `.*${req.query.name}.*`,
          $options: '$i',
        },
        // trainer_id: {
        //   $regex: `.*${req.query.name}.*`
        // }
      }).sort(sort);
      const match = {};
      if (req.query.name) {
        match.name = req.query.name === 'true';
      }
      const searchValue = req.query.name;
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('search', { courses, user, searchValue });
      } else {
        res.render('search', { courses, user: '', searchValue });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
};
module.exports = SiteController;
