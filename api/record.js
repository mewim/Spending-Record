/*
 * API for Record
 */

const express = require('express'),
    router = express.Router();
const AuthService = require('../services/auth');
const RecordService = require('../services/record');
const Record = require('../models/record');
const User = require('../models/user');
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
                return res.status(500).send(SERVER_ERROR);
            }
            user._records.push(new_record._id);
            user.save(function (err1) {
                if (err1) {
                    return res.status(500).send(SERVER_ERROR);
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
            return res.status(400).send({
                success: false
            });
        }
        user.save(function (err) {
            if (err) {
                return res.status(501).send({
                    success: false
                });
            }
            Record.findOneAndRemove({_id: record_id});
            return res.status(200).send({
                success: true
            });
        });
    });
});
module.exports = router;