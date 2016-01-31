app.controller('LoginController', ['User', '$scope', function (User, $scope) {
  $scope.login = function () {
    User.login($scope.user, function (data) {
      localStorage.userInfo=JSON.stringify(data);
      console.log(localStorage.userInfo);
      console.log(JSON.parse(localStorage.userInfo).user.school);
    });
  }
}]);
app.controller('ConfirmSchoolController', ['User', '$scope', function (User, $scope) {
  $scope.confirm = function () {

    User.confirmSchool({id: localStorage['$LoopBack$currentUserId']}, $scope.user, function () {

    });
  }
}]);
app.controller('RegisterController', ['User', function () {

}]);
app.controller('TestController', ['User', function () {
}]);
app.controller('MSController', ['User', '$stateParams', function (User, $stateParams) {
  localStorage.$LoopBack$currentTeamId = $stateParams.id;
  location.href = '/management_system'
}]);
app.controller('ARTController', ['$scope', function(){

}])
