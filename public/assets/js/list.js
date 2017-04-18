/*
 * Handles manipulation for the list webpage.
 */

// Init global variables
const RM_BUTTON_TEMPLATE = '<div style="text-align: center; cursor: pointer;">'
    + '  <i class="fa fa-lg fa-times remove" aria-hidden="true"></i>'
    + '</div>';
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
        new Date(record.date).toISOString().slice(0, 10),
        record._id
    ]).draw();
};

/**
 * Remove record from the table
 * @param {String} _id
 * @param {Object} row
 */
const remove_record = function (_id, row) {
    $.ajax({
        url: '/api/record/' + _id,
        type: 'DELETE',
        data: JSON.stringify({
            token: localStorage.getItem('token')
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            row.remove().draw();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                window.location = '/signout'
            }
            else {
                alert('There is an error, please try again later.');
            }
        }
    });
};

/**
 * Handles button onclick events
 */
const handle_buttons_click = function () {
    $('#records tbody').on('click', 'i', function () {
        var row = records_table.row($(this).parents('tr'));
        var data = row.data();
        var _id = data[5];
        remove_record(_id, row);
    });
};

// Construct jQuery datatable when document is ready
$(document).ready(function () {
    records_table = $('#records').DataTable({
        "columnDefs": [
            {"orderable": false, "targets": 4},
            {
                "orderable": false,
                "targets": -1,
                "data": null,
                "width": "1%",
                "defaultContent": RM_BUTTON_TEMPLATE
            }
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
            for (var i = 0; i < records.length; ++i) {
                add_record(records[i]);
            }
            handle_buttons_click();
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                window.location = '/signout'
            }
            else {
                alert('There is a network error, please try again later.');
            }
        }
    });
});