'use strict'

const controller = require('./login_controller.js')

function router(app) {
  app.get("/", controller.renderLogin)
  app.get("/oauth", controller.verifyUser)
  app.get("/app", controller.renderDashboard)
  app.get("/logout", controller.logout)
}

module.exports = router
