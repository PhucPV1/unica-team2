require('dotenv').config();
const Course = require('../models/Course');
const User = require('../models/User');
const Trainee_courses = require('../models/Trainee_course');
const Category = require('../models/Course_category');
const Chapter = require('../models/Chapter');
const Video = require('../models/Video');
const Comment = require('../models/Comment');
const Reply = require('../models/Reply');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Quiz_result = require('../models/Quiz_result');
const Review = require('../models/Review');

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
    res.render('login', { FbAppId: process.env.FB_APPID });
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
        const videoNext = await Video.findOne({
          course_id: courses.course_id._id,
          index: courses.index,
        });
        const chapter = await Chapter.find({ course_id: courses_id.course_id });
        const comment = await Comment.find({
          course_id: courses_id.course_id,
        }).populate({ path: 'user_id' });
        const quiz = await Quiz.find({ course_id: courses_id.course_id });
        // const video = await Video.find({lecture_id: lecture})
        const reply = [];
        for (let index = 0; index < comment.length; index++) {
          const element = await Reply.find({
            comment_id: comment[index]._id,
          }).populate({ path: 'user_id' });
          reply.push(element);
        }
        const video = [];
        for (let index = 0; index < chapter.length; index++) {
          const element = await Video.find({ chapter_id: chapter[index]._id });
          video.push(element);
        }
        const review = await Review.findOne({
          course_id: courses_id.course_id,
        });
        if (courses) {
          res.render('overview', {
            chapter,
            courses,
            user,
            video,
            comment,
            reply,
            review,
            quiz,
            videoNext,
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
        const chapter = await Chapter.find({ course_id: courses_id.course_id });
        const video = await Video.findOne({ _id: req.params.id });
        const comment = await Comment.find({
          course_id: courses_id.course_id,
        }).populate({ path: 'user_id' });

        const reply = [];
        for (let index = 0; index < comment.length; index++) {
          const element = await Reply.find({
            comment_id: comment[index]._id,
          }).populate({ path: 'user_id' });
          reply.push(element);
        }
        const a = video.index + 1;
        const video_list = [];
        for (let index = 0; index < chapter.length; index++) {
          const element = await Video.find({ chapter_id: chapter[index]._id });
          video_list.push(element);
        }
        if (courses) {
          res.render('lecture', {
            a,
            courses,
            user,
            video,
            video_list,
            chapter,
            comment,
            reply,
            baseUrl: process.env.BASE_URL,
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
  Quiz: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('courses');
        const question = await Question.find({ quizzes_id: req.params.id });
        quizzes_id = req.params.id;
        res.render('quiz', { user, question, quizzes_id });
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
  Result: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user }).populate('courses');
      const question = await Question.find({ quizzes_id: req.params.id });
      const quiz = await Quiz.findOne({ _id: req.params.id });
      const trainnee_course = await Trainee_courses.findOne({
        trainee_id: req.user,
        course_id: quiz.course_id,
      });
      let temp = [];
      let result = [];
      for (let index = 0; index < question.length; index++) {
        const element = req.body[index] + JSON.stringify(index);
        temp.push(element);
      }
      let scope = 0;
      for (let index = 0; index < question.length; index++) {
        if (req.body[index] === question[index].correct) {
          scope++;
        }
        for (let i = 0; i < question[index].answer.length; i++) {
          if (i == question[index].correct) {
            result.push(question[index].answer[i]);
          }
        }
      }
      const point = (scope / question.length) * 10;
      const quizzResult = await Quiz_result.findOneAndUpdate(
        { trainee_course_id: trainnee_course._id, quiz_id: req.params.id },
        { point: point },
      );
      if (!quizzResult) {
        Quiz_result.insertMany({
          trainee_course_id: trainnee_course._id,
          quiz_id: req.params.id,
          point: point,
        });
      }
      res.render('result', { user, point, question, temp, result });
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // [POST] / video
  video_update: async (req, res, next) => {
    try {
      const trainee_courses = await Trainee_courses.findOne({
        _id: req.body.trainee_course_id,
      });
      if (req.body.index >= trainee_courses.index) {
        const a = parseInt(req.body.index) + 1;
        await Trainee_courses.findOneAndUpdate(
          { _id: req.body.trainee_course_id },
          { index: a },
        );
        const b = parseInt(req.body.index);
        const video = await Video.find({
          course_id: trainee_courses.course_id,
        });
        const c = (b / video.length) * 100;
        await Trainee_courses.findOneAndUpdate(
          { _id: req.body.trainee_course_id },
          { status: c },
        );
      }
      await Video.findOneAndUpdate({ _id: req.body.id }, { disable: true });
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  Result: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user }).populate('courses');
      const question = await Question.find({ quizzes_id: req.params.id });
      const quiz = await Quiz.findOne({ _id: req.params.id });
      const trainnee_course = await Trainee_courses.findOne({
        trainee_id: req.user,
        course_id: quiz.course_id,
      });
      let temp = [];
      let result = [];
      for (let index = 0; index < question.length; index++) {
        const element = req.body[index] + JSON.stringify(index);
        temp.push(element);
      }
      let scope = 0;
      for (let index = 0; index < question.length; index++) {
        if (req.body[index] === question[index].correct) {
          scope++;
        }
        for (let i = 0; i < question[index].answer.length; i++) {
          if (i == question[index].correct) {
            result.push(question[index].answer[i]);
          }
        }
      }
      const point = (scope / question.length) * 10;

      const quizzResult = await Quiz_result.findOneAndUpdate(
        { trainee_course_id: trainnee_course._id, quiz_id: req.params.id },
        { point: point },
      );
      if (!quizzResult) {
        Quiz_result.insertMany({
          trainee_course_id: trainnee_course._id,
          quiz_id: req.params.id,
          point: point,
        });
      }
      res.render('result', { user, point, question, temp, result });
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
      let sortType = req.query.show;
      // Search
      const query = [
        {
          $lookup: {
            from: 'users',
            localField: 'trainer_id',
            foreignField: '_id',
            as: 'trainer_id',
          },
        },
        {
          $unwind: '$trainer_id',
        },
        {
          $match: {
            $or: [
              {
                name: {
                  $regex: `.*${req.query.name}.*`,
                  $options: '$i',
                },
              },
              {
                'trainer_id.full_name': {
                  $regex: `.*${req.query.name}.*`,
                  $options: '$i',
                },
              },
            ],
          },
        },
        { $skip: perPage * page - perPage },
        { $limit: perPage },
      ];
      if (req.query._sort) {
        query.push({ $sort: sort });
      }
      const courses = await Course.aggregate(query);
      // .populate('trainer_id')
      // .skip(perPage * page - perPage)
      // .limit(perPage)
      // .sort(sort)

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
      if (course) {
        // Get length this course
        const trainee_course = await Trainee_courses.find({
          course_id: course._id,
        });
        course.trainee_count = trainee_course.length;
        // Get chapter of course
        const chapters = await Chapter.find({ course_id: course._id });
        // Get video of course
        const videos = await Video.find({ course_id: course._id });
        if (req.user) {
          const user = await User.findOne({ _id: req.user });
          const trainee_course = await Trainee_courses.findOne({
            trainee_id: req.user,
            course_id: course._id,
          });
          res.render('course-detail', {
            user,
            course,
            trainee_course,
            chapters,
            videos,
          });
        } else {
          let cart = req.cookies.cart;
          if (!cart || !Array.isArray(JSON.parse(cart))) cart = [];
          else cart = JSON.parse(cart);
          res.render('course-detail', {
            user: { cart: cart, courses: [] },
            course,
            chapters,
            videos,
          });
        }
      } else {
        res.redirect('back');
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // POST /:id/review
  review: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        const course = await Course.findOne({ _id: req.params.id });
        await Review.create({
          rating: req.body.rate,
          course_id: req.params.id,
          review: req.body.review,
        });
        const newRating = Math.ceil(
          (course.rating * course.review_count + req.body.rate) /
            (course.review_count + 1),
        );
        await Course.updateOne(
          { _id: req.params.id },
          { review_count: course.review_count + 1, rating: newRating },
        );
        res.json({});
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  getComment: async (req, res) => {
    const startFrom = req.body.startFrom;
    const limit = 4;
    let comments = await Comment.find({ course_id: req.body.id });
    const length = comments.length;
    comments = await Comment.find({ course_id: req.body.id })
      .skip(startFrom)
      .limit(limit)
      .populate('user_id');
    res.json({ comments, length });
  },
};
module.exports = SiteController;
