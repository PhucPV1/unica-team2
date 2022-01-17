const User = require('../models/User');

const TraineesController = {
  //Trainee updates profile
  //[GET] trainee/updateProfile
  getUpdateProfileView: async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findOne({ _id: req.user });
        res.render('trainee_view/update', { user });
      } else {
        res.render('home', { user: '' });
      }
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
  //[PATCH] trainee/updateProfile
  updateProfile: async (req, res) => {
    try {
      await User.updateOne({ _id: req.params.id }, req.body);
      res.redirect('/trainee/updateProfile');
    } catch (err) {
      return res.render('error', {
        err,
        message: 'Xảy ra lỗi khi nhận dữ liệu từ server, xin thử lại',
      });
    }
  },
};
module.exports = TraineesController;
