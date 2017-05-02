/*
 * Handles manipulation for the export webpage.
 */

//----------------------------------------------------------------------------//
// Define global variables
//----------------------------------------------------------------------------//
var records = null;
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
 * Fetch records information from server
 */
const get_records = function() {
    $.ajax({
        url: '/api/record/get_range',
        type: 'POST',
        data: JSON.stringify({
            token: localStorage.getItem('token'),
            start: new Date($('#start').val()),
            end: new Date($('#end').val())
        }),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            $('#message').html(blue_alert('Processing data...'));
            res = res.records;
            records = [];
            for(var i = 0; i < res.length; ++i){
                records.push({
                    date: date_to_string(res[i].date),
                    description: res[i].description,
                    amount: res[i].amount,
                    category: res[i].category,
                    location: res[i].location
                });
            }
            dump_records();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                window.location = '/signout'
            }
            if (xhr.status == 400) {
                $('#message').html(red_alert(xhr.responseJSON.messages));
            }
            else {
                $('#message').html(red_alert(['There is a network error, please try again later.']));
            }
        }
    });
};

/**
 * Convert a normal string to a csv string
 * Deal with ',' and '"'
 * @param {String} s
 * @return {String} result
 */
const to_csv_string = function(s){
    return '"' + String(s).split('"').join('""') + '"';
};

/**
 * Convert the records array to a csv
 * @return {String} result
 */
const records_to_csv = function(){
    var lines = ['Description,Location,Amount,Category,Date'];
    for(var i = 0; i < records.length; ++i){
        var curr_line = [
            to_csv_string(records[i].description),
            records[i].location ?  to_csv_string(records[i].location) : '"(Not Available)"',
            to_csv_string(records[i].amount),
            to_csv_string(records[i].category),
            to_csv_string(records[i].date)
        ];
        lines.push(curr_line.join(','));
    }
    return lines.join('\n');
};

/**
 * Dump records as a file
 */
const dump_records = function() {
    var format = $('#format_select').find(":selected").text();
    if(format === 'JSON'){
        var json = JSON.stringify(records, null, 2);
        saveData(json, 'export.json');
    }
    if(format === 'CSV'){
        var csv = records_to_csv();
        saveData(csv, 'export.csv');
    }
    $('#message').html(blue_alert('Your records are exported successfully.'));
};

/**
 * Save a string as file download
 * CITE: https://jsfiddle.net/koldev/cW7W5/
 * @param {String} data
 * @param {String} fileName
 */
const saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Define functions for UI manipulation
//----------------------------------------------------------------------------//
/**
 * Fetch data from server, and draw the result
 * Callback function for OK button click
 */
const get_data = function () {
    start = new Date($('#start').val());
    end = new Date($('#end').val());
    $('#message').html(blue_alert('Fetching records from server...'));
    // Load categories first
    get_records();
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
});
//----------------------------------------------------------------------------//