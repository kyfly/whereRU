app.controller('LoginController', ['User', '$scope', '$rootScope', 'LoopBackAuth', function (User, $scope, $rootScope, LoopBackAuth) {
  $scope.user = {};
  $scope.cancelLogin = function () {
    window.document.getElementById('login').style.display = "none";
  };
  $scope.login = function () {
    User.login($scope.user, function (data) {
      data.user.id = data.userId;
      $rootScope.$currentUser = data.user;
      $rootScope.username = data.user.name;
      LoopBackAuth.setUser(data.id, data.userId, data.user);
      LoopBackAuth.save();
      localStorage.$LoopBack$currentUserToken = JSON.stringify(data);
    });
  };
}]);

app.controller('RegisterController', ['User', 'School', '$scope', '$rootScope', '$location', 'LoopBackAuth', function (User, School, $scope, $rootScope, $location, LoopBackAuth) {
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
app.controller('UserController', ['$scope', 'User', function($scope, User){
  User.getInfo(function (user) {
    $scope.user = user;
  });
}]);
app.controller('MSController', ['User', '$stateParams', function (User, $stateParams) {
  window.localStorage.$LoopBack$currentTeamId = $stateParams.id;
  window.location.href = '/management_system';
}]);
app.controller('ARTController', ['$scope', function(){

}]);
