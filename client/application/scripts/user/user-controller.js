function createQrcode(url, eId) {
  document.getElementById(eId).innerHTML = null;
  var qrcode = new QRCode(document.getElementById(eId), {
    text: url,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}
app.controller('LoginController',
  ['User', "Aouth", '$scope', '$location', 'LoopBackAuth', '$window', '$rootScope', '$http', '$interval', '$timeout',
    function (User, Aouth, $scope, $location, LoopBackAuth, $window, $rootScope, $http, $interval, $timeout) {
      $scope.user = {};
      var isWechart = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
      $scope.isWechart = isWechart;
      $scope.changeInputType = $scope.isWechart ? false : true;
      $scope.loadURL = function () {
        var url = $window.location.href;
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
              createQrcode(res.url, 'qrcode');
              var flag = true;
              var outh = $interval(function () {
                Aouth.findById({id: res.token}, function (res) {
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
                    
                    flag = false;
                    if (res.aouth.url) {
                      Materialize.toast('记得去完善资料', 3000);
                      window.location.reload();
                    } else 
                      $location.path('/u/info');
                  }
                });
              }, 3000);
              $timeout(function () {
                if (flag) {
                  Materialize.toast("验证超时，请在30秒内完成确认哦", 3000);
                  document.getElementById("qrcode").innerHTML = null;
                  $scope.wechatLogin = false;
                  Aouth.deleteById({id: res.token});
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
        $scope.user.password = hex_md5($scope.user.password);
        User.login($scope.user, function (data) {
          $scope.user = {};
          userAuthSave(data, $rootScope, LoopBackAuth);
          Materialize.toast('登录成功', 2000);
          window.location.reload();
        }, function (err) {
          $scope.user.password = undefined;
          Materialize.toast('登录失败,请检查输入是否正确', 2000);
        });
      };
    }]);
app.controller('OrgLoginController',
  ['User', '$scope', '$location', 'LoopBackAuth', '$rootScope',
    function (User, $scope, $location, LoopBackAuth, $rootScope) {
      $scope.login = function () {
        User.login($scope.user, function (data) {
          userAuthSave(data, $rootScope, LoopBackAuth);
          Materialize.toast('登录成功', 2000);
        });
      };
      $scope.resetPassword = function () {
        User.resetPassword({
          lastPwd: $scope.lastPwd,
          newPwd: hex_md5($scope.newPwd)
        }, function (res) {
          Materialize.toast('密码修改成功,请记住新密码', 2000);
          $location.path('/u/info');
        });
      };
    }]);
function userAuthSave(data, $rootScope, LoopBackAuth) {
  data.user.id = data.userId;
  $rootScope.cancelLogin();
  data.user.accessToken = data.id;
  $rootScope.$currentUser = data.user;
  $rootScope.username = data.user.name;
  localStorage.$LoopBack$accessTokenId = data.id;
  localStorage.$LoopBack$currentUserId = data.userId;
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
    $scope.user.password = hex_md5($scope.user.password);
    User.create($scope.user, function (data) {
      userAuthSave(data, $rootScope, LoopBackAuth);
      Materialize.toast('恭喜你，注册成功', 2000);
      var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wx5d92b3c192f993e7'
        + '&redirect_uri=http://' + $location.host()
        + '/u/bind&response_type=code&scope=snsapi_userinfo&state=' + data.userId
        + '#wechat_redirect';
      createQrcode(url, 'bindQrcode');
      $scope.regSuccess = true;
    }, function (err) {
      if (err.status === 1000)
        Materialize.toast('该手机号已经被注册', 2000);
    });
  };
}]);

app.controller('ConfirmSchoolController', ['User', '$scope', 'School', '$window',
  function (User, $scope, School, $window) {
    $scope.user = $scope.$currentUser;
    School.findOne({
      filter: {
        where: {name: $scope.$currentUser.school},
        fields: ['academy']
      }
    }, function (res) {
      $scope.academies = res[0].academy;
    });
    $scope.confirm = function () {
      User.confirmSchool({id: $scope.$currentUser.id}, {
        studentId: $scope.studentId,
        password: hex_md5($scope.studentPassword),
        academy: $scope.academy
      }, function (res) {
        $scope.$currentUser.studentId = studentId;
        Materialize.toast('验证成功', 2000);
        $window.history.back();
      });
    }
  }]);
app.controller('UserController', ['$scope', 'User', '$rootScope', '$location', function ($scope, User, $rootScope, $location) {
  var pullTeams = function () {
    User.getMyTeams({
      id: $scope.$currentUser.id
    }, function (teams) {
      $scope.teams = teams.teams.reverse();
    });
  };
  var pullRaces = function () {
    User.getRaceHistories({
      id: $scope.$currentUser.id
    }, function (res) {
      $scope.races = res.races.reverse();
    });
  };
  var pullActivities = function () {
    User.getActivitiesHistories({
      id: $scope.$currentUser.id
    }, function (res) {
      $scope.activities = res.activities.reverse();
    });
  };
  var pullLikeArticles = function () {
    User.getLikeArticles({
      id: $scope.$currentUser.id
    }, function (res) {
      $scope.likeArticles = res.articles.reverse();
    });
  };
  var pullArticles = function () {
    User.prototype_get_articles({
      id: $scope.$currentUser.id
    }, function (articles) {
      $scope.articles = articles;
    });
  };
  $scope.goLogin = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
  };
  $scope.activeMenus = [{
    "name": "我的团队",
    "clickFn": pullTeams,
    "active": true,
    "eName": 'team'
  }, {
    'clickFn': pullRaces,
    'name': '参赛竞赛',
    "active": false,
    "eName": 'race'
  }, {
    'clickFn': pullActivities,
    'name': '活动历史',
    "active": false,
    "eName": 'activity'
  }, {
    'clickFn': pullLikeArticles,
    'name': '喜欢文章',
    "active": false,
    "eName": 'article'
  }];
  $scope.logOut = function () {
    $rootScope.$currentUser = null;
    localStorage.clear();
    $rootScope.username = false;
    Materialize.toast('退出成功', 2000);
    $location.path("/w/activities");
  };
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
  };
  $scope.selectedMenu = 'team';
  if ($scope.$currentUser) {
      $scope.user = $scope.$currentUser;
      pullTeams();
      pullArticles();
  } else {
    $scope.user = null;
  }
}]);
app.controller('AuthController', ['$scope', 'User', '$location', '$rootScope', 'LoopBackAuth',
  function ($scope, User, $location, $rootScope, LoopBackAuth) {
    var isWechart = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    var search = $location.search();
    search.action = 'login';
    if (isWechart && search.code) {
      auth2wechat(User, $scope, search, $rootScope, $location, LoopBackAuth);
      $location.search({});
    } else {
      $scope.status = 'fail';
    }
    $scope.goLogin = function () {
      $scope.$emit('auth:loginRequired');
    };
  }]);
function auth2wechat(User, scope, query, $rootScope, $location, LoopBackAuth) {
  User.auth2wechat({
    code: query.code,
    state: query.state,
    action: query.action
  }, function (data) {
    scope.user = data.token.user;
    scope.aouth = data.aouth;
    if (scope.user.school === '未知') {
      scope.user.school = '杭州电子科技大学';
    }
    userAuthSave(data.token, $rootScope, LoopBackAuth);
    Materialize.toast('登录成功', 2000);
    if (scope.aouth.iswechat) {
      $location.path(scope.aouth.url);
    }
  }, function (err) {
    scope.err = err;
    scope.status = 'fail';
  });
}
app.controller('BindController', ['$scope', 'User', '$location', '$rootScope', 'LoopBackAuth',
  function ($scope, User, $location, $rootScope, LoopBackAuth) {
    var isWechart = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    var search = $location.search();
    search.action = 'bind';
    if (isWechart && search.code) {
      auth2wechat(User, $scope, search, $rootScope, $location, LoopBackAuth);
      $location.search({});
    } else {
      $scope.status = 'fail';
    }
  }]);
app.controller('UserInfoController', ['$scope', 'User', 'School', '$location', 'uploadFile',
  function ($scope, User, School, $location, uploadFile) {
    $scope.isBindWeChat = false;
    if ($scope.$currentUser) {
      User.getInfo(function (user) {
        delete user.$promise;
        delete user.$resolved;
        $scope.user = user;
      });
      School.find(function (schools) {
        $scope.schools = schools;
      });
    } else {
      $scope.$emit('auth:loginRequired');
      $scope.user = null;
    }
    $scope.uploadLogo = function () {
      if (!$scope.$currentUser) {
        return $scope.$emit('auth:loginRequired');
      }
      var file = document.getElementById('headImg').files[0];
      uploadFile.img(file, 'headImgUrl', $scope.$currentUser.id)
        .success(function (res) {
          $scope.user.headImgUrl = res.url;
        });
    };

    $scope.closeBind = function () {
      $scope.isBindWeChat = false;
    };
    $scope.bindWechat = function () {
      $scope.isBindWeChat = true;
      var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wx5d92b3c192f993e7'
        + '&redirect_uri=http://' + $location.host()
        + '/u/bind&response_type=code&scope=snsapi_userinfo&state=' + $scope.$currentUser.id
        + '#wechat_redirect';
      createQrcode(url, 'bindQrcode');
    };
    $scope.updateInfo = function () {
      if ($scope.user.password)
        $scope.user.password = hex_md5($scope.user.password);
      User.prototype_updateAttributes($scope.user, function (data) {
        Materialize.toast('修改成功', 2000);
      });
    };
    $scope.resetPassword = function () {
      User.resetPassword({
        lastPwd: hex_md5($scope.lastPwd),
        newPwd: hex_md5($scope.newPwd)
      }, function (res) {
        Materialize.toast('修改成功,请记住新密码', 2000);
      });
    };
  }]);
app.controller('RetController', ['$scope', function ($scope) {

}]);
app.controller('ActivityResultController',
  ['$scope', '$stateParams', 'User',
    function ($scope, $stateParams, User) {
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
app.controller('ARTController', ['$scope', function () {

}]);
