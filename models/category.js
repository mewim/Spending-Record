/*
 * Handles Category schema manipulations
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var category = new Schema({
    name: {type: String, required: true},
    description: {type: String}
});

module.exports = mongoose.model('Category', category);