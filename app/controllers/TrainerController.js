const Course = require('../models/Course');

const CoursesController = {
  // [GET] trainer/createCourse
  create: (req, res) => {
    res.render('course_view/create');
  },
  // [GET] trainer/updateCourse
  getUpdateView: (req, res) => {
    res.render('course_view/update');
  },
  update: (req, res) => {
    res.render('course_view/update');
  },
};
module.exports = CoursesController;
