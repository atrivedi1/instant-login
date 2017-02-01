'use strict'

const requestPromise = require('request-promise');
const session = require('express-session')
const path = require('path');

const cleverAPI = require('../api_keys.js');
const CLIENT_ID = process.env.CLIENT_ID || cleverAPI.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET || cleverAPI.CLIENT_SECRET;

const APP_LOGIN_URL = process.env.APP_URL || 'http://localhost:3000';
const APP_OAUTH_URL = process.env.OAUTH_URL || 'http://localhost:3000/oauth';

const API_PREFIX = 'https://api.clever.com';
const API_OAUTH_TOKEN_URL = 'https://clever.com/oauth/tokens';


module.exports = {
    verifyUser: function(req, res, cb){
        console.log("trying to grab auth token", req.query.code); 
        
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
                    console.log("successfully grabbed data", result);
                    let accessToken = result['access_token'];
                    return accessToken;
                })
                .then((accessToken) => {
                    console.log(" access token -->", accessToken);

                    let requestOptionsForUserData = {
                        'url': API_PREFIX + '/me',
                        'json': true,            
                        'headers' : {
                            'Authorization': 'Bearer ' + accessToken
                        }
                    }

                    return requestPromise(requestOptionsForUserData)
                        .then((result) => {
                            console.log("result -->", result)
                            req.session.user = result['data'];                        
                            res.redirect('/app');
                        })
                        .catch((err) => res.status(500).send("issue rerouting user to app: " + err));

                })
                .catch((err) => res.status(500).send("issue getting access token: " + err));
        }    
    },
}