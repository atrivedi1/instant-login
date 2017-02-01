'use strict'

const controller = require('./login_controller.js')

function router(app) {
  app.get("/oauth", controller.verifyUser)
}

module.exports = router
