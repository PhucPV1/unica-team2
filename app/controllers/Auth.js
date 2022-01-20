require('dotenv').config();
const User = require('../models/User.js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const auth = {
  // [POST] /Register
  register: async (req, res) => {
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const password = req.body.password;
    try {
      // check for existing user
      const user =
        (await User.findOne({ email })) ||
        (await User.findOne({ phone_number }));
      if (user) {
        return res.json({ success: false });
      } else {
        //   all good
        const hashedPassword = await argon2.hash(password);
        await User.create({
          ...req.body,
          password: hashedPassword,
          role_id: 0,
          activation: true,
        });
        return res.json({ success: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).render('error', {
        err,
        message: 'Xảy ra lỗi trong quá trình đăng ký, xin thử lại',
      });
    }
  },
  // [POST] /RegisterTrainer
  registerTrainer: async (req, res) => {
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const password = req.body.password;
    try {
      // check for existing user
      const user =
        (await User.findOne({ email })) ||
        (await User.findOne({ phone_number }));
      if (user) {
        return res.json({ success: false });
      } else {
        //   all good
        const hashedPassword = await argon2.hash(password);
        await User.create({
          ...req.body,
          password: hashedPassword,
          role_id: 1,
        });
        return res.json({ success: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).render('error', {
        err,
        message: 'Xảy ra lỗi trong quá trình đăng ký, xin thử lại',
      });
    }
  },
  // [POST] /Login
  login: async (req, res) => {
    const { email_or_phone, password } = req.body;
    try {
      const user =
        (await User.findOne({ email: email_or_phone }).populate('courses')) ||
        (await User.findOne({ phone_number: email_or_phone }).populate(
          'courses',
        ));
      //   check for existing email or phone
      if (!user) {
        return res.json({ success: false });
      }

      //   authenticate password
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return res.json({ success: false });
      }

      //   all good
      if (user.activation == false) res.json({ activation: false });
      const accessToken = jwt.sign(
        { _id: user._id },
        `${process.env.signature}`,
        { expiresIn: '1d' },
      );
      const refreshToken = jwt.sign(
        { _id: user._id },
        `${process.env.signature}`,
        { expiresIn: '10d' },
      );
      await User.updateOne({ _id: user._id }, { refreshToken });
      res.cookie('access_token', accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true;
      });
      res.cookie('refresh_token', refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true;
      });
      switch (user.role_id) {
        case 0:
          return res.json({ success: true, role: 'trainee' });
          break;
        case 1:
          return res.json({ success: true, role: 'trainer' });
          break;
        case 2:
          return res.json({ success: true, role: 'admin' });
          break;
        default:
          return res.json({ success: true, role: 'trainee' });
          break;
      }
    } catch (err) {
      res.status(500).render('error', {
        err,
        success: false,
        message: 'Đã xảy ra lỗi, vui lòng thử lại',
      });
    }
  },
  // [POST] /socialLogin
  socialLogin: async (req, res) => {
    const email = req.body.email;
    const password = 'unica';
    const hashedPassword = await argon2.hash(password);
    try {
      const user = await User.findOne({ email }).populate('courses');
      //   check for existing user
      if (!user) {
        await User.create({
          ...req.body,
          password: hashedPassword,
          role_id: 0,
          activation: true,
        });
        const newUser = await User.findOne({ email }).populate('courses');
        const accessToken = jwt.sign(
          { _id: newUser._id },
          `${process.env.signature}`,
          { expiresIn: '1d' },
        );
        const refreshToken = jwt.sign(
          { _id: newUser._id },
          `${process.env.signature}`,
          { expiresIn: '10d' },
        );
        await User.updateOne({ _id: newUser._id }, { refreshToken });
        res.cookie('access_token', accessToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          // secure: true;
        });
        res.cookie('refresh_token', refreshToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          // secure: true;
        });
        switch (newUser.role_id) {
          case 0:
            return res.json({ success: true, role: 'trainee' });
            break;
          case 1:
            return res.json({ success: true, role: 'trainer' });
            break;
          case 2:
            return res.json({ success: true, role: 'admin' });
            break;
          default:
            return res.json({ success: true, role: 'trainee' });
            break;
        }
      } else {
        if (user.activation == false) res.json({ activation: false });
        // generate token
        const accessToken = jwt.sign(
          { _id: user._id },
          `${process.env.signature}`,
          { expiresIn: '1d' },
        );
        const refreshToken = jwt.sign(
          { _id: user._id },
          `${process.env.signature}`,
          { expiresIn: '10d' },
        );
        await User.updateOne({ _id: user._id }, { refreshToken });
        res.cookie('access_token', accessToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          // secure: true;
        });
        res.cookie('refresh_token', refreshToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          // secure: true;
        });
        switch (user.role_id) {
          case 0:
            return res.json({ success: true, role: 'trainee' });
            break;
          case 1:
            return res.json({ success: true, role: 'trainer' });
            break;
          case 2:
            return res.json({ success: true, role: 'admin' });
            break;
          default:
            return res.json({ success: true, role: 'trainee' });
            break;
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).render('error', {
        err,
        success: false,
        message: 'Đã xảy ra lỗi, vui lòng thử lại',
      });
    }
  },
};
module.exports = auth;
