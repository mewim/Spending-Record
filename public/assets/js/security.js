/*
 * Handles manipulation for the security webpage.
 */
var app = angular.module('Security', []);

app.controller('SecurityController', function ($scope, $http) {
    $scope.reenter_message = 'Please re-enter your password to continue.';

    /*
     * Verify password with server
     * Callback function for Continue button.
     */
    $scope.verify_password = function () {
        $scope.reenter_err_messages = [];
        if (!$scope.password_input || $scope.password_input.length < 8) {
            $scope.reenter_err_messages.push('Please enter a valid password.')
        }
        if ($scope.reenter_err_messages.length > 0) {
            return;
        }
        $scope.reenter_message = 'Verifying your input...';
        $http({
            method: 'POST',
            url: '/api/user/get',
            data: {
                token: localStorage.getItem("token")
            }
        }).then(
            function (res) {
                // success callback
                $scope.username = res.data.username;
                $http({
                    method: 'POST',
                    url: '/api/auth',
                    data: {
                        username: $scope.username,
                        password: $scope.password_input
                    }
                }).then(
                    function (res) {
                        // success callback
                        $scope.password = $scope.password_input;
                    },
                    function (res) {
                        // failure callback
                        if (res.status == 401) {
                            $scope.reenter_err_messages = ['Please check your password.'];
                        }
                        else {
                            $scope.reenter_err_messages = ['Sorry. Bad connection. Please try again.'];
                        }
                    });
            },
            function (res) {
                // failure callback
                if (res.status == 401) {
                    window.location = '/signout'
                }
                else {
                    $scope.reenter_err_messages = ["Sorry. Bad connection. Please try again."];
                }
            });
    };

    /*
     * Reset new password form.
     * Callback function for Submit button.
     */
    $scope.reset_new_password = function () {
        $scope.new_password_message = 'Change your password here.';
        $scope.new_password = '';
        $scope.new_password_rpt = '';
        $scope.new_password_err_messages = [];
    };

    /*
     * Change user's password.
     * Callback function for Change button.
     */
    $scope.change_password = function () {
        if ($scope.new_password != $scope.new_password_rpt || ($scope.password.length < 8)) {
            return;
        }
        $scope.new_password_err_messages = [];
        $scope.message = 'Submitting...';
        $http({
            method: 'POST',
            url: '/api/security/change_password',
            data: {
                username: $scope.username,
                password: $scope.password,
                new_password: $scope.new_password
            }
        }).then(
            function (res) {
                // success callback
                $scope.new_password_message = 'Your password is successfully changed. Redirecting to login page in 3 seconds...';
                setTimeout(function () {
                    window.location = '/signout';
                }, 3000);
            },
            function (res) {
                // failure callback
                if (res.status == 401) {
                    $scope.new_password_err_messages = ["Your original password is not valid any more. Redirecting to login page in 3 seconds..."];
                    setTimeout(function () {
                        window.location = '/signout';
                    }, 3000);
                }
                else if (res.status == 400) {
                    $scope.new_password_err_messages = res.data.messages;
                }
                else {
                    $scope.new_password_err_messages = ["Sorry. Bad connection. Please try again."];
                }
            });
    };

    /*
     * Deauthorize other devices.
     * Callback function for Deauthorize Other Devices button.
     */
    $scope.deauthorize = function () {
        if ($scope.new_password != $scope.new_password_rpt || ($scope.password.length < 8)) {
            return;
        }
        $scope.new_password_err_messages = [];
        $scope.deauthorize_message = 'Deauthorizing...';
        $http({
            method: 'POST',
            url: '/api/security/deauthorize',
            data: {
                username: $scope.username,
                password: $scope.password
            }
        }).then(
            function (res) {
                // success callback
                localStorage.setItem('token', res.data.token);
                $scope.deauthorize_message = 'All other devices has been deeauthorized.';
            },
            function (res) {
                // failure callback
                if (res.status == 401) {
                    $scope.deauthorize_err_messages = ["Your original password is not valid any more. Redirecting to login page in 3 seconds..."];
                    setTimeout(function () {
                        window.location = '/signout';
                    }, 3000);
                }
                else {
                    $scope.deauthorize_err_messages = ["Sorry. Bad connection. Please try again."];
                }
            });
    };

    $scope.reset_new_password();
    $scope.deauthorize_message = 'Click the button below to revoke the authorizations from all other authorized devices.';
});
