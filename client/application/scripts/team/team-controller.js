app.controller('TeamController', ['$scope', 'Team', '$stateParams', function ($scope, Team, $stateParams) {
  console.log(new Date());

  /**
   * 团队列表
   * school参数有问题，i++
   */
  Team.getMySchoolTeams({
      //school: JSON.parse(localStorage.userInfo).user.school,
      last: new Date('2017-12-03T16:00:00.000Z')
    }, function (res) {
      console.log(res);
      $scope.teamItems = res.teams;
    }, function () {
    }
  );

}]);

app.controller('TeamDetailController', ['$scope', 'Team', '$stateParams', function ($scope, Team, $stateParams) {
  Team.findById({
      id: $stateParams.id
    }, function (res) {
      $scope.currentTeam = res;
      console.log($scope.currentTeam);
    }, function () {
    }
  );
}]);


