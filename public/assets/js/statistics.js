/*
 * Handles manipulation for the statistics webpage.
 */

//----------------------------------------------------------------------------//
// Define global variables
//----------------------------------------------------------------------------//
var records = null;
var categories = null;
var stat_result = null;
var end = new Date();
end.setHours(0);
var start = new Date(end).setMonth(end.getMonth() - 1);
//----------------------------------------------------------------------------//


//----------------------------------------------------------------------------//
// Define Helper functions
//----------------------------------------------------------------------------//
/**
 * Generate HTML template for a Bootstrap blue alert message
 * @param {String} message
 * @return {String} html
 */
const blue_alert = function (message) {
    return (
        '<div class="alert alert-info"> <i class="fa fa-info-circle"></i> '
        + message
        + '</div>'
    );
};

/**
 * Generate HTML template for an array of red alert messages
 * @param {[String]} messages
 * @return {String} html
 */
const red_alert = function (messages) {
    var lines = ['<div class="alert alert-danger">'];
    for (var i = 0; i < messages.length; ++i) {
        lines.push('<div><i class="fa fa-exclamation-circle"></i> ' + messages[i] + '</div>');
    }
    lines.push('</div>');
    return lines.join('');
};

/**
 * Convert a Date object to string ('YYYY-MM-DD')
 * @param {Object} date
 * @return {String} string
 */
const date_to_string = function (date) {
    return new Date(date).toISOString().slice(0, 10)
};

/**
 * Get statistics result for records returned by API
 */
const get_statistics_result = function () {
    // Reinitialize stat_result
    stat_result = {
        daily: {},
        categories: {},
        cheapest: {
            description: '',
            amount: Number('Infinity')
        },
        most_expensive: {
            description: '',
            amount: -1 * Number('Infinity')
        }
    };
    var i;
    // Generate a dictionary for daily spending
    for (i = start, end.setDate(end.getDate() + 1); i < end; i.setDate(i.getDate() + 1)) {
        stat_result.daily[date_to_string(i)] = 0;
    }
    // Generate a dictionary for spending based on categories
    for (i = 0; i < categories.length; ++i) {
        stat_result.categories[categories[i]] = 0;
    }
    // Iterate through records and fill the data structure
    for (i = 0; i < records.length; ++i) {
        if (records[i].category in stat_result.categories) {
            stat_result.categories[records[i].category] += records[i].amount;
        }
        var date_str = date_to_string(records[i].date);
        stat_result.daily[date_str] += records[i].amount;
        stat_result.cheapest = stat_result.cheapest.amount < records[i].amount ? stat_result.cheapest : {
            description: records[i].description,
            amount: records[i].amount
        };
        stat_result.most_expensive = stat_result.most_expensive.amount > records[i].amount ? stat_result.most_expensive : {
            description: records[i].description,
            amount: records[i].amount
        };
    }
    // Compute total and average
    stat_result.total = Object.values(stat_result.daily).reduce(function (a, b) {
        return a + b;
    }, 0);
    stat_result.average = stat_result.total / Object.values(stat_result.daily).length;
};


//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Define functions for UI manipulation
//----------------------------------------------------------------------------//
/**
 * Draw daily spending chart
 */
const draw_daily_chart = function () {
    $('#daily-panel').fadeIn('slow', function(){
        var chart_data = [];
        for (var date in stat_result.daily) {
            chart_data.push({
                date: date,
                spent: stat_result.daily[date]
            });
        }
        $('#daily-chart').html('');
        new Morris.Line({
            element: 'daily-chart',
            data: chart_data,
            xkey: 'date',
            ykeys: ['spent'],
            labels: ['Money Spent'],
            resize: true,
            yLabelFormat: function (y) {
                return '$' + y
            }
        });
    });
};

/**
 * Draw categories chart
 */
const draw_category_chart = function () {
    $('#categories-panel').fadeIn('slow', function () {
        var chart_data = [];
        for (var category in stat_result.categories) {
            chart_data.push({
                label: category,
                value: stat_result.categories[category]
            });
        }
        console.log(chart_data);
        $('#categories-chart').html('');
        new Morris.Donut({
            element: 'categories-chart',
            data: chart_data,
            formatter: function (y, data) {
                return '$' + y
            },
            resize: true
        });
    });
};

/**
 * Draw the results table
 */
const draw_results = function () {
    $('#total-spending').html('')
        .append($('<p>').text('$' + stat_result.total.toFixed(2)));
    $('#avg-spending').html('')
        .append($('<p>').text('$' + stat_result.average.toFixed(2)));
    $('#most-expensive').html('')
        .append($('<p>').text(stat_result.most_expensive.description))
        .append($('<p>').text('($' + stat_result.most_expensive.amount.toFixed(2) + ')'));
    $('#cheapest').html('')
        .append($('<p>').text(stat_result.cheapest.description))
        .append($('<p>').text('($' + stat_result.cheapest.amount.toFixed(2) + ')'));
    $('#results-panel').fadeIn('slow');
};

/**
 * Fetch data from server, and draw the result
 * Callback function for OK button click
 */
const get_data = function () {
    $('#daily-panel').hide();
    $('#categories-panel').hide();
    $('#results-panel').hide();
    start = new Date($('#start').val());
    end = new Date($('#end').val());
    $('#message').html(blue_alert('Loading...'));
    // Load categories first
    $.ajax({
        url: '/api/category/get',
        type: 'POST',
        data: JSON.stringify({token: localStorage.getItem('token')}),
        contentType: "application/json; charset=utf-8",
        success: function (res0) {
            categories = res0;
            // Load records
            $.ajax({
                url: '/api/record/get_range',
                type: 'POST',
                data: JSON.stringify({
                    token: localStorage.getItem('token'),
                    start: new Date($('#start').val()),
                    end: new Date($('#end').val())
                }),
                contentType: "application/json; charset=utf-8",
                success: function (res1) {
                    records = res1.records;
                    get_statistics_result();
                    draw_daily_chart();
                    draw_category_chart();
                    draw_results();
                    $('#message').html(blue_alert('Please specify a date range to run statistics.'));
                },
                error: function (xhr, status, error) {
                    if (xhr.status == 401) {
                        window.location = '/signout'
                    }
                    if (xhr.status == 400) {
                        $('#message').html(red_alert(xhr.responseJSON.messages));
                    }
                    else {
                        $('#message').html(['There is a network error, please try again later.']);
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                window.location = '/signout';
            }
            $('#message').html(['There is a network error, please try again later.']);
        }
    });
};
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Start loading when document is ready
//----------------------------------------------------------------------------//
$(document).ready(function () {
    $('#start').datepicker({
        todayBtn: "linked",
        format: 'yyyy-mm-dd'
    });
    $('#start').datepicker('setDate', date_to_string(start));
    $('#end').datepicker({
        todayBtn: "linked",
        format: 'yyyy-mm-dd'
    });
    $('#end').datepicker('setDate', date_to_string(end));
    get_data();
});
//----------------------------------------------------------------------------//