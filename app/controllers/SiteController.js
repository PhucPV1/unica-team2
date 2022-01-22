const Course = require('../models/Course');
const User = require('../models/User');
const Trainee_courses = require('../models/Trainee_course');
const Lecture = require('../models/Lecture');
const Video = require('../models/Video');
const Comment = require('../models/Comment');
const Reply = require('../models/Reply');

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
        const user = await User.findOne({ _id: req.user }).populate('courses');
        const courses = await Trainee_courses.find({ trainee_id: req.user })
          .populate({ path: 'trainee_id', model: 'users' })
          .populate({ path: 'course_id', model: 'courses' });
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
  // [GET] /overview/:id
  overview: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('courses');
        const courses = await Trainee_courses.findOne({
          _id: req.params.id,
          trainee_id: req.user,
        })
          .populate({ path: 'trainee_id' })
          .populate({ path: 'course_id' });
        const courses_id = await Trainee_courses.findOne({
          _id: req.params.id,
        });
        const lecture = await Lecture.find({ course_id: courses_id.course_id });
        const comment = await Comment.find({
          course_id: courses_id.course_id,
        }).populate({ path: 'user_id' });
        // const video = await Video.find({lecture_id: lecture})
        const reply = [];
        for (let index = 0; index < comment.length; index++) {
          const element = await Reply.find({
            comment_id: comment[index]._id,
          }).populate({ path: 'user_id' });
          reply.push(element);
        }
        const video = [];
        for (let index = 0; index < lecture.length; index++) {
          const element = await Video.find({ lecture_id: lecture[index]._id });
          video.push(element);
        }
        if (courses) {
          res.render('overview', {
            lecture,
            courses,
            user,
            video,
            comment,
            reply,
          });
        } else {
          res.redirect('/');
        }
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
  // [GET] / video
  video: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('courses');
        const courses = await Trainee_courses.findOne({
          _id: req.params.slug,
          trainee_id: req.user,
        })
          .populate({ path: 'trainee_id' })
          .populate({ path: 'course_id' });
        const courses_id = await Trainee_courses.findOne({
          _id: req.params.slug,
        });
        const lecture = await Lecture.find({ course_id: courses_id.course_id });
        const video = await Video.findOne({ _id: req.params.id });
        const count_video = await Video.find({
          course_id: courses_id.course_id,
        });
        const video_active = await Video.find({
          course_id: courses_id.course_id,
          disable: true,
        });
        // const comment = await Comment.find({})
        let next_video = 0;
        const a = video.index + 1;
        if (video_active.length === count_video.length) {
          await Trainee_courses.findOneAndUpdate(
            { _id: req.params.slug, trainee_id: req.user },
            { status: 100 },
          );
        } else {
          const temp = ((video_active.length - 1) / count_video.length) * 100;
          await Trainee_courses.findOneAndUpdate(
            { _id: req.params.slug, trainee_id: req.user },
            { status: temp },
          );
        }
        const video_list = [];
        for (let index = 0; index < lecture.length; index++) {
          const element = await Video.find({ lecture_id: lecture[index]._id });
          video_list.push(element);
        }
        if (courses) {
          res.render('lecture', {
            a,
            courses,
            user,
            video,
            video_list,
            lecture,
            next_video,
          });
        } else {
          res.redirect('/');
        }
        if (next_video == 1) {
          await Video.findOneAndUpdate({ _id: video.next }, { disable: true });
        }
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
  // [POST] / video
  video_update: async (req, res, next) => {
    try {
      await Video.findOneAndUpdate({ _id: req.body.id }, { disable: true });
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // [POST] / video
  Comment: async (req, res, next) => {
    try {
      Comment.insertMany(req.body);
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  Reply: async (req, res, next) => {
    try {
      Reply.insertMany(req.body);
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
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
      res.cookie('isLoggedIn', 'false');
      res.redirect('/');
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // [GET] search
  search: async (req, res) => {
    // Sort
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
      // Paging
      const perPage = 8; // Số lượng khóa học hiện trên 1 trang
      const page = req.query.page || 1;
      // let sortType = req.query.show;
      // Search
      const courses = await Course.find({
        name: {
          $regex: `.*${req.query.name}.*`,
          $options: '$i',
        },
        // trainer_id: {
        //   $regex: `.*${req.query.name}.*`
        // }
      })
        .populate('trainer_id')
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort(sort);

      const count = await Course.countDocuments(); // Đếm số trang
      const match = {};
      if (req.query.name) {
        match.name = req.query.name === 'true';
      }
      const searchValue = req.query.name;
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('search', {
          courses, // khóa học trên một trang
          user,
          searchValue,
          current: page, //page hiện tại
          pages: Math.ceil(count / perPage), // tổng số các page
          count: count, // tổng khóa học
        });
      } else {
        res.render('search', {
          courses,
          user: '',
          searchValue,
          current: page, //page hiện tại
          pages: Math.ceil(count / perPage), // tổng số các page
          count: count, // tổng khóa học
        });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // GET /:slug
  detailCourse: async (req, res) => {
    try {
      const course = await Course.findOne({ slug: req.params.slug })
        .populate('category_id')
        .populate('trainer_id');
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('course-detail', { course, user });
      } else {
        let cart = req.cookies.cart;
        if (!cart || !Array.isArray(JSON.parse(cart))) cart = [];
        else cart = JSON.parse(cart);
        res.render('course-detail', {
          user: { cart: cart, courses: [] },
          course,
        });
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
