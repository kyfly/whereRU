app.controller('RacesController', ['$scope', 'Race', function ($scope, Race) {
  if (!$scope.username) {
    Race.find(function (races) {
      $scope.raceItems = races;
    });
  } else {
    Race.getMySchoolRaces({
      school: $scope.$currentUser.school
    }, function (res) {
      for (x in res) if (x === 'races') {
        $scope.raceItems = res[x];
      }
    });
  }
}]);
app.controller('RaceController', ['$scope', 'Race', '$stateParams', 'User', 'Team', function ($scope, Race, $stateParams, User, Team) {
  Race.findById({
    id: $stateParams.id
  }, function (race) {
    $scope.race = race;
    $scope.$emit('shareContentArrive', {
      bdText: race.name,
      bdPic: race.imgUrl
    });
  });
  Race.prototype_get_notices({
    id: $stateParams.id
  }, function (notices) {
    $scope.notices = notices;
  });
  Race.prototype_get_raceTeams({
    id: $stateParams.id
  }, function (teams) {
    $scope.raceTeams = teams;
  });
  if ($scope.$currentUser)
    User.prototype_get_teams({
      id: $scope.$currentUser.id
    }, function (teams) {
      $scope.teams = teams;
    });
  $scope.selectedTeam = function () {
    $scope.selected = this.team.id;
  };
  $scope.joinRace = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    Team.prototype_link_partakedRaces({
      id: $scope.selected,
      fk: $stateParams.id
    }, {},function (status) {
      Materialize.toast('加入成功,请经常关注竞赛信息', 2000);
    });
  };
  $scope.joinTeam = function () {
    if (this.team) {
      $scope.teamId = this.team.id;
    } else {
      $scope.teamId = false;
    }
    
  };
}]);


