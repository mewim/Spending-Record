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
        if (update && (!this.validate_password(user_info.password))) {
            result.messages.push('The minimum length for your password is 8 characters.')
        }
        if (!user_info.username) {
            result.messages.push('Please enter your username.');
        }
        user_info.username = user_info.username.toLowerCase();
        if (user_info.username.length > 10) {
            result.messages.push('The maximum length for username is 10 characters.')
        }
        if (!(Validator.isAlphanumeric(user_info.username))) {
            result.messages.push('Your username can contain only alphanumeric characters.')
        }
        if (!user_info.firstname) {
            result.messages.push('Please enter your first name.');
        }
        if (!user_info.lastname) {
            result.messages.push('Please enter your last name.');
        }
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
        if (result.success) {
            result.user = user_info;
        }
        return result;
    },

    /**
     * Validate the password of a user
     * @param {String} password
     * @return {Boolean} result
     */
    validate_password: function (password) {
        return password && password.length >= 8;
    }
};