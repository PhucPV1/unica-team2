const { aggregate } = require('../models/Course');
const Course = require('../models/Course');
const User = require('../models/User');

const SiteController = {
  // [GET] / home
  home: async (req, res) => {
    try {
      const courses = await Course.find({});
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
  // [GET] / register
  register: (req, res) => {
    res.render('trainee_view/register');
  },
  // [GET] / info
  info: async (req, res) => {
    try {
      const courses = await Course.find({});
      if (req.user) {
        const user = await User.findOne({ _id: req.user }).populate('courses');
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
  // [POST] / info/logout
  logout: async (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    const refreshToken = req.cookies.refresh_token;
    await User.updateOne({ refreshToken }, { refreshToken: '' });
    try {
      const courses = await Course.find({});
      res.cookie('isLoggedIn', 'false');
      res.render('home', {
        courses: courses,
        user: '',
      });
    } catch (err) {
      res.render('error', {
        err,
        message: 'Có lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },

  // [GET] search
  search: async (req, res) => {

    try {
      //   const searchInput = req.query.title;
      //   const course = await Course.find({});
      //   const courseArray = [];
      //   course.forEach((a) => {
      //       if(a.title.indexOf(searchInput) !== -1) {
      //           courseArray.push(a);
      //       }
      //       // console.log(a);
      //   }) 
      //   res.json({data: course, mess: 'ok', status: 200})
      // console.log(course);
      // console.log(courseArray);
      const sort = {}
      if (req.query._sort) {
        const str = req.query._sort.split(':')

        if (str[1] === 'desc') {
          sort[str[0]] = -1;
        } else {
          sort[str[0]] = 1;
        }
        // sort[str[0]] = str[1] === 'desc' ? -1:1

      }
      const courses = await Course.find(
        {
          name: {
            $regex: `.*${req.query.name}.*`,
            // $option: 'i'
          },
          // trainer_id: {
          //   $regex: `.*${req.query.name}.*`
          // }
        }).sort(sort);

      // aggregate.sort({ field: 'asc', test: -1 });
      // aggregate.sort('field -test');  


      // Sort 

      // if (req.query.hasOwnProperty('_sort')) {
      //   // res.json({ message: 'successfully!'});
      //   courses = courses.sort({
      //     [req.query.column]: req.query.type
      //   });
      // }


      const match = {}


      if (req.query.name) {
        match.name = req.query.name === 'true'
      }

      // try {
      //     await req.query.populate({
      //       path: 'task',
      //       match,
      //       options: {
      //           limit: parseInt(req.query.limit),
      //           skip: parseInt(req.query.skip),
      //           sort: sort      
      //       }
      //     }).execPopulate();
      //     res.status(200).send(req.courses.tasks)
      // } catch(e) {
      //     res.status(400).send(e.message)
      // }

      const searchValue = req.query.name
      res.render('search', {
        courses,
        user: '',
        searchValue,
        // match,
        // sort
      })

      // console.log(search);

    } catch (error) {
      console.log(error)
      // res.json({ status: 500, error, mess: 'server error' })
    }
  }
};
module.exports = SiteController;
