/*
 * API for User Authorization
 */

const express = require('express'),
    router = express.Router();
const AuthService = require('../services/auth');

// POST handler: for user authorization
router.post('/', function (req, res) {
    var body = req.body;
    if (body.token) {
        return AuthService.auth_token(req, res, function (result) {
            if (result.success) {
                return res.status(200).send({
                    success: true,
                    token: AuthService.gen_token(result.user._id, req.ip)
                });
            }
        });
    }
    AuthService.auth_password(req, res, function (result) {
        if (result.success) {
            return res.status(200).send({
                sucess: true,
                token: AuthService.gen_token(result.user._id, req.ip)
            });
        }
    });
});
module.exports = router;