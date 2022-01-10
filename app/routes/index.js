const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');
const traineeRouter = require('./traineeRoutes');

function route(app) {
  app.use('/trainer', trainerRouter);
  app.use('/trainee', traineeRouter);
  app.use('/', siteRouter);
}

module.exports = route;
