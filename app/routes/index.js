const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');

function route(app) {
  app.use('/trainer', trainerRouter);
  app.use('/', siteRouter);
}

module.exports = route;
