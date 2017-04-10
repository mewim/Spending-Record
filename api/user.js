/*
 * API for User
 */

const express = require('express'),
    router = express.Router();
const User = require('../models/user');
const UserService = require('../services/user');
const AuthService = require('../services/auth');
const SERVER_ERROR = {
    success: false,
    message: ['There is a server error. Please try again later.']
};

// POST handler: for creating a new account
router.post('/', function (req, res) {
    var body = req.body;
    var user_validate = UserService.validate_user_info(body, true);
    if (!user_validate.success) {
        return res.status(400).send(user_validate);
    }
    User.findOne({username: user_validate.user.username}, function (err, exist_user) {
        if (err) {
            return res.status(500).send(SERVER_ERROR);
        }
        if (exist_user) {
            user_validate.success = false;
            user_validate.message.unshift('The username is taken. Please choose a different one.');
        }
        AuthService.encrypt_password(user_validate.user.password, function (encrypted) {
            if (!encrypted) {
                return res.status(500).send(SERVER_ERROR);
            }
            user_validate.user.password = encrypted;
            User.create(user_validate.user, function (err1, new_user) {
                if (err1) {
                    return res.status(500).send(SERVER_ERROR);
                }
                else {
                    var token = AuthService.gen_token(new_user._id, req.ip);
                    res.status(200).send({
                        success: true,
                        token: token
                    });
                }
            });
        })
    });
});

// PUT handler: for changing user information
router.put('/', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (auth.success) {
            var body = req.body;
            if (body.password) {
                if (!UserService.validate_password(body.password)) {
                    return res.status(400).send({
                        success: false,
                        message: 'The minimum length for your password is 8 characters.'
                    });
                }
                return AuthService.encrypt_password(body.password, function (encrypted) {
                    if (!encrypted) {
                        return res.status(500).send(SERVER_ERROR);
                    }
                    auth.user.password = encrypted;
                    auth.user.save(function (err) {
                        if (err) {
                            return res.status(500).send(SERVER_ERROR);
                        }
                        return res.status(200).send({success: true});
                    });
                });
            }
            var user_validate = UserService.validate_user_info(req.body);
            if (!user_validate.success) {
                return res.status(400).send(user_validate)
            }
            for (var field in user_validate.user) {
                auth.user[field] = user_validate.user[field];
            }
            auth.user.save(function (err) {
                if (err) {
                    return res.status(500).send(SERVER_ERROR);
                }
                return res.status(200).send({success: true});
            });
        }
    });
});

// POST handler: for fetching user information
router.post('/get', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (auth.success) {
            var user = auth.user;
            return res.status(200).send({
                _id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                state: user.state,
                city: user.city,
                zipcode: user.zipcode
            });
        }
    });
});
module.exports = router;