const User = require('../models/User');

const TraineesController = {
  //Trainee updates profile
  //[GET] trainee/:id/updateProfile
  getUpdateProfileView: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      res.render('trainee_view/update', { user });
    } catch (error) {
      console.log(error);
    }
  },
  //[PATCH] trainee/:id/updateProfile
  updateProfile: async (req, res, next) => {
    try {
      await User.updateOne({ _id: req.params.id }, req.body);
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  },

  //Trainee -> Trainer
  //[GET] trainee/:id/createTrainer
  getCreateTrainerView: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      res.render('trainer_view/register', { user });
    } catch (error) {
      console.log(error);
    }
  },
  //[PATCH] trainee/:id/createTrainer
  createTrainer: async (req, res, next) => {
    try {
      await User.updateOne({ _id: req.params.id }, { ...req.body, role_id: 1 });
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = TraineesController;
