/*
 * Handles manipulation for the record webpage.
 */

angular.module('Record', ['google.places'])
  .directive('datetimez', function() {
      return {
          restrict: 'A',
          require : 'ngModel',
          link: function(scope, element, attrs, ngModelCtrl) {
            $(element).datepicker({
                todayBtn: "linked",
                format: 'yyyy-mm-dd'
            }).on('changeDate', function(e) {
                console.log(e);
              ngModelCtrl.$setViewValue(e.date);
              scope.$apply();
            });
          }
      };
  })
  .controller('RecordController', function ($scope, $http) {
    /*
     * Submit a record to server.
     * Callback function for submit button.
     */
    $scope.submit = function () {
        $scope.err_messages = [];
        $scope.message = 'Submitting...';
        var data = {
            category: ($scope.record.category == 'dummy') ? null : $scope.categories[$scope.record.category],
            amount: $scope.record.amount,
            description: $scope.record.description,
            token: localStorage.getItem("token"),
            location: $scope.record.location ? $scope.record.location.name : null
        };
        if($scope.record.date && $scope.record.date.length > 0){
            data.date = $scope.record.date;
        }
        console.log(data);
        var req = {
            method: 'POST',
            url: '/api/record/',
            data: data
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
            category: 'dummy'
        };
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
    $scope.datepicker_date = new Date();
    $scope.reset();
});
