app.controller('LoginController', 
  ['User', "Aouth",'$scope', '$location', 'LoopBackAuth', '$window', '$rootScope', '$http', '$interval', '$timeout',
  function (User, Aouth, $scope, $location, LoopBackAuth, $window, $rootScope, $http, $interval, $timeout) {
  $scope.user = {};
  function createQrcode (url) {
    document.getElementById("qrcode").innerHtml = null;
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: url,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });
  }
  $scope.loadURL = function () {
    var url = $window.location.href;
    var isWechart = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    if (!$rootScope.mediaIsPC && !isWechart) {
      Materialize.toast('只能在微信中微信登录噢', 3000);
      return;
    }
    $http.get('/wechatUrl?iswechat=' + isWechart + '&url=' + $location.path())
    .success(function (res) {
      $scope.wechatLogin = $rootScope.mediaIsPC;
      if (isWechart) {
        $window.location.href = res.url;
      } else {
        createQrcode(res.url);
        document.getElementById("qrcode").innerHtml = null;
        var outh = $interval(function () {
          Aouth.findById({ id: res.token }, function (res) {
            var data = res.token;
            if (data) {
              $interval.cancel(outh);
              if (data.user.school === '未知') {
                data.user.school = '杭州电子科技大学';
                data.user.isVerify = false;
              }
              userAuthSave(data, $rootScope, LoopBackAuth);
              $scope.wechatLogin = false;
              Materialize.toast('登录成功', 3000);
              if (res.aouth.url) {
                Materialize.toast('记得去完善资料', 3000);
              } else $location.path('/u/info');
            }
          });
        }, 3000);
        $timeout(function () {
          if (outh) {
            document.getElementById("qrcode").innerHtml = null;
            $scope.wechatLogin = false;
            Aouth.deleteById({ id: res.token});
            $interval.cancel(outh);
          }
        }, 30000);
      }
    })
    .error(function (err) {
      console.log(err);
    });
  };
  $scope.login = function () {
    User.login($scope.user, function (data) {
      userAuthSave(data, $rootScope, LoopBackAuth);
      Materialize.toast('登录成功', 2000);
    }, function (err) {
      Materialize.toast('登录失败,请检查输入是否正确', 2000);
    });
  };
}]);
function userAuthSave(data, $rootScope, LoopBackAuth) {
  data.user.id = data.userId;
  $rootScope.cancelLogin();
  data.user.accessToken = data.id;
  $rootScope.$currentUser = data.user;
  $rootScope.username = data.user.name;
  LoopBackAuth.setUser(data.id, data.userId, data.user);
  LoopBackAuth.save();
  localStorage.$LoopBack$currentUserToken = JSON.stringify(data);
}
app.controller('RegisterController', ['User', 'School', '$scope', '$rootScope', '$location', 'LoopBackAuth', function (User, School, $scope, $rootScope, $location, LoopBackAuth) {
  $scope.user = {};
  School.find(function (schools) {
    $scope.schools = schools;
  });
  $scope.register = function () {
    User.create($scope.user, function (data) {
      userAuthSave(data, $rootScope, LoopBackAuth);
      Materialize.toast('恭喜你，注册成功', 2000);
      $location.path('/w/activities').replace();
    }, function (err) {
      if (err.status === 1000)
        Materialize.toast('该手机号已经被注册', 2000);
    });
  }
}]);

app.controller('ConfirmSchoolController', ['User', '$scope', 'School', function (User, $scope, School) {
  $scope.user = $scope.$currentUser;
  School.findOne({
    filter: {
      where: { name: $scope.$currentUser.school},
      fields: ['academy']
    }
  }, function (res) {
    $scope.academies = res[0].academy;
  })
  $scope.confirm = function () {

    // User.confirmSchool({id: localStorage['$LoopBack$currentUserId']}, $scope.user, function () {
    //   hex_md5($scope.studentPassword)
    // });
  }
}]);
app.controller('UserController', ['$scope', 'User', '$rootScope', '$location',function($scope, User, $rootScope, $location){
  var pullTeams = function () {
    User.getMyTeams({
      id: $scope.$currentUser.id
    }, function (teams) {
      $scope.teams = teams.teams;
    });
  };
  var pullRaces = function () {
    User.getRaceHistories({
      id: $scope.$currentUser.id
    }, function (res) {
      $scope.races = res.races;
    });
  };
  var pullActivities = function () {
    User.getActivitiesHistories({
      id: $scope.$currentUser.id
    }, function (res) {
      $scope.activities = res.activities;
    });
  };
  var pullLikeArticles = function () {
    User.getLikeArticles({
      id: $scope.$currentUser.id
    }, function (res) {
      $scope.likeArticles = res.articles;
    });
  };
  var pullArticles = function () {
    User.prototype_get_articles({
      id: $scope.$currentUser.id
    }, function (articles) {
      $scope.articles = articles;
    });
  };
  $scope.goLogin = function (){
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
  }
  $scope.activeMenus = [{
    "name": "我的团队",
    "clickFn": pullTeams,
    "active": true,
    "eName": 'team'
  },{
    'clickFn': pullRaces,
    'name': '参赛竞赛',
    "active": false,
    "eName": 'race'
  },{
    'clickFn': pullActivities,
    'name': '活动历史',
    "active": false,
    "eName": 'activity'
  },{
    'clickFn': pullLikeArticles,
    'name': '喜欢文章',
    "active": false,
    "eName": 'article'
  }];
  $scope.logout = function () {
    $rootScope.$currentUser = null;
    localStorage.$LoopBack$currentUserToken = '';
    localStorage.$LoopBack$accessTokenId = '';
    $rootScope.username = false;
    Materialize.toast('退出成功', 2000);
    $location.path("/w/activities");
  }
  $scope.pullData = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    $scope.activeMenus.forEach(function (menu) {
      menu.active = false;
    });
    this.menu.active = true;
    this.menu.clickFn();
    $scope.selectedMenu = this.menu.eName;
  }
  $scope.selectedMenu = 'team';
  if ($scope.$currentUser) {
    User.getInfo(function (user) {
      $scope.user = user;
    });
    pullTeams();
    pullArticles();
  } else {
    $scope.user = null;
  }

}]);
app.controller('AuthController', ['$scope', 'User', '$location', '$rootScope', 'LoopBackAuth',
  function($scope, User, $location, $rootScope, LoopBackAuth){
  var isWechart = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
  var search = $location.search();
  if (isWechart && search.code) {
    User.auth2wechat({
      code: search.code,
      state: search.state
    }, function (data) {
      if (data.status === 500) {
        $scope.status = 'fail';
      } else {
        $scope.user = data.token.user;
        $scope.aouth = data.aouth;
        if ($scope.user.school === '未知') {
          $scope.user.school = '杭州电子科技大学';
          $scope.user.isVerify = false;
        }
        userAuthSave(data.token, $rootScope, LoopBackAuth);
        Materialize.toast('登录成功', 2000);
        if ($scope.aouth.iswechat) {
          $location.path($scope.aouth.url);
        }
      }
    }, function (err) {
      $scope.status = 'fail';
    });
  } else {
    $scope.status = 'fail';
  }
  $scope.goLogin = function () {
    $scope.$emit('auth:loginRequired');
  };
}]);
app.controller('UserInfoController', ['$scope', 'User', 'School', '$location',
  function($scope, User, School, $location){
  
  if ($scope.$currentUser) {
    User.getInfo().$promise.then(function (user) {
      $scope.user = user;
    });
    School.find(function (schools) {
      $scope.schools = schools;
    });
  } else {
    $scope.$emit('auth:loginRequired');
    $scope.user = null;
  }
}]);
app.controller('ActivityResultController', 
  ['$scope', '$stateParams', 'User', 
  function($scope, $stateParams, User){
  if (!$scope.$currentUser) {
    return $scope.$emit('auth:loginRequired');
  }
  $scope.type = $stateParams.type;
  User['prototype_findById_' + $stateParams.type + 'Results']({
    id: $scope.$currentUser.id,
    fk: $stateParams.id
  }, function (res) {
    $scope.results = res.results;
    $scope.activity = res.activity;
  });
}]);
app.controller('MSController', ['User', '$stateParams', function (User, $stateParams) {
  window.localStorage.$LoopBack$currentTeamId = $stateParams.id;
  window.location.href = '/MS';
}]);
app.controller('ARTController', ['$scope', function(){

}]);
