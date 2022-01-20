const Course = require("../models/Course");
const User = require("../models/User");
const Trainee_courses = require("../models/Trainee_course");
const Category = require("../models/Course_category");

const SiteController = {
  // [GET] / home
  home: async (req, res) => {
    try {
      const courses = await Course.find({});
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render("home", { courses, user });
      } else {
        res.render("home", { courses, user: "" });
      }
    } catch (err) {
      return res.render("error", {
        err,
        message: "Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại",
      });
    }
  },
  // [GET] / login
  login: (req, res) => {
    res.render("login");
  },
  // [GET] / register
  register: (req, res) => {
    res.render("trainee_view/register");
  },
  // [GET] / info
  info: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user })
          .populate("courses")
          .populate("cart");
        // const trainee_courses = await Trainee_courses.find({ trainee_id: user._id });
        // const courses = [];
        // for (let index = 0; index < trainee_courses.length; index++) {
        //   courses.push(await Course.findOne({ _id: trainee_courses[index].course_id }));
        // }
        const courses = user.courses;
        res.render("info", { courses, user });
      } else {
        return res.status(401).render("error", {
          err: "",
          message: "Xin vui lòng đăng nhập để truy cập trang này",
        });
      }
    } catch (err) {
      return res.render("error", {
        err,
        message: "Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại",
      });
    }
  },
  // [POST] / info/logout
  logout: async (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    const refreshToken = req.cookies.refresh_token;
    await User.updateOne({ refreshToken }, { refreshToken: "" });
    try {
      const courses = await Course.find({});
      res.cookie("isLoggedIn", "false");
      res.render("home", {
        courses: courses,
        user: "",
      });
    } catch (err) {
      res.render("error", {
        err,
        message: "Có lỗi khi nhận dữ liệu từ server, xin thử lại",
      });
    }
  },

  // [GET] search
  search: async (req, res) => {
    try {
      const sort = {};
      if (req.query._sort) {
        const str = req.query._sort.split(":");
        if (str[1] === "desc") {
          sort[str[0]] = -1;
        } else {
          sort[str[0]] = 1;
        }
      }
      const courses = await Course.find({
        name: {
          $regex: `.*${req.query.name}.*`,
          $options: "$i",
        },
        // trainer_id: {
        //   $regex: `.*${req.query.name}.*`
        // }
      }).sort(sort);
      const match = {};
      if (req.query.name) {
        match.name = req.query.name === "true";
      }
      const searchValue = req.query.name;
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render("search", { courses, user, searchValue });
      } else {
        res.render("search", { courses, user: "", searchValue });
      }
    } catch (err) {
      return res.render("error", {
        err,
        message: "Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại",
      });
    }
  }, 
  // GET /:slug
  detailCourse: async (req,res)=>{
    try {
        const course = await Course.findOne({ slug: req.params.slug })
          .populate("category_id")
          .populate("trainer_id");

        if (req.user) {
          const user = await User.findOne({ _id: req.user });
          res.render("course-detail", { course, user });
        } else {
          let cart=req.cookies.cart;
          if (!cart||!Array.isArray(JSON.parse(cart))) cart=[];
          else cart=JSON.parse(cart);
          res.render("course-detail", { user: { cart:cart,courses:[]}, course });
        }
      } catch (err) {
        return res.render("error", {
          err,
          message: "Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại",
        });
      }
}
  
};
module.exports = SiteController;
