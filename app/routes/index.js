const siteRouter = require('./siteRoutes');
const trainerRouter = require('./trainerRoutes');
const cartRouter=require('./cartRoutes');

function route(app) {
  app.use('/cart',cartRouter);
  app.use('/trainer', trainerRouter);
  app.use('/', siteRouter);
}

module.exports = route;
