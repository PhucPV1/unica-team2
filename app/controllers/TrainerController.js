const Course = require('../models/Course');
const User = require('../models/User');

const CoursesController = {
  //List all of trainer's courses
  //[GET] /trainer
  listTrainerCourse: async (req, res) => {
    try {
      // const courses = await Course.find({ trainer_id: req.user });
      // console.log(courses);
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        const courses = await Course.find({ trainer_id: req.user }).populate(
          'trainer_id'
        );
        res.render('course_view/index', { courses, user });
      } else {
        res.render('/', { user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  //Trainer creates a new course
  //[GET] trainer/createCourse
  getCreateCourseView: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('course_view/create', { user });
      } else {
        res.render('/', { user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  //[POST] trainer/createCourse
  postCreateCourse: async (req, res) => {
    try {
      if (req.user) {
        await Course.create({
          ...req.body,
          review_count: 01,
          trainer_id: req.user,
        });
        res.redirect('/trainer');
      } else {
        res.render('/', { user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  //Trainer updates info of course
  //[GET] trainer/:id/updateCourse
  getUpdateCourseView: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user });
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('courses');
        res.render('course_view/update', { user });
      } else {
        res.render('/', { user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  //[PATCH] trainer/:id/updateCourse
  updateCourse: async (req, res) => {
    try {
      if (req.user) {
        await Course.updateOne({ _id: req.user }, req.body);
        res.redirect('/trainer');
      } else {
        res.render('/', { user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  //Trainer delete a specific course
  deleteCourse: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        await Course.deleteOne({ _id: req.params.id });
        res.redirect('/trainer');
      } else {
        res.render('/', { user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
};
module.exports = CoursesController;
