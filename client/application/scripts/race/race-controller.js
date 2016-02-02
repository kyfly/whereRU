app.controller('RacesController', ['$scope', 'Race', function ($scope, Race) {
  $scope.raceCurrent = undefined;     //当前竞赛
  /**
   * 竞赛通知
   * 参数：学校   返回值：竞赛对象
   */
  Race.getMySchoolRaces({
      school: JSON.parse(localStorage.userInfo).user.school
    }, function (res) {
      console.log(res);
      for (x in res) if (x === 'races') {
        $scope.raceItems = res[x];
      }
    $scope.changeCurrentRace($scope.raceItems[0]);
    }, function () {
    }
  );
  /**
   * 竞赛通知
   * 参数：当前对象Id  返回值：对象
   */
    //获取当前竞赛
  $scope.changeCurrentRace = function (items) {
    $scope.raceCurrent = items || this.raceItem;
    console.log($scope.raceCurrent.id);
    //活动详情
    Race.findById({
        id: $scope.raceCurrent.id
      }, function (res) {
      console.log('活动详情');
      $scope.raceDetail = res;
      console.log($scope.raceDetail);
      }, function () {
      }
    );

    //活动通知
    Race.prototype_get_notices({
        id: $scope.raceCurrent.id
      }, function (res) {
        console.log(res);
      $scope.raceNoticeItems = res;
      }, function () {
      }
    );
  };

}]);


