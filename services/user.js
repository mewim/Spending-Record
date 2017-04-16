/*
 * User Model Service Handler
 */

const User = require('../models/user');
const Validator = require('validator');

module.exports = {
    /**
     * Validate the information of a user
     * @param {Object} user_info
     * @param {Boolean} update - indicate if we are updating user information or creating a new one
     * @return {Object} result
     */
    validate_user_info: function (user_info, update) {
        var result = {success: true, messages: []};
        // validate username
        if (!user_info.username) {
            result.messages.push('Please enter your username.');
        }
        else {
            user_info.username = user_info.username.toLowerCase();
            if (user_info.username.length > 10) {
                result.messages.push('The maximum length for username is 10 characters.')
            }
            if (!(Validator.isAlphanumeric(user_info.username))) {
                result.messages.push('Your username can contain only alphanumeric characters.')
            }
        }
        // validate password
        if (update) {
            var password_errors = this.validate_password(user_info.password, user_info.password_rpt);
            for (var i = 0; i < password_errors.length; ++i) {
                result.messages.push(password_errors[i]);
            }
        }
        // validate first and last name
        if (!user_info.firstname) {
            result.messages.push('Please enter your first name.');
        }
        if (!user_info.lastname) {
            result.messages.push('Please enter your last name.');
        }
        // validate location
        if (!user_info.state) {
            result.messages.push('Please enter your state.');
        }
        if (!user_info.city) {
            result.messages.push('Please enter your city.');
        }
        user_info.zipcode = parseInt(user_info.zipcode);
        if (isNaN(user_info.zipcode)) {
            result.messages.push('Please enter a valid zip code.');
        }
        result.success = result.messages.length == 0;
        result.user = user_info;
        return result;
    },

    /**
     * Validate the password of a user
     * @param {String} password
     * @param {String} password_rpt - repeated password
     * @return [String] result
     */
    validate_password: function (password, password_rpt) {
        var errors = [];
        if (!password || password.length < 8) {
            errors.push('The minimum length for your password is 8 characters.');
        }
        if (password != password_rpt) {
            errors.push('Your password and confirmation password do not match.');
        }
        return errors;
    }
};