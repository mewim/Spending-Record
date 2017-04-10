/*
 * Handles Record schema manipulations
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var record = new Schema({
    date: {type: Date, required: true, default: Date.now},
    description: {type: String},
    location: {type: String},
    amount: {type: Number, required: true, min: 0.00},
    category: [{
        type: Schema.ObjectId,
        ref: 'Category'
    }]
});

module.exports = mongoose.model('Record', record);