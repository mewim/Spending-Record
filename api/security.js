/*
 * API for Security
 */

const express = require('express'),
    router = express.Router();
const AuthService = require('../services/auth');
const UserService = require('../services/user');

const SERVER_ERROR = {
    success: false,
    messages: ['There is a server error. Please try again later.']
};

// POST handler: for changing password
router.post('/change_password/', function (req, res) {
    AuthService.auth_password(req, res, function(auth) {
        if(!auth.success){
            return;
        }
        var body = req.body;
        var password_validate = UserService.validate_password(body.new_password, body.new_password);
        if (password_validate.length > 0) {
            return res.status(400).send({
                success: false,
                messages: password_validate
            });
        }
        return AuthService.encrypt_password(body.new_password, function (encrypted) {
            if (!encrypted) {
                return res.status(500).send(SERVER_ERROR);
            }
            auth.user.password = encrypted;
            auth.user.token_timestamp = new Date();
            auth.user.save(function (err) {
                if (err) {
                    return res.status(500).send(SERVER_ERROR);
                }
                return res.status(200).send({success: true});
            });
        });
    });
});

// POST handler: for deauthorizing user on all other devices
router.post('/deauthorize/', function (req, res) {
    AuthService.auth_password(req, res, function(auth){
       if(!auth.success){
           return;
       }
       var user = auth.user;
       user.token_timestamp = new Date();
       user.save(function (err) {
           if (err) {
               return res.status(500).send(SERVER_ERROR);
           }
           return res.status(200).send({
               success: true,
               token: AuthService.gen_token(auth.user._id, req.clientIp)
           });
       });
    });
});
module.exports = router;