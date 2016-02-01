app.controller('TeamsController', ['$scope','Team', function ($scope, Team) {
  console.log(new Date());
  Team.getMySchoolTeams({
      school: JSON.parse(localStorage.userInfo).user.school,
      last: new Date('2017-12-03T16:00:00.000Z')
    }, function (res) {
      console.log(res);
      $scope.teamItems = res.teams;
    }, function () {
    }
  );

}]);



