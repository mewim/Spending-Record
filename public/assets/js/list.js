/*
 * Handles manipulation for the list webpage.
 */

// Init global variables
var records_table = null;
/**
 * Add record to the table
 * @param {Object} record
 */

const add_record = function (record) {
    var location = record.location ? $('<p>').text(record.location).html() : '(Not Available)';
    records_table.row.add([
        $('<p>').text(record.description).html(),
        location,
        record.amount,
        $('<p>').text(record.category).html(),
        new Date(record.date).toISOString().slice(0, 10)
    ]).draw();
};

// Construct jQuery datatable when document is ready
$(document).ready(function () {
    records_table = $('#records').DataTable({
        "columnDefs": [
            {"orderable": false, "targets": 4}
        ]
    });
    $.ajax({
        url: '/api/record/get_all',
        type: 'POST',
        data: JSON.stringify({
            token: localStorage.getItem('token')
        }),
        contentType: "application/json; charset=utf-8",
        success: function (records) {
            for(var i=0; i<records.length; ++i){
                add_record(records[i]);
            }
        },
        error: function (xhr, status, error) {
            if(xhr.status == 401){
                window.location = '/signout'
            }
            else {
                alert('There is a network error, please try again later.');
            }
        }
    });
});