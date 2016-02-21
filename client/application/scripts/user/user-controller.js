app.controller('LoginController', 
  ['User', '$scope', '$location', 'LoopBackAuth', 
  function (User, $scope, $location, LoopBackAuth) {
  $scope.user = {};
  $scope.login = function () {
    User.login($scope.user, function (data) {
      data.user.id = data.userId;
      LoopBackAuth.setUser(data.id, data.userId, data.user);
      LoopBackAuth.save();
      localStorage.$LoopBack$currentUserToken = JSON.stringify(data);
      Materialize.toast('登录成功', 4000);
      location.href = $location.path();
    }, function (err) {
      Materialize.toast('登录失败,请检查输入是否正确', 4000);
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
  if ($scope.$currentUser) {
    User.getInfo(function (user) {
      $scope.user = user;
    });
  } else {
    $scope.user = null;
  }
  var pullTeams = function () {
    if ($scope.$currentUser) {
      User.getMyTeams({
        id: $scope.$currentUser.id
      }, function (teams) {
        $scope.teams = teams.teams;
      });
    }
  };
  var pullRaces = function () {
    if ($scope.$currentUser) {
      User.getRaceHistories({
        id: $scope.$currentUser.id
      }, function (races) {
        $scope.races = races;
      });
    }
  };
  var pullActivities = function () {
    if ($scope.$currentUser) {
      User.getActivitiesHistories({
        id: $scope.$currentUser.id
      }, function (activities) {
        $scope.activities = activities;
      });
    }
  };
  var pullArticles = function () {
    if ($scope.$currentUser) {
      User.prototype_get_articles({
        id: $scope.$currentUser.id
      }, function (articles) {
        $scope.articles = articles;
      });
    }
  }
  $scope.activeMenus = [{
    "name": "我的团队",
    "clickFn": 'pullTeams()',
    "active": true,
    "eName": 'team'
  },{
    'clickFn': 'pullRaces()',
    'name': '参赛竞赛',
    "active": false,
    "eName": 'race'
  },{
    'clickFn': 'pullActivities()',
    'name': '活动历史',
    "active": false,
    "eName": 'activity'
  },{
    'clickFn': 'pullArticles()',
    'name': '喜欢文章',
    "active": false,
    "eName": 'article'
  }];
  $scope.pullData = function () {
    
  }
  $scope.selectedMenu = 'team';
  pullTeams();
}]);
app.controller('MSController', ['User', '$stateParams', function (User, $stateParams) {
  window.localStorage.$LoopBack$currentTeamId = $stateParams.id;
  window.location.href = '/management_system';
}]);
app.controller('ARTController', ['$scope', function(){

}]);
