const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');
const traineeRouter = require('./traineeRoutes');
const paymentRouter = require('./paymentRoutes');

function route(app) {
  app.use('/trainer', trainerRouter);
  app.use('/trainee', traineeRouter);
  app.use('/order', paymentRouter);
  app.use('/', siteRouter);
}

module.exports = route;
