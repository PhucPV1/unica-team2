const User = require('../models/User');
const Category = require('../models/Course_category');
const Course = require('../models/Course');
const TraineeCourse = require('../models/Trainee_course');
const AdminController = {
  getDashboardView: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user });
      const listTrainees = await User.find({ role_id: 0 });
      const listTrainers = await User.find({ role_id: 1 });
      const listCourseCategories = await Category.find({});
      if (req.user) {
        res.render('admin_view/index', {
          user,
          listTrainees,
          listTrainers,
          listCourseCategories,
        });
      } else {
        res.redirect('/');
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  listCourse: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        const chosenUser = await User.findOne({ _id: req.params.id });
        if (chosenUser.role_id == 0) {
          const courses = await TraineeCourse.find({
            trainee_id: chosenUser._id,
          }).populate({ path: 'course_id', populate: { path: 'trainer_id' } });
          res.render('admin_view/listTraineeCourse', {
            courses,
            user,
            chosenUser,
          });
        } else {
          const courses = await Course.find({
            trainer_id: req.params.id,
          }).populate('trainer_id');
          res.render('admin_view/listCourse', { courses, user, chosenUser });
        }
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
module.exports = AdminController;
