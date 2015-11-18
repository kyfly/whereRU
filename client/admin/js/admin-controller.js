function AdminCtrl($scope, $timeout, $window, $rootScope) {
  if (localStorage.CMSCAPTCHA && window.location.pathname === '/eventManage/login') {
    window.location.pathname = '/eventManage/home';
  }

  if (localStorage.CMSCAPTCHA) {
    $rootScope.access = true;
  } else {
    $scope.navShow = {'padding-left': 0};
    $scope.footerShow = {'margin-left': 0};
  }

  document.getElementById('main').style.minHeight = document.body.clientHeight
    - document.getElementById('footer').offsetHeight
    - document.getElementById('nav').offsetHeight - 30 + 'px';

  //监听ngView完成事件，延迟200ms用于页面渲染
  $scope.$on('$viewContentLoaded', function () {
    $timeout(function () {
      if ($window.location.pathname === '/eventManage/home') {
        $scope.redirect(0);
      } else if ($window.location.pathname === '/eventManage/event') {
        $scope.redirect(1);
      } else if ($window.location.pathname === '/eventManage/setting') {
        $scope.redirect(2);
      } else if ($window.location.pathname === '/eventManage/help') {
        $scope.redirect(3);
      }
    }, 50);
  });

  //侧边栏显示内容
  $scope.sidebars = [
    {
      'id': 'sidebarHome',
      'display_name': '首页',
      'url': '/eventManage/home'
    },
    {
      'id': 'sidebarEvent',
      'display_name': '竞赛',
      'url': '/eventManage/event'
    },
    {
      'id': 'sidebarSetting',
      'display_name': '设置',
      'url': '/eventManage/setting'
    },
    {
      'id': 'sidebarHelp',
      'display_name': '帮助',
      'url': '/eventManage/help'
    }
  ];

  //跳转函数，包括操作侧边栏按钮和跳转至相应页面
  $scope.redirect = function (index) {
    for (var i = 0; i < $scope.sidebars.length; i++) {
      $scope.sidebars[i].active = false;
    }
    $scope.sidebars[index].active = true;

    $('.button-collapse').sideNav('hide');
  };

  $scope.logout = function () {
    localStorage.removeItem('CMSCAPTCHA');
    window.location.pathname = '/eventManage/login/';
  }
}

function HomeCtrl($scope) {
}

function EventCtrl($scope, $resource) {
  var localInfo = JSON.parse(localStorage.CMSCAPTCHA);
  var GetTeam = $resource('/api/team');
  var GetProject = $resource('/api/Projects');
  var Contest = $resource('/api/ContestOrgs/' + localInfo.userId + '/contests?access_token=' + localInfo.id);
  GetTeam.query({},
    function (res) {
      console.log('团队');
      console.log(res);
    },
    function () {
    }
  );
  GetProject.query({},
    function (res) {
      console.log('项目');
      console.log(res);
      $scope.projects = res;
    },
    function () {
    }
  );
  Contest.query({},
    function (res) {
      console.log('竞赛');
      console.log(res);
      $scope.contestLists = res;
    },
    function () {
    }
  );

  $scope.contest = {};

  $scope.explainDocLoad = function () {
    var e = document.getElementById('explainDoc').files;
    uploadFile(e, function (res) {
      $scope.contest.explainUrl = res[0].url;
      $scope.$apply();
    });
  };

  $scope.processDocLoad = function () {
    var e = document.getElementById('processDoc').files;
    uploadFile(e, function (res) {
      console.log(res);
      $scope.contest.processUrl = res[0].url;
      $scope.$apply();
    });
  };

  $scope.ruleDocLoad = function () {
    var e = document.getElementById('ruleDoc').files;
    uploadFile(e, function (res) {
      $scope.contest.ruleUrl = res[0].url;
      $scope.$apply();
    });
  };

  function uploadFile(files, callback) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      file = files[i];
      formData.append(file.name, file);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      }
    };
    xhr.open("POST", "/ue/uploads?action=uploadfile&dynamicPath=contest&files=" + files.length, true);
    xhr.send(formData);
  }

  $scope.submit = function () {
    if (!($scope.contest.name && $scope.contest.ruleUrl && $scope.contest.processUrl && $scope.contest.explainUrl)) {
      alert("请填写完整哦");
    } else {
      Contest.save({}, $scope.contest, function (res) {
        alert("创建成功！");
        history.go(0);
      }, function (res) {

      });
    }
  };

}

function SettingCtrl() {
}

function HelpCtrl() {
}
function LoginCtrl($scope, Org) {
  $scope.org = {};
  $scope.login = function () {
    $scope.org.email = $scope.org.phone + '@etuan.org';
    Org.login($scope.org, function (res) {
      if (res.err) {
        alert('登录失败');
      } else {
        localStorage.CMSCAPTCHA = JSON.stringify(res.token);
        window.location.pathname = '/eventManage/home';
      }
    }, function () {
    });
  };
}
