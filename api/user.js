/*
 * API for User
 */

const express = require('express'),
    router = express.Router();
const User = require('../models/user');
const UserService = require('../services/user');
const AuthService = require('../services/auth');
const DEFAULT_CATEGORIES = ['Food', 'Clothing', 'Grocery', 'Rent', 'Travel', 'Education', 'Entertainment', 'Health'];
const SERVER_ERROR = {
    success: false,
    messages: ['There is a server error. Please try again later.']
};

// POST handler: for creating a new account
router.post('/', function (req, res) {
    var body = req.body;
    var user_validate = UserService.validate_user_info(body, true);
    User.findOne({username: user_validate.user ? user_validate.user.username : ''}, function (err, exist_user) {
        if (err) {
            return res.status(500).send(SERVER_ERROR);
        }
        if (exist_user) {
            user_validate.success = false;
            user_validate.messages.unshift('The username is taken. Please choose a different one.');
        }
        if (!user_validate.success) {
            delete user_validate.user;
            return res.status(400).send(user_validate);
        }
        AuthService.encrypt_password(user_validate.user.password, function (encrypted) {
            if (!encrypted) {
                return res.status(500).send(SERVER_ERROR);
            }
            user_validate.user.password = encrypted;
            user_validate.user.categories = DEFAULT_CATEGORIES;
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
        if (!auth.success) {
            return;
        }
        var body = req.body;
        if (body.password) {
            var password_validate = UserService.validate_password(body.password, body.password);
            if (password_validate.length > 0) {
                return res.status(400).send({
                    success: false,
                    messages: password_validate
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
        User.findOne({username: user_validate.user ? user_validate.user.username : ''}, function (err, exist_user) {
            if (err) {
                return res.status(500).send(SERVER_ERROR);
            }
            if (exist_user && exist_user.username != auth.user.username) {
                user_validate.success = false;
                user_validate.messages.unshift('The username is taken. Please choose a different one.');
            }
            if (!user_validate.success) {
                delete user_validate.user;
                return res.status(400).send(user_validate);
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
        });
    });
});

// POST handler: for fetching user information
router.post('/get', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
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
    });
});
module.exports = router;