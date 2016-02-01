app.controller('TeamsController', ['$scope','Team', function ($scope, Team) {
  console.log(new Date());
  Team.getMySchoolTeams({
      school: JSON.parse(localStorage.userInfo).user.school,
      last: new Date('Mon Feb 01 2017 13:31:52 GMT+0800 (中国标准时间)')
    }, function (res) {
      console.log(res);
      $scope.teamItems = res;
    }, function () {
    }
  );

}]);



