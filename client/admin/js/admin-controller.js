var localInfo = JSON.parse(localStorage.CMSCAPTCHA);
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

  $scope.orgName = localInfo.name;

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

function EventCtrl($scope, $resource, ContestOrg, Contest) {
  var GetTeam = $resource('/api/team');
  var GetProject = $resource('/api/Projects');
  GetTeam.query({},
    function (res) {
      console.log(res, '团队');
    },
    function () {
    }
  );
  GetProject.query({},
    function (res) {
      console.log(res, '项目');
      $scope.projects = res;
    },
    function () {
    }
  );

  //获取竞赛列表
  ContestOrg.contests({
    id: localInfo.userId,
    access_token: localInfo.id
  }, function (res) {
    console.log(res, '竞赛');
    $scope.contestLists = res;

    $scope.deleteContest = function (index) {
      ContestOrg.contests.destroyById({
        id: localInfo.userId,
        fk: res[index].id,
        access_token: localInfo.id
      }, function () {
        history.go(0);
      })
    };

    //更新竞赛信息
    $scope.changeEvent = res;
    $scope.updateExplainDoc = function (index) {
      var e = document.getElementById('changeExplainDoc' + index).files;
      uploadFile(e, function (data) {
        console.log(data);
        $scope.changeEvent[index].explainUrl = data[0].url;
        $scope.$apply();
      });
    };

    $scope.updateProcessDoc = function (index) {
      var e = document.getElementById('changeProcessDoc' + index).files;
      uploadFile(e, function (data) {
        $scope.changeEvent[index].processUrl = data[0].url;
        $scope.$apply();
      });
    };

    $scope.updateRuleDoc = function (index) {
      var e = document.getElementById('changeRuleDoc' + index).files;
      uploadFile(e, function (data) {
        $scope.changeEvent[index].ruleUrl = data[0].url;
        $scope.$apply();
      });
    };

    $scope.updateEvent = function (index) {
      ContestOrg.contests.updateById({
        id: localInfo.userId,
        fk: res[index].id,
        access_token: localInfo.id
      }, $scope.changeEvent[index], function () {
        alert('更新成功！');
      }, function () {
        alert('更新失败！');
      })
    };

    $scope.material = {};

    $scope.materialLoad = function (index) {
      var e = document.getElementById('addMaterialDoc' + index).files;
      uploadFile(e, function (data) {
        $scope.material.name = data[0].original;
        $scope.material.dataUrl = data[0].url;
        $scope.$apply();
      });
    };

    $scope.creatMaterial = function (index) {
      $scope.material.loader = localInfo.name;
      $scope.material.createAt = new Date();
      Contest.materials.create({
          id: res[index].id,
          access_token: localInfo.id
        }, $scope.material, function (res) {
          alert('上传成功！');
          history.go(0);
        }, function () {
          alert('上传失败！');
        }
      )
    };

    $scope.loadContest = function (index) {
      Contest.materials({
        id: res[index].id,
        access_token: localInfo.id
      }, function (res) {
        $scope.materialList = res;
      });
    };


  });

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
      alert("请填写完整哦");
    } else {
      ContestOrg.contests.create({
        id: localInfo.userId,
        access_token: localInfo.id
      }, $scope.contest, function () {
        history.go(0);
      }, function () {
        alert("创建失败！");
      });
    }
  };

  //参赛队伍，通知管理，资料库，竞赛设置的切换
  $scope.contentType = 'contestTeam';

  $scope.toContestTeam = function () {
    $scope.contentType = 'contestTeam';
  };

  $scope.toContestNotice = function () {
    $scope.contentType = 'contestNotice';
  };

  $scope.toContestLibrary = function (index) {
    $scope.contentType = 'contestLibrary';
  };

  $scope.toContestSetting = function () {
    $scope.contentType = 'contestSetting';
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

}

function SettingCtrl($scope, ContestOrg) {
  ContestOrg.findById({
    id: localInfo.userId,
    access_token: localInfo.id
  }, function (res) {
    $scope.orgChange = res;
  });

  $scope.updateOrgInfo = function () {
    ContestOrg.prototype$updateAttributes({
      id: localInfo.userId,
      access_token: localInfo.id
    }, $scope.orgChange, function (res) {
      alert('更新成功！');
      history.go(0);
    });
  };
}

function HelpCtrl() {
}

function LoginCtrl($scope, ContestOrg) {
  $scope.org = {};
  $scope.register = function () {
    window.location.pathname = '/eventManage/reg';
  };
  $scope.login = function () {
    ContestOrg.login($scope.org, function (res) {
      console.log(res);
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

function SignUpCtrl($scope, ContestOrg) {
  $scope.org = {};
<<<<<<< HEAD
  $scope.schools = School.find({
    filter: {
      fields: ['name']
    }
  });
=======
  $scope.goBack = function () {
    window.location.pathname = '/eventManage/login';
  };
>>>>>>> b4d6053c63602c0488ddbcc84a406cb49c8f0542
  $scope.signUp = function () {
    ContestOrg.create($scope.org, function (res) {
      if (res.err || res.name == 'ValidationError') {
        alert('注册失败');
      } else {
        localStorage.CMSCAPTCHA = JSON.stringify(res.token);
        window.location.pathname = '/eventManage/home';
      }
    }, function () {
      alert("注册失败，请检查您填写的内容");
    });
  };
}
