/*
 * User Authorization Service Handler
 */

const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'uzf^s2gDMokPeh*j!Jz9aQ@SED2UntDz';
const User = require('../models/user');

/**
 * Compare an entered password with the encrypted password in database
 * @param {String} entered
 * @param {String} encrypted
 * @param {Function} callback
 */
const compare_password = function (entered, encrypted, callback) {
    bcrypt.compare(entered, encrypted, function (err, res) {
        callback(err ? false : res);
    });
};

module.exports = {
    /**
     * Encrypt a user password
     * @param {String} password
     * @param {Function} callback
     */
    encrypt_password: function (password, callback) {
        bcrypt.hash(password, null, null, function (err, hash) {
            if (err) {
                callback(null);
            }
            else {
                callback(hash ? hash : null);
            }
        });
    },

    /**
     * Generate a jwt token based on user id and ip address
     * @param {String} user_id
     * @param {String} ip
     * @return {String} token
     */
    gen_token: function (user_id, ip) {
        if (!user_id) {
            return null;
        }
        if (!ip) {
            return null;
        }
        var time_now = new Date();
        var expire_date = new Date(time_now.setDate(time_now.getDate() + 7));
        var info = {
            user_id: user_id,
            ip: ip,
            expire_date: expire_date,
            timestamp: new Date()
        };
        return jwt.encode(info, TOKEN_SECRET);
    },

    /**
     * Test if a token is valid based on expire date and ip address
     * @param {String} token
     * @param {String} ip
     * @return {Object} result
     */
    test_token: function (token, ip) {
        var info = null;
        try {
            info = jwt.decode(token, TOKEN_SECRET);
        }
        catch (err) {
            return {success: false};
        }
        if (info.expire_date < new Date()) {
            return {success: false};
        }
        if (info.ip != ip) {
            return {success: false};
        }
        else {
            return {
                success: true,
                user_id: info.user_id,
                timestamp: new Date(info.timestamp)
            }
        }
    },


    /**
     * Handles token based user authorization.
     * If token is invalid, the res will be ended with HTTP 401,
     * Otherwise, callback function will be called with user object.
     * @param {Object} req - Express web request object
     * @param {Object} res - Express web response object
     * @param {Function} callback
     */
    auth_token: function (req, res, callback) {
        if ((!req) || (!res) || !(req.body) || !(req.body.token)) {
            res.status(401).end();
            return callback({success: false});
        }
        var body = req.body,
            token = body.token;
        var token_validate = this.test_token(token, req.clientIp);
        if (!token_validate.success) {
            res.status(401).end();
            return callback({success: false});
        }
        User.findOne({_id: token_validate.user_id}, function (error, user) {
            if (error || !user || user.token_timestamp > token_validate.timestamp) {
                res.status(401).end();
                return callback({success: false});
            }
            return callback({success: true, user: user});
        })
    },

    /**
     * Handles password based user authorization.
     * If user/password combination is invalid, the res will be ended with HTTP 401,
     * Otherwise, callback function will be called with user object.
     * @param {Object} req - Express web request object
     * @param {Object} res - Express web response object
     * @param {Function} callback
     */
    auth_password: function (req, res, callback) {
        if ((!req) || (!res) || !(req.body)) {
            return callback({success: false});
        }
        var body = req.body,
            // Username and password entered by user
            username = body.username ? body.username.toLowerCase() : '',
            password = body.password;
        User.findOne({username: username}, function (error, user) {
            if (error) {
                res.status(500).end();
                return callback({success: false});
            }
            if (!user) {
                res.status(401).end();
                return callback({success: false});
            }
            compare_password(password, user.password, function (result) {
                if (!result) {
                    res.status(401).end();
                    return callback({success: false});
                }
                return callback({success: true, user: user});
            });
        })
    }
};