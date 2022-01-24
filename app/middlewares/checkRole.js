const User = require('../models/User');

const checkRole = {
  trainer: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user });
      if (user.role_id == 1) {
        next();
      } else {
        res.send('Bạn không đủ quyền hạn để truy cập trang này');
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  admin: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user });
      if (user.role_id == 2) {
        next();
      } else {
        res.send('Bạn không đủ quyền hạn để truy cập trang này');
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  trainee: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user });
      if (user.role_id == 0) {
        next();
      } else {
        res.send('Bạn không đủ quyền hạn để truy cập trang này');
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
};

module.exports = checkRole;
