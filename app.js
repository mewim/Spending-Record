const express = require('express');
const mongoose = require('mongoose');
const expresslogging = require('express-logging');
const logger = require('logops');
const uri = process.env.MONGODB_URI || 'mongodb://heroku_j25q3znw:sukd9gm6006olagfjsdpc3ss0m@ds155820.mlab.com:55820/heroku_j25q3znw';
const requestIp = require('request-ip');

logger.format = logger.formatters.dev;

// Setup listeners for database connection
mongoose.connection.on('open', function (ref) {
    console.log('Connected to MongoDB Server.');
    start_server();
});
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to MongoDB Server!');
    console.log(err);
    process.exit(1);
});

/*
 * Start express web server
 */
const start_server = function () {
    var app = new express();

    app.set('port', (process.env.PORT || 5000));

    // Set up middleware
    app.use(expresslogging(logger));

    app.use(requestIp.mw());

    // Serve static assets from the /public folder
    app.use(express.static('public'));
    // Set up API
    app.use('/api', require('./api/index.js'));

    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });
};

mongoose.connect(uri);