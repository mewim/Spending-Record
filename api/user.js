/*
 * API for User
 */

const express = require('express'),
    router = express.Router();

// POST handler: for creating a new account
router.post('/', function (req, res) {
    res.status(200).send({
        success: true,
        message: "APIs are up and running."
    });
});

// PUT handler: for changing user information
router.put('/', function (req, res) {
    res.status(200).send({
        success: true,
        message: "APIs are up and running."
    });
});

// GET handler: for fetching user information
router.get('/', function (req, res) {
    res.status(200).send({
        success: true,
        message: "APIs are up and running."
    });
});
module.exports = router;