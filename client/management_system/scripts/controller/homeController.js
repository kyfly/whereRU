app.controller('AdminCtrl', ['$scope', '$timeout', '$window', '$rootScope', 'Team', AdminCtrl]);
function AdminCtrl($scope, $timeout, $window, $rootScope, Team) {
  $rootScope.logoHide = false;
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
      } else if ($window.location.pathname === '/MS/event/list' || $window.location.pathname.substr(0, 14) === '/MS/event/edit' || $window.location.pathname.substr(0, 16) === '/MS/event/detail') {
        $scope.redirect(2);
      } else if ($window.location.pathname === '/MS/activity/list' || $window.location.pathname.substr(0, 17) === '/MS/activity/edit') {
        $scope.redirect(3);
      } else if ($window.location.pathname === '/MS/form/list' || $window.location.pathname.substr(0, 13) === '/MS/form/edit') {
        $scope.redirect(4);
      } else if ($window.location.pathname === '/MS/vote/list') {
        $scope.redirect(5);
      } else if ($window.location.pathname === '/MS/seckill/list') {
        $scope.redirect(6);
      } else if ($window.location.pathname === '/MS/album') {
        $scope.redirect(7);
      } else if ($window.location.pathname === '/MS/setting') {
        $scope.redirect(8);
      } else if ($window.location.pathname === '/MS/help') {
        $scope.redirect(9);
      }
    }, 0);
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
      'url': '/MS/event/list'
    },
    {
      'id': 'sidebarActivity',
      'display_name': '活动管理',
      'url': '/MS/activity/list'
    },
    {
      'id': 'sidebarForm',
      'display_name': '表单管理',
      'url': '/MS/form/list'
    },
    {
      'id': 'sidebarVote',
      'display_name': '投票管理',
      'url': '/MS/vote/list'
    },
    {
      'id': 'sidebarSeckill',
      'display_name': '抢票管理',
      'url': '/MS/seckill/list'
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

  Team.findById({
    id: localStorage.$LoopBack$currentTeamId
  }, function (res) {
    $rootScope.teamInfo = res;
  });
}

app.controller('HomeCtrl', ['$scope', function ($scope) {
  $scope.logoHide = false;

}]);
