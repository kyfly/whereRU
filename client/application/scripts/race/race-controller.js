app.controller('RacesController', ['$scope', 'Race', function ($scope, Race) {
  Race.getMySchoolRaces({
      school: JSON.parse(localStorage.userInfo).user.school
    }, function (res) {
      console.log(res);
      for (x in res) if (x === 'races') {
        $scope.raceItems = res[x];
      }
    }, function () {
    }
  );
}]);


