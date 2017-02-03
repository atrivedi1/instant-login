'use strict'

const requestPromise = require('request-promise');
const path = require('path');

const cleverAPI = require('../api_keys.js');
const CLIENT_ID = process.env.CLIENT_ID || cleverAPI.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET || cleverAPI.CLIENT_SECRET;
const DISTRICT_ID = process.env.DISTRICT_ID || cleverAPI.DISTRICT_ID;

const APP_LOGIN_URL = process.env.APP_URL || 'http://localhost:3000';
const APP_OAUTH_URL = process.env.OAUTH_URL || 'http://localhost:3000/oauth';

const API_PREFIX = 'https://api.clever.com';
const API_OAUTH_TOKEN_URL = 'https://clever.com/oauth/tokens';

module.exports = {

    renderLogin: function(req, res) {

        res.render('login', {
            'redirect_uri': APP_LOGIN_URL + '/oauth',
            'client_id': CLIENT_ID,
            'district_id': DISTRICT_ID
        });
    },

    verifyUser: function(req, res, cb){
        //if client app has not gotten code, redirect user back to home page
        if(!req.query.code){
            res.redirect('/');
        }

        //otherwise, use code to retrieve an access token
        else {

            let body = {
                'code': req.query.code,
                'grant_type': 'authorization_code',
                'redirect_uri': APP_LOGIN_URL + '/oauth'
            };

            let requestOptionsForAuth = {
                'url': API_OAUTH_TOKEN_URL,
                'method': 'POST',
                'json': body,            
                'headers' : {
                    'Authorization': 'Basic ' + new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
                }
            }

            //request access token
            requestPromise(requestOptionsForAuth)
                .then((result) => {
                    let accessToken = result['access_token'];
                    return accessToken;
                })
                .then((accessToken) => {
    
                    let requestOptionsForUserData = {
                        'url': API_PREFIX + '/me',
                        'json': true,            
                        'headers' : {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }

                    return requestPromise(requestOptionsForUserData)
                        .then((result) => {
                            let data = result['data'];
                            let me = result['links'][0].uri;

                            req.session.user = result['data'];
                            req.session.me = me;

                            res.redirect('/app');
                        })
                        .catch((err) => res.status(500).send("issue rerouting user to app: " + err));

                })
                .catch((err) => res.status(500).send("issue getting access token: " + err));
        }    
    },

    renderDashboard: function(req, res) {
        //if user does not have a session redirect to login page
        if (!req.session.user) {
            res.redirect('/');
        } 
        
        //otherwise render dashboard
        else {
            let userType = req.session.user.type;

            res.render('dashboard', {
                'data': req.session.user,
                'type': userType,
                'url': req.session.me
            });
        }
    },

    logout: function(req, res) {
        //if user not logged in, redirect to login page
        if(!req.session.user){
            res.redirect('/');  
        } 
        
        //otherwise delete session and log user out
        else {
            delete req.session.user;
            res.redirect('/');
        }    
    }
}