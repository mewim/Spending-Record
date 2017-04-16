/*
 * API for Category
 */

const express = require('express'),
    router = express.Router();
const User = require('../models/user');
const UserService = require('../services/user');
const AuthService = require('../services/auth');
const SERVER_ERROR = {
    success: false,
    messages: ['There is a server error. Please try again later.']
};

// POST handler: for creating a new category
router.post('/', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var user = auth.user;
        var body = req.body;
        if (!body.category) {
            return res.status(400).end();
        }
        if (user.categories.indexOf(body.category) != -1) {
            return res.status(400).end();
        }
        try {
            user.categories.push(body.category);
        }
        catch (err) {
            return res.status(500).end();
        }
        user.save(function (err) {
            if (err) {
                return res.status(501).end();
            }
            return res.status(200).end();
        });
    });
});

// POST handler: for fetching all categories for a given user
router.post('/get', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var user = auth.user;
        return res.status(200).send(user.categories);
    });
});

// POST handler: for removing a category
router.post('/d', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var body = req.body;
        if (!body.category) {
            return res.status(404).end();
        }
        var user = auth.user;
        try {
            user.categories.pull(body.category);
        }
        catch (err) {
            return res.status(404).end();
        }
        user.save(function (err) {
            if (err) {
                return res.status(501).end();
            }
            return res.status(200).end();
        });
    });
});
module.exports = router;