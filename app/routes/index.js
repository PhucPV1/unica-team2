const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');
const cartRouter = require('./cartRoutes');
const traineeRouter = require('./traineeRoutes');
const adminRouter = require('./adminRoutes');
const paymentRouter = require('./paymentRoutes');

function route(app) {
  app.use('/cart', cartRouter);
  app.use('/order', paymentRouter);
  app.use('/trainer', trainerRouter);
  app.use('/trainee', traineeRouter);
  app.use('/admin', adminRouter);
  app.use('/', siteRouter);
}

module.exports = route;
