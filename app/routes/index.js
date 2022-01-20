const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');
const cartRouter = require('./cartRoutes');
const traineeRouter = require('./traineeRoutes');
const paymentRouter = require('./paymentRoutes');
const courseRouter=require('./courseRoutes');
function route(app) {
  app.use('/courses',courseRouter);
  app.use('/cart', cartRouter);
  app.use('/order', paymentRouter);
  app.use('/trainer', trainerRouter);
  app.use('/trainee', traineeRouter);
  app.use('/', siteRouter);
}

module.exports = route;
