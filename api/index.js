/*
 * API index file
 */

const express = require('express'),
    router = express.Router();
const body_parser = require('body-parser');

// Set up body_parser
router.use(body_parser.json({limit: '50mb'}));

// Root endpoint for testing purpose
router.post('/', function (req, res) {
    res.status(200).send({
        success: true,
        message: "APIs are up and running."
    });
});

router.get('/', function (req, res) {
    res.status(200).send({
        success: true,
        message: "APIs are up and running."
    });
});

module.exports = router;