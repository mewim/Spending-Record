/*
 * Record Model Service Handler
 */

module.exports = {
    /**
     * Validate a record is correct or not
     * @param {Object} record
     * @param {Object} user
     * @return {Object} result
     */
    validate_record: function (record, user) {
        var result = {messages: []};
        if (!record.description) {
            result.messages.push('Please enter a description.');
        }
        record.amount = parseFloat(record.amount);
        if (!record.amount || record.amount < 0) {
            result.messages.push('Please enter a valid amount.');
        }
        var categories = user.categories;
        if (!categories.includes(record.category)) {
            result.messages.push('Please select a valid category.');
        }
        if (record.date) {
            record.date = new Date(record.date);
            if (!record.date.getTime()) {
                result.messages.push('Please enter a valid date.');
            }
        }
        else {
            result.messages.push('Please enter a valid date.');
        }
        record.location = record.location ? record.location : null;
        result.success = result.messages.length === 0;
        if (result.success) {
            result.record = record;
        }
        return result;
    }
};