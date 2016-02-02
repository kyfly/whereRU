app.controller('LoginController', ['User', '$scope', 'LoopBackAuth', function (User, $scope, LoopBackAuth) {
  $scope.user = {};
  $scope.cancelLogin = function () {
    window.document.getElementById('login').style.display = "none";
  };
  $scope.login = function () {
    User.login($scope.user, function (data) {
      data.user.id = data.userId;
      $rootScope.$currentUser = data.user;
      $rootScope.username = data.user.name;
      var accessToken = response.data;
      LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
      LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
      LoopBackAuth.save();
      localStorage.$LoopBack$currentUserToken = JSON.stringify(data);
    });
  };
}]);

app.controller('RegisterController', ['User', 'School', '$scope', '$location', 'LoopBackAuth', function (User, School, $scope, $location, LoopBackAuth) {
  $scope.user = {};
  School.find(function (schools) {
    $scope.schools = schools;
  });
  $scope.register = function () {
    User.create($scope.user, function (data) {
      data.user.id = data.userId;
      $rootScope.$currentUser = data.user;
      $rootScope.username = data.user.name;
      LoopBackAuth.setUser(data.id, data.userId, data.user);
      LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
      LoopBackAuth.save();
      localStorage.$LoopBack$currentUserToken = JSON.stringify(data);
      Materialize.toast('恭喜你，注册成功', 4000);
      $location.path('/w/activities').replace();
    }, function (err) {
      if (err.status === 1000)
        Materialize.toast('该手机号已经被注册', 4000);
    });
  }
}]);

app.controller('ConfirmSchoolController', ['User', '$scope', function (User, $scope) {
  $scope.confirm = function () {

    User.confirmSchool({id: localStorage['$LoopBack$currentUserId']}, $scope.user, function () {

    });
  }
}]);

app.controller('MSController', ['User', '$stateParams', function (User, $stateParams) {
  window.localStorage.$LoopBack$currentTeamId = $stateParams.id;
  window.location.href = '/management_system'
}]);
app.controller('ARTController', ['$scope', function(){

}])
