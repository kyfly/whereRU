function AdminCtrl($scope, $timeout, $window) {
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
}

function HomeCtrl($scope) {
  $scope.selects = [
    {
      name:'123',
      yes:'23'
    },{
      name:'12232',
      yes:'222'
    }
];
}

function EventCtrl() {
}

function SettingCtrl() {
}

function HelpCtrl() {
}
