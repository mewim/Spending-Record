/*
 * Handles manipulation for the record webpage.
 */
angular.module('Record', ['google.places']).controller('RecordController', function ($scope, $http) {
    $scope.autocompleteOptions = {

        types: ['establishment']
    }
    /*
     * Submit a record to server.
     * Callback function for submit button.
     */
    $scope.submit = function () {
        $scope.err_messages = [];
        $scope.message = 'Submitting...';

        var req = {
            method: 'POST',
            url: '/api/record/',
            data: {
                category: $scope.record.category,
                date: $scope.record.date,
                amount: $scope.record.amount,
                description: $scope.record.description,
                token: localStorage.getItem("token"),
                location: $scope.record.location ? $scope.record.location.name : null
            }
        };
        $http(req).then(
            function (res) {
                // success callback
                if (res.data.success) {
                    $scope.message = 'Your record is submitted to the server.';
                }
            },
            function (res) {
                // failure callback
                if (res.status == 401) {
                    window.location = '/signout'
                }
                else if (res.status == 400) {
                    $scope.err_messages = res.data.messages;
                }
                else {
                    $scope.err_messages = ["Sorry. Bad connection. Please try again."];
                }
            });
    };

    /*
     * Reset form.
     * Callback function for reset button.
     */
    $scope.reset = function () {
        $scope.err_messages = [];
        $scope.message = 'Please enter your record.';
        $scope.record = {
            category: '0',
            date: new Date().toISOString().slice(0, 10)
        };
    };
    $scope.reset();
});