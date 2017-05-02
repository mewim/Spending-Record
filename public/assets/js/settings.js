/*
 * Handles manipulation for the settings webpage.
 */
var app = angular.module('Settings', []);

/*
 * UserInfo Controller
 * Handles manipulation for user information
 */
app.controller('UserInfoController', function ($scope, $http) {
    /*
     * Submit a record to server.
     * Callback function for submit button.
     */
    $scope.submit = function () {
        $scope.err_messages = [];
        $scope.message = 'Submitting...';
        $scope.user.token = localStorage.getItem("token");
        $http({
            method: 'PUT',
            url: '/api/user/',
            data: $scope.user
        }).then(
            function (res) {
                // success callback
                $scope.message = 'Your user information is successfully updated.';
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
        $scope.message = 'Edit your information here.';
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
                    $scope.err_messages = ["Sorry. Bad connection. Please try again."];
                }
            });
    };
    $scope.reset();
});


/*
 * Category Controller
 * Handles manipulation for Category
 */
app.controller('CategoryController', function ($scope, $http) {
    /*
     * Submit a new category to server.
     * Callback function for save button.
     */
    $scope.add = function () {
        // If the user didn't enter anything, just return
        if (!$scope.new_category) {
            return;
        }
        // If the enter is already in list, shift it to the front of list
        var exist = $scope.categories.indexOf($scope.new_category);
        if (exist != -1) {
            var new_first = $scope.categories[exist];
            $scope.categories.splice(exist, 1);
            $scope.categories.unshift(new_first);
            $scope.new_category = '';
            return;
        }
        // Add new category to server
        $http({
            method: 'POST',
            url: '/api/category/',
            data: {
                token: localStorage.getItem("token"),
                category: $scope.new_category
            }
        }).then(
            function (res) {
                $scope.categories.unshift($scope.new_category);
                $scope.new_category = '';
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
    };

    /*
     * Delete a category.
     * Callback function for delete button.
     */
    $scope.delete = function (idx) {
        $http({
            method: 'POST',
            url: '/api/category/d/',
            data: {
                token: localStorage.getItem("token"),
                category: $scope.categories[idx]
            }
        }).then(
            function (res) {
                // success callback
                $scope.categories.splice(idx, 1);
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
    };

    // Load all categories from server
    $http({
        method: 'POST',
        url: '/api/category/get',
        data: {
            token: localStorage.getItem("token")
        }
    }).then(
        function (res) {
            // success callback
            $scope.categories = res.data.sort();
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