const Course = require('../models/Course');
const User = require('../models/User');
const Category = require('../models/Course_category');
const Trainee_Course = require('../models/Trainee_course');

const CourseController = {
  // GET /overview/:slug/:id
  index: async (req, res) => {
    try {
      let title = '';
      const categories = await Category.find();
      if (req.query.key && req.query.key !== '') {
        title = req.query.key;
      }
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        user.title_search = title;
        res.render('courses', { user, categories });
      } else {
        res.render('courses', {
          user: { title_search: title },
          categories,
        });
      }
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  // POST /courses
  getCourses: async (req, res) => {
    try {
      let length, courses;
      const limit = 4;
      const startFrom = req.body.startFrom;
      // Find courses match data request
      if (req.query.key && req.query.key !== '') {
        courses = await Course.find({
          name: {
            $regex: `.*${req.query.key}.*`,
            $options: '$i',
          },
        });
        length = courses.length;

        courses = await Course.find({
          name: {
            $regex: `.*${req.query.key}.*`,
            $options: '$i',
          },
        })
          .skip(startFrom)
          .limit(limit)
          .populate('trainer_id');
      } else if (req.query.c && req.query.c !== '') {
        courses = await Course.find({ category_id: req.query.c });
        length = courses.length;

        courses = await Course.find({ category_id: req.query.c })
          .skip(startFrom)
          .limit(limit)
          .populate('trainer_id');
      } else {
        courses = await Course.find();
        length = courses.length;

        courses = await Course.find()
          .skip(startFrom)
          .limit(limit)
          .populate('trainer_id');
      }
      // Get cart and courses data of user in order to render interface
      let cart = [];
      let usercourses = [];
      let trainee_courses=[];
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        cart = user.cart;
        usercourses = user.courses;
        for (let i=0;i<usercourses.length;i++){
          trainee_courses.push(await Trainee_Course.findOne({
            trainee_id:req.user,
            course_id:usercourses[i]}
            ));
        }
        
      } else {
        let cartList = req.cookies.cart;
        if (cartList && Array.isArray(JSON.parse(cartList))) {
          cart = JSON.parse(cartList);
        }
      }
      // Find quantity trainee of course
      const quantityOfCourses = await Trainee_Course.aggregate([
        {
          $group: {
            _id: '$course_id',
            count: { $sum: 1 },
          },
        },
      ]);

      const courseList = JSON.parse(JSON.stringify(courses));
      courseList.forEach((course) => {
        quantityOfCourses.forEach((quantity) => {
          if (quantity._id.toString() === course._id.toString())
            course.trainee_count = quantity.count;
        });
        if (!course.trainee_count) course.trainee_count = 0;
      });
      
      // Return json for client
      if (length <= limit + startFrom) {
        res.json({
          courses: courseList,
          cart: cart,
          usercourses: usercourses,
          trainee_courses:trainee_courses,
          end: true,
        });
      } else
        res.json({
          courses: courseList,
          cart: cart,
          usercourses: usercourses,
          trainee_courses,trainee_courses
        });
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
};
module.exports = CourseController;
