function AdminCtrl($scope, $timeout, $window) {
  //监听ngView完成事件，延迟200ms用于页面渲染
  $scope.$on('$viewContentLoaded', function () {
    if (document.body.clientWidth >= 768) {
      $timeout(function () {
        document.getElementById('main').style.minHeight = document.body.clientHeight - document.getElementById('footer').offsetHeight - document.getElementById('nav').offsetHeight + 'px';
      }, 200);
    }
  });
  //检测函数，利用路由判断，辅助检测左边的按钮何时应该高亮
  var sidebarItemChosen = function (type) {
    var rx = new RegExp('#\/' + type);
    return rx.test($window.location.hash);
  };
  //侧边栏显示内容
  $scope.sidebars = [
    {
      'id': 'sidebarHome',
      'display_name': '首页',
      'url': '#/home',
      'active': sidebarItemChosen('home')
    },
    {
      'id': 'sidebarEvent',
      'display_name': '竞赛',
      'url': '#/event',
      'active': sidebarItemChosen('vote')
    },
    {
      'id': 'sidebarSetting',
      'display_name': '设置',
      'url': '#/setting',
      'active': sidebarItemChosen('setting')
    },
    {
      'id': 'sidebarHelp',
      'display_name': '帮助',
      'url': '#/help',
      'active': sidebarItemChosen('help')
    }
  ];
  //跳转函数，包括操作侧边栏按钮和跳转至相应页面
  $scope.redirect = function (index) {
    for (var i = 0; i < $scope.sidebars.length; i++) {
      $scope.sidebars[i].active = false;
    }
    $scope.sidebars[index].active = true;
    $window.location.hash = $scope.sidebars[index].url;
  };
}

function HomeCtrl() {
}

function EventCtrl() {
}

function SettingCtrl() {
}

function HelpCtrl() {
}
