/**
 * Created by xuelei on 2016/1/31 0031.
 */
app.controller('ActivitiesController', ['$scope', 'Activity', function ($scope, Activity) {
  if (!$scope.username) {
    Activity.find(function (activities) {
      $scope.activityCurrent = activities[0];
      $scope.activityItems = activities;
    });
  } else {
    Activity.getMySchoolActiveties({
      school: $scope.$currentUser.school
    }, function(res){
      for (x in res) if (x === 'activties') {
        $scope.activityItems = res[x];
      }
      $scope.activityCurrent = $scope.activityItems[0];
      getFormInfo();
    });
  }

  $scope.changeCurrentActivity = function () {
    $scope.activityCurrent = this.activityItem;
    var actType = $scope.activityCurrent.actType;
    switch(actType) {
      case 'form': getFormInfo();
        break;
      case 'seckill':
        break;
      case 'vote':
        break;
    }

  };
  function getFormInfo() {
    Activity.prototype_get_forms({
      id:$scope.activityCurrent.id
    }, function (res) {
      $scope.forms = res[0];
      console.log(res);
    });
  }
}]);

app.controller('ActivityController', ['$scope', 'Activity', function($scope, Activity){
  $scope.changeCtrl = function () {
    $scope.result = new Array($scope.forms._formItems.length);
    $scope.forms = $scope.forms;
  };
  $scope.submit = function () {
    for (var x in $scope.forms._formItems) if ($scope.forms._formItems[x].type === 'select') {
      $scope.result[x].type = 'selelct';
      $scope.result[x].name = $scope.result[x].option;
      $scope.result[x].option = undefined;
    } else {
      $scope.result[x].type = $scope.forms._formItems[x].type;
    }
    console.log($scope.result);
  };
}])

