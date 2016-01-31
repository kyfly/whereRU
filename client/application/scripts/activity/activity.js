app.controller('ActivitiesController', ['$scope', 'Activity', function ($scope, Activity) {
  $scope.activityCurrent = undefined;
  Activity.find({}, function (res) {
      console.log(res);
      $scope.activityCurrent = res[0];
      $scope.activityItems = res;
    }, function () {
    }
  );
  $scope.someFN = function () {
    $scope.activityCurrent = this.activityItem;
    Activity.prototype_get_forms({
      id: $scope.activityCurrent.id
    }, function (res) {
      $scope.activityJoin = res[0]._formItems;
      console.log($scope.activityJoin);
    }, function () {
    });
  };

}

]);
app.controller('ActivityController', ['$scope', function ($scope) {

}])

