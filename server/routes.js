'use strict'

const controller = require('./login_controller.js')

function router(app) {
  app.get("/", controller.redirect)

  app.post("/me", controller.userInfo)
}

module.exports = router
