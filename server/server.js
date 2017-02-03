'use strict'

//dependencies
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

//create instance of express
const app = express();

//middleware
app.use(express.static("./views"));
app.use(bodyParser.json());

app.use(session({ 
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

//connect on routes
require('./routes.js')(app)

//set up port to listen on
let port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Instant login app listening on port ' + port + '!');
});