/*
 * Handles manipulation for the login webpage.
 */
angular.module('Login', []).controller('LoginController', function ($scope, $http) {
    $scope.message = 'Please login to continue.';
    /*
     * Login with username and password.
     * Callback function for login button.
     */
    $scope.login = function () {
        $scope.err_messages = [];
        if (!$scope.username || $scope.username.length == 0) {
            $scope.err_messages.push('Please enter your username.')
        }
        if (!$scope.password || $scope.password.length < 8) {
            $scope.err_messages.push('Please enter a valid password.')
        }
        if ($scope.err_messages.length > 0) {
            return;
        }
        $scope.message = 'Logging in...';
        localStorage.removeItem('token');
        var req = {
            method: 'POST',
            url: '/api/auth',
            data: {
                username: $scope.username,
                password: $scope.password
            }
        };
        $http(req).then(
            function (res) {
                // success callback
                if(res.data.success){
                    $scope.message = 'Redirecting to your homepage...';
                    localStorage.setItem('token', res.data.token);
                    window.location = '/home';
                }
            },
            function (res) {
                // failure callback
                if (res.status == 401) {
                    $scope.err_messages = ["Please check your username and password."];
                }
                else {
                    $scope.err_messages = ["Sorry. Bad connection. Please try again."];
                }
            });
    };
});