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
    function getFormInfo() {
      Activity.prototype_get_forms({
        id:$scope.activityCurrent.id
      }, function (res) {

      });
    }
  };

}

]);



