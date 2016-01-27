app.controller('AdminCtrl', ['$scope', '$timeout', '$window', '$rootScope', AdminCtrl]);
function AdminCtrl($scope, $timeout, $window, $rootScope) {
  if (localStorage['$LoopBack$currentUserId'] && window.location.pathname === '/MS/login') {
    window.location.pathname = '/MS/home';
  }
  if (localStorage['$LoopBack$currentUserId']) {
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
      if ($window.location.pathname === '/MS/home') {
        $scope.redirect(0);
      } else if ($window.location.pathname === '/MS/member') {
        $scope.redirect(1);
      } else if ($window.location.pathname === '/MS/event') {
        $scope.redirect(2);
      } else if ($window.location.pathname === '/MS/activity') {
        $scope.redirect(3);
      } else if ($window.location.pathname === '/MS/form') {
        $scope.redirect(4);
      } else if ($window.location.pathname === '/MS/vote') {
        $scope.redirect(5);
      } else if ($window.location.pathname === '/MS/seckill') {
        $scope.redirect(6);
      } else if ($window.location.pathname === '/MS/album') {
        $scope.redirect(7);
      } else if ($window.location.pathname === '/MS/setting') {
        $scope.redirect(8);
      } else if ($window.location.pathname === '/MS/help') {
        $scope.redirect(9);
      }
    }, 50);
  });

  //侧边栏显示内容
  $scope.sidebars = [
    {
      'id': 'sidebarHome',
      'display_name': '首页',
      'url': '/MS/home'
    },
    {
      'id': 'sidebarMember',
      'display_name': '成员管理',
      'url': '/MS/member'
    },
    {
      'id': 'sidebarEvent',
      'display_name': '竞赛管理',
      'url': '/MS/event'
    },
    {
      'id': 'sidebarActivity',
      'display_name': '活动管理',
      'url': '/MS/activity'
    },
    {
      'id': 'sidebarForm',
      'display_name': '表单管理',
      'url': '/MS/form'
    },
    {
      'id': 'sidebarVote',
      'display_name': '投票管理',
      'url': '/MS/vote'
    },
    {
      'id': 'sidebarSeckill',
      'display_name': '抢票管理',
      'url': '/MS/seckill'
    },
    {
      'id': 'sidebarAlbum',
      'display_name': '相册管理',
      'url': '/MS/album'
    },
    {
      'id': 'sidebarSetting',
      'display_name': '设置',
      'url': '/MS/setting'
    },
    {
      'id': 'sidebarHelp',
      'display_name': '帮助',
      'url': '/MS/help'
    }
  ];

  //跳转函数，包括操作侧边栏按钮和跳转至相应页面
  //这里可以试试css选择器
  $scope.redirect = function (index) {
    for (var i = 0; i < $scope.sidebars.length; i++) {
      $scope.sidebars[i].active = false;
    }
    $scope.sidebars[index].active = true;

    $('.button-collapse').sideNav('hide');
  };

  $scope.logout = function () {
    localStorage.removeItem('CMSCAPTCHA');
    window.location.pathname = '/MS/login/';
  }
}

app.controller('HomeCtrl', ['$scope', function ($scope) {

}]);

app.controller('ListCtrl', ['$scope', function ($scope) {

}]);

app.controller('EditCtrl', ['$scope', function ($scope) {

}]);

app.controller('ResultCtrl', ['$scope', function ($scope) {

}]);

app.controller('MemberCtrl', ['$scope', 'Team', function ($scope, Team) {
  Team.prototype_get_members({
      id: localStorage.$LoopBack$currentTeamId
    },
    function (res) {
      console.log(res,'成员');
      $scope.members = res;
    },
    function () {

    }
  );
}]);

app.controller('EventCtrl', ['$scope', 'Team', function ($scope, Team) {
  //获取竞赛列表
  Team.prototype_get_races({
    id: localStorage.$LoopBack$currentTeamId
  }, function (res) {
    if (res.length === 0) {
      $scope.noEvent = true;
    }
    console.log(res, '竞赛');
    $scope.contestLists = res;
  });
  $scope.noEvent = false;
  //ContestOrg.contests({
  //  id: localInfo.userId,
  //  access_token: localInfo.id
  //}, function (res) {
  //  if (res.length === 0) {
  //    $scope.noEvent = true;
  //  }
  //  console.log(res, '竞赛');
  //  $scope.contestLists = res;
  //
  //  $scope.deleteContest = function (index) {
  //    ContestOrg.contests.destroyById({
  //      id: localInfo.userId,
  //      fk: res[index].id,
  //      access_token: localInfo.id
  //    }, function () {
  //      history.go(0);
  //    })
  //  };
  //
  //  //更新竞赛信息
  //  $scope.changeEvent = res;
  //  $scope.updateExplainDoc = function (index) {
  //    var e = document.getElementById('changeExplainDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      console.log(data);
  //      $scope.changeEvent[index].explainUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.updateProcessDoc = function (index) {
  //    var e = document.getElementById('changeProcessDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      $scope.changeEvent[index].processUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.updateRuleDoc = function (index) {
  //    var e = document.getElementById('changeRuleDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      $scope.changeEvent[index].ruleUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.updateEvent = function (index) {
  //    ContestOrg.contests.updateById({
  //      id: localInfo.userId,
  //      fk: res[index].id,
  //      access_token: localInfo.id
  //    }, $scope.changeEvent[index], function () {
  //      Materialize.toast('更新成功！', 2000)
  //    }, function () {
  //      Materialize.toast('更新失败！', 2000)
  //    })
  //  };
  //
  //  $scope.material = {};
  //
  //  $scope.materialLoad = function (index) {
  //    var e = document.getElementById('addMaterialDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      $scope.material.name = data[0].original;
  //      $scope.material.dataUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.creatMaterial = function (index) {
  //    $scope.material.loader = localInfo.name;
  //    $scope.material.createAt = new Date();
  //    if ($scope.material.dataUrl) {
  //      Contest.materials.create({
  //          id: res[index].id,
  //          access_token: localInfo.id
  //        }, $scope.material, function () {
  //          Materialize.toast('上传成功！', 2000)
  //        }, function () {
  //          Materialize.toast('上传失败！', 2000)
  //        }
  //      )
  //    } else {
  //      Materialize.toast('请先选择文件！', 2000)
  //    }
  //  };
  //
  //  $scope.loadContest = function (index) {
  //    Contest.materials({
  //      id: res[index].id,
  //      access_token: localInfo.id,
  //      filter: {
  //        order: 'createAt DESC'
  //      }
  //    }, function (res) {
  //      $scope.materialList = res;
  //    });
  //  };
  //
  //
  //});

  //新建竞赛
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

  //上传文件
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

  $scope.addContest = function () {
    if (!($scope.contest.name && $scope.contest.ruleUrl && $scope.contest.processUrl && $scope.contest.explainUrl)) {
      Materialize.toast('请填写完整哦！', 2000);
    } else {
      ContestOrg.contests.create({
        id: localInfo.userId,
        access_token: localInfo.id
      }, $scope.contest, function () {
        history.go(0);
      }, function () {
        Materialize.toast('创建失败！', 2000);
      });
    }
  };

  //参赛队伍，通知管理，资料库，竞赛设置的切换
  $scope.contentType = 0;

  $scope.contentTypeChange = function (contentType) {
    $scope.contentType = contentType;
  };

  //通知管理
  $scope.newNotice = {};
  $scope.uploadAttachment = false;
  $scope.addGetInfo = false;

  //Input-date的配置
  var currentTime = new Date();
  $scope.minDate = (new Date(currentTime.getTime())).toISOString();
  $scope.month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  $scope.monthShort = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  $scope.weekdaysFull = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  $scope.weekdaysLetter = ['日', '一', '二', '三', '四', '五', '六'];
  $scope.today = '今天';
  $scope.clear = '清除';
  $scope.close = '确定';
  $scope.deadline = {};
}]);

app.controller('ActivityCtrl', ['$scope', function ($scope) {

}]);

app.controller('FormCtrl', ['$scope', function ($scope) {

}]);

app.controller('VoteCtrl', ['$scope', function ($scope) {

}]);

app.controller('SeckillCtrl', ['$scope', function ($scope) {

}]);

app.controller('AlbumCtrl', ['$scope', function ($scope) {

}]);

app.controller('SettingCtrl', ['$scope', function ($scope) {

}]);

app.controller('HelpCtrl', ['$scope', function ($scope) {

}]);
