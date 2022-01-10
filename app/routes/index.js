const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');
const cartRouter=require('./cartRoutes');
const traineeRouter = require('./traineeRoutes');

function route(app) {
  app.use('/cart',cartRouter);
  app.use('/trainer', trainerRouter);
  app.use('/trainee', traineeRouter);
  app.use('/', siteRouter);
}

module.exports = route;
