'use strict'

const requestPromise = require('request-promise');

const cleverAPI = require('./api_keys.js');
const CLIENT_ID = process.env.CLIENT_ID || cleverAPI.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET || cleverAPI.CLIENT_SECRET;

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const API_PREFIX = 'https://api.clever.com';
const OAUTH_TOKEN_URL = 'https://clever.com/oauth/tokens';



module.exports = {
    redirect: function(req, res, cb){
        console.log("trying to redirect");
        
        res.render('index', {
            'redirect_uri': encodeURIComponent(APP_URL + '/oauth'),
            'client_id': CLIENT_ID        
        })
    },

    userInfo: function(req, res, cb) {
        console.log("trying to get user info", req.body)
    }
}