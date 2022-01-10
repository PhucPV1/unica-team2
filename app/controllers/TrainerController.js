const Course = require('../models/Course');

const CoursesController = {
  // [GET] trainer/createCourse
  // create: (req, res) => {
  //   res.render('course_view/create', { user: '' });
  // },
  // [GET] trainer/updateCourse
  // getUpdateView: (req, res) => {
  //   res.render('course_view/update');
  // },
  // [PATCH] trainer/updateCourse
  // update: (req, res) => {
  //   res.render('course_view/update');
  // },

  //List all of trainer's courses
  //[GET] /trainer
  listTrainerCourse: async (req, res, next) => {
    try {
      const courses = await Course.find({});
      res.render('course_view/index', { courses, user: '' });
    } catch (error) {
      console.log(error);
    }
  },
  //Trainer creates a new course
  //[GET] trainer/createCourse
  getCreateCourseView: async (req, res, next) => {
    res.render('course_view/create', { user: '' });
  },

  //[POST] trainer/createCourse
  postCreateCourse: async (req, res, next) => {
    try {
      await Course.create({
        ...req.body,
        review_count: 01,
        owner_id: '865675',
      });
      res.redirect('/trainer');
    } catch (err) {
      console.log(err);
    }
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
