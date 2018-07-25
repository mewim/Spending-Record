/*
 * API for Record
 */

const express = require('express'),
    router = express.Router();
const AuthService = require('../services/auth');
const RecordService = require('../services/record');
const Record = require('../models/record');
const SERVER_ERROR = {
    success: false,
    messages: ['There is a server error. Please try again later.']
};

// POST handler: for creating a new record
router.post('/', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var body = req.body;
        var user = auth.user;
        var record_validate = RecordService.validate_record(body, user);
        if (!record_validate.success) {
            return res.status(400).send(record_validate);
        }
        Record.create(record_validate.record, function (err, new_record) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    messages: [err]
                });
            }
            user._records.push(new_record._id);
            user.save(function (err1) {
                if (err1) {
                    return res.status(500).send({
                        success: false,
                        messages: [err1]
                    });                
                }
                return res.status(200).send({
                    success: true,
                    record: new_record
                });
            })
        });
    });
});

// POST handler: for fetching all records for a given user
router.post('/get_all/', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var body = req.body;
        var user = auth.user;
        user.populate('_records', function (err, result) {
            if (err) {
                return res.status(500).send(SERVER_ERROR);
            }
            return res.status(200).send(result._records);
        });
    });
});

// POST handler: for fetching records given a period for a given user
router.post('/get_range/', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var user = auth.user;
        var start = req.body.start ? new Date(req.body.start) : null;
        var end = req.body.end ? new Date(req.body.end) : null;
        var err_messages = [];
        if (!start || !start.getTime()) {
            err_messages.push('Please enter a valid start date.');
        }
        if (!end || !end.getTime()) {
            err_messages.push('Please enter a valid end date.');
        }
        if (err_messages.length == 0 && end < start) {
            err_messages.push('The end date is earlier than the start date.');
        }
        if (err_messages.length > 0) {
            return res.status(400).send(
                {
                    success: false,
                    messages: err_messages
                });
        }
        var populate_condition = {
            path: '_records',
            match: {
                date: {
                    $gte: start,
                    $lte: end
                }
            }
        };
        user.populate(populate_condition, function (err, result) {
            if (err) {
                return res.status(500).send(SERVER_ERROR);
            }
            return res.status(200).send({
                success: true,
                records: result._records
            });
        });
    });
});

// DELETE handler: for deleting one record
router.delete('/:record_id', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var user = auth.user;
        var record_id = req.params.record_id;
        try {
            user._records.pull(record_id);
        }
        catch (err) {
            return res.status(400).send({success: false});
        }
        user.save(function (err0) {
            if (err0) {
                return res.status(500).send({success: false});
            }
            Record.findOneAndRemove({_id: record_id}, function (err1) {
                if (err1) {
                    return res.status(500).send({success: false});
                }
                return res.status(200).send({success: true});
            });

        });
    });
});

// PUT handler: for modifying one record
router.put('/', function (req, res) {
    AuthService.auth_token(req, res, function (auth) {
        if (!auth.success) {
            return;
        }
        var user = auth.user;
        var body = req.body;
        if (user._records.indexOf(body._id) < 0) {
            return res.status(404).send({
                success: false,
                messages: ['You are trying to modify a non-exist record.']
            })
        }
        var record_validate = RecordService.validate_record(body, user);
        if (!record_validate.success) {
            return res.status(400).send(record_validate);
        }
        Record.findOneAndUpdate({_id: record_validate.record._id}, record_validate.record, {new: true}, function (err, result) {
            if (err) {
                return res.status(500).send(SERVER_ERROR);
            }
            return res.status(200).send({
                success: true,
                record: result
            });
        });
    });
});
module.exports = router;
