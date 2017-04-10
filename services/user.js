/*
 * User Model Service Handler
 */

const User = require('../models/user');

module.exports = {
    /**
     * Encrypt a user password
     * @param {String} password
     * @param {Function} callback
     */
    validate_user_info: function (user_info) {

    },

    /**
     * Compare an entered password with the encrypted password in database
     * @param {String} entered
     * @param {String} encrypted
     * @param {Function} callback
     */
    username_used: function (username) {

    }
};