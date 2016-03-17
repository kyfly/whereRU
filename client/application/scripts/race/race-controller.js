app.controller('RacesController', ['$scope', 'Race', '$window', function ($scope, Race, $window) {
  $window.pull = true;
  $scope.raceItems = [];
  var page = 0;
  angular.element($window).bind('scroll', function (e) {
    var body = e.target.body;
    if (body.scrollHeight - body.clientHeight - body.scrollTop < 600 && $window.pull) {
      $scope.getRaces();
      $window.pull = false;
    } else if (body.scrollHeight - body.clientHeight - body.scrollTop > 600) {
      $window.pull = true;
    }
  });
  $scope.$on('$destroy', function (event,data) {
    angular.element($window).unbind('scroll');
    $scope.raceItems = undefined;
  });

  $scope.getRaces = function () {
    if (!$scope.$currentUser) {
      $scope.$emit('auth:loginRequired');
      return;
    }
    Race.getMySchoolRaces({
      school: $scope.$currentUser.school,
      page: page
    }, function (res) {
      for (x in res) if (x === 'races') {
        if (res[x].length < 32 || res[x].length === 0) {
          $scope.last = true;
        }
        $scope.raceItems.push.apply($scope.raceItems, res[x]);
        page ++;
      }
    });
  };
  if (!$scope.username) {
    Race.find(function (races) {
      $scope.raceItems = races;
    });
  } else {
    $scope.getRaces();
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
  Race.prototype_get_materials({
    id: $stateParams.id
  }, function (res) {
    $scope.materials = res;
  }, function () {
    Materialize.toast('获取资料列表失败！', 2000);
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
    if (!$scope.selected) {
      return Materialize.toast('必须选择一个团队', 2000);
    }
    Team.prototype_link_partakedRaces({
      id: $scope.selected,
      fk: $stateParams.id
    }, {},function (status) {
      Materialize.toast('参与成功,请经常关注竞赛信息', 2000);
    });
  };
}]);


