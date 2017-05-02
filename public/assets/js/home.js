/*
 * Handles manipulation for the home webpage.
 */

/**
 * Convert a Date object to string ('YYYY-MM-DD')
 * @param {Object} date
 * @return {String} string
 */
const date_to_string = function (date) {
    return new Date(date).toISOString().slice(0, 10)
};


angular.module('Home', []).controller('HomeController', function ($scope, $http) {
    // Get user information from server
    $http({
        method: 'POST',
        url: '/api/user/get',
        data: {
            token: localStorage.getItem("token")
        }
    }).then(
        function (res) {
            // success callback
            $scope.user = res.data;
        },
        function (res) {
            // failure callback
            if (res.status == 401) {
                window.location = '/signout'
            }
            else {
                alert("Sorry. Bad connection. Please try again.");
            }
        });

    var date = new Date();

    // Get spending information from server
    $http({
        method: 'POST',
        url: '/api/record/get_range',
        data: {
            token: localStorage.getItem('token'),
            start: date_to_string(new Date(date.getFullYear(), date.getMonth(), 1)),
            end: date_to_string(new Date(date.getFullYear(), date.getMonth() + 1, 0))
        }
    }).then(
        function (res) {
            console.log(res);
            // success callback
            var money_spent = 0;
            for(var i = 0; i < res.data.records.length; ++i){
                money_spent += res.data.records[i].amount;
            }
            $scope.money_spent = money_spent.toFixed(2);
            $scope.utilization_ratio = ((money_spent / $scope.user.budget) * 100).toFixed(2);
        },
        function (res) {
            // failure callback
            if (res.status == 401) {
                window.location = '/signout'
            }
            else {
                alert("Sorry. Bad connection. Please try again.");
            }
        });
});