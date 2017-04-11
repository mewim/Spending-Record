/*
 * Handles manipulation for the sign up webpage.
 */

angular.module('SignUp', []).controller('SignUpController', function ($scope, $http) {
    $scope.message = 'Please enter your information.';
    /*
     * Create a user account.
     * Callback function for submit button.
     */
    $scope.submit = function () {
         $scope.err_messages = [];
        $scope.message = 'Submitting...';
        var req = {
            method: 'POST',
            url: '/api/user',
            data: $scope.user
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
                if (res.status == 400) {
                    $scope.err_messages = res.data.messages;
                }
                else {
                    $scope.err_messages = ["Sorry. Bad connection. Please try again."];
                }
            });
    };
});