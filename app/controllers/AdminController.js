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
  //[GET] admin/createCategory
  getCreateCategoryView: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('courseCategory_view/create', { user });
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
  //[POST] admin/createCategory
  postCreateCategory: async (req, res) => {
    try {
      if (req.user) {
        await Category.create(req.body);
        res.redirect('/admin');
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
  //[GET] admin/:id/updateCategory
  getUpdateCategoryView: async (req, res) => {
    try {
      const category = await Category.findOne({ _id: req.params.id });
      const user = await User.findOne({ _id: req.user });
      if (req.user) {
        res.render('courseCategory_view/update', { user, category });
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
  //[PATCH] admin/:id/updateCategory
  updateCategory: async (req, res) => {
    try {
      if (req.user) {
        await Category.updateOne({ _id: req.params.id }, req.body);
        res.redirect('/admin');
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
  //Admin delete a specific category
  deleteCategory: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        await Category.deleteOne({ _id: req.params.id });
        res.redirect('/admin');
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
};
module.exports = AdminController;
