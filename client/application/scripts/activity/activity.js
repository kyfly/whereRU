app.controller('ActivitiesController', ['$scope', 'Activity', function ($scope, Activity) {
  $scope.activityCurrent = undefined;

  Activity.getMySchoolActiveties({
     school:JSON.parse(localStorage.userInfo).user.school
    },function(res){
    console.log(res);
      for (x in res) if (x === 'activties') {
        $scope.activityItems = res[x];
      }
    },function(){
    }
  );


  $scope.changeCurrentActivity = function () {
    $scope.activityCurrent = this.activityItem;
    console.log($scope.activityCurrent.id);
    Activity.prototype_get_forms({
      id:$scope.activityCurrent.id
    }, function (res) {
      console.log(res);
      $scope.activityJoin = res[0]._formItems;
      console.log($scope.activityJoin);
    }, function () {
    });
  };

}

]);



