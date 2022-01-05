const siteRouter = require("./siteRoutes")

function route(app) {
  app.use("/", siteRouter)
}

module.exports = route
