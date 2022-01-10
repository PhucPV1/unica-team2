const Course = require('../models/Course');
const User = require('../models/User');

const CoursesController = {
  //List all of trainer's courses
  //[GET] /trainer
  listTrainerCourse: async (req, res, next) => {
    try {
      const courses = await Course.find({ trainer_id: req.user }).populate('trainer_id');
      // const courses = await Course.find({ trainer_id: req.user });
      console.log('🚀 courses', courses);
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('course_view/index', { courses, user });
      } else {
        res.render('/', { courses, user: '' });
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
  getCreateCourseView: async (req, res, next) => {
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
  postCreateCourse: async (req, res, next) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
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
    // try {
    //   await Course.create({
    //     ...req.body,
    //     review_count: 01,
    //     owner_id: '865675',
    //   });
    //   res.redirect('/trainer');
    // } catch (err) {
    //   console.log(err);
    // }
  },
  //Trainer updates info of course
  //[GET] trainer/:id/updateCourse
  getUpdateCourseView: async (req, res, next) => {
    try {
      const course = await Course.findOne({ _id: req.params.id });
      res.render('course_view/update', { course, user: '' });
    } catch (error) {
      console.log(error);
    }
  },

  //[PATCH] trainer/:id/updateCourse
  updateCourse: async (req, res, next) => {
    try {
      await Course.updateOne({ _id: req.params.id }, req.body);
      res.redirect('/trainer');
    } catch (error) {
      console.log(error);
    }
  },
  //Trainer delete a specific course
  deleteCourse: async (req, res, next) => {
    try {
      await Course.deleteOne({ _id: req.params.id });
      res.redirect('/trainer');
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = CoursesController;
