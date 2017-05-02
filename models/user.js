/*
 * Handles User schema manipulations
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    zipcode: {type: Number, required: true},
    categories: [{
        type: String,
        unique: true
    }],
    _records: [{
        type: Schema.ObjectId,
        ref: 'Record'
    }],
    token_timestamp: {type: Date, required: true, default: Date.now},
    budget: {type: Number, required: true, default:1000.0}
});

module.exports = mongoose.model('User', user);