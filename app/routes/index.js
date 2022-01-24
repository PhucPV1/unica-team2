const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');
const cartRouter = require('./cartRoutes');
const userRouter = require('./userRoutes');
const adminRouter = require('./adminRoutes');
const paymentRouter = require('./paymentRoutes');
const courseRouter = require('./courseRoutes');

function route(app) {
  app.use('/courses', courseRouter);
  app.use('/cart', cartRouter);
  app.use('/order', paymentRouter);
  app.use('/user', userRouter);
  app.use('/trainer', trainerRouter);
  app.use('/admin', adminRouter);
  app.use('/', siteRouter);
}

module.exports = route;
