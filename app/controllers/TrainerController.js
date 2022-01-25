const Course = require('../models/Course');
const User = require('../models/User');
const Trainee_course = require('../models/Trainee_course');
const Category = require('../models/Course_category');
const Chapter = require('../models/Chapter');
const Quiz = require('../models/Quiz');
const Video = require('../models/Video');
const Question = require('../models/Question');
const mongoose = require('mongoose');

const TrainersController = {
  //List all of trainer's courses
  //[GET] /trainer
  listTrainerCourse: async (req, res) => {
    try {
      // const courses = await Course.find({ trainer_id: req.user });
      // console.log(courses);
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        const courses = await Course.find({ trainer_id: req.user }).populate(
          'trainer_id',
        );
        res.render('course_view/index', { courses, user });
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
  //Trainer creates a new course
  //[GET] trainer/createCourse
  getCreateCourseView: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        const categories = await Category.find({});
        res.render('course_view/create', { user, categories });
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
  getCourseDetail: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        const chapter = await Chapter.find({ course_id: req.params.id });
        const quiz = await Quiz.find({ course_id: req.params.id });
        const video = await Video.find({ course_id: req.params.id });
        const courseID = req.params.id;
        res.render('course_view/DetailCourse', {
          user,
          chapter,
          courseID,
          quiz,
          video,
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
  getCreateDetail: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        const quiz = await Quiz.find({ course_id: req.params.id });
        const id = req.params.id;
        const chapter = await Chapter.find({ course_id: id });
        res.render('course_view/CreateChapter', { user, id, chapter, quiz });
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

  //[POST] trainer/createCourse
  postCreateQuiz: async (req, res) => {
    try {
      if (req.user) {
        console.log(req.body);
        const objectId = mongoose.Types.ObjectId(req.params.id);
        await Quiz.create({
          course_id: objectId,
          title: req.body.name,
        });
        res.redirect('/trainer/createCourseDetail/' + req.params.id);
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
  postCreateQuestion: async (req, res) => {
    try {
      if (req.user) {
        console.log(req.body);
        const objectId = mongoose.Types.ObjectId(req.params.id);
        await Question.create({
          ...req.body,
        });
        res.redirect('/trainer/createCourseDetail/' + req.params.id);
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
  postCreateChapter: async (req, res) => {
    try {
      if (req.user) {
        console.log(req.body);
        const objectId = mongoose.Types.ObjectId(req.params.id);
        const chapter = await Chapter.find({ course_id: req.params.id });
        const index = chapter.length + 1;
        await Chapter.create({
          course_id: objectId,
          title: req.body.title,
          index: index,
        });
        res.redirect('/trainer/createCourseDetail/' + req.params.id);
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

  //[POST] trainer/createCourse
  postCreateVideo: async (req, res) => {
    try {
      if (req.user) {
        const temp = await Video.find({ course_id: req.params.id });
        const index = temp.length + 1;
        const chapter = await Chapter.find({ course_id: req.params.id });
        const countChapter = chapter.length;
        const chapterLaste = await Chapter.findOne({
          course_id: req.params.id,
          index: countChapter,
        });
        await Video.create({
          chapter_id: chapterLaste._id,
          disable: req.body.disable,
          title: req.body.title,
          URL: req.body.URL,
          course_id: req.params.id,
          index: index,
        });

        res.redirect('/trainer/createCourseDetail/' + req.params.id);
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
  //[POST] trainer/createCourse
  postCreateCourse: async (req, res) => {
    try {
      if (req.user) {
        await Course.create({
          ...req.body,
          review_count: 00,
          trainer_id: req.user,
        });
        res.redirect('/trainer');
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
  //Trainer updates info of course
  //[GET] trainer/:id/updateCourse
  getUpdateCourseView: async (req, res) => {
    try {
      const course = await Course.findOne({ _id: req.params.id });
      const user = await User.findOne({ _id: req.user });
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('courses');
        res.render('course_view/update', { user, course });
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
  //[PATCH] trainer/:id/updateCourse
  updateCourse: async (req, res) => {
    try {
      if (req.user) {
        await Course.updateOne({ _id: req.params.id }, req.body);
        res.redirect('/trainer');
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
  //Trainer delete a specific course
  deleteCourse: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        await Course.deleteOne({ _id: req.params.id });
        res.redirect('/trainer');
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

  //Trainer view the list of trainee in each course
  getListTraineeView: async (req, res) => {
    try {
      const course = await Course.findOne({ _id: req.params.id });
      const user = await User.findOne({ _id: req.user });
      const trainee_courses = await Trainee_course.find({
        course_id: course._id,
      }).populate('trainee_id');
      if (req.user) {
        res.render('course_view/listTrainee', {
          user,
          course,
          trainee_courses,
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
};
module.exports = TrainersController;
