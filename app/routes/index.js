const coursesRouter = require("./coursesRoutes")
const siteRouter = require("./siteRoutes")

function route(app) {
  app.use("/courses", coursesRouter)
  app.use("/", siteRouter)
}

module.exports = route
