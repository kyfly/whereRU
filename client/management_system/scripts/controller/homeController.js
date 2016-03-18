app.controller('AdminCtrl', ['$scope', '$timeout', '$window', '$rootScope', 'Team', AdminCtrl]);
function AdminCtrl($scope, $timeout, $window, $rootScope, Team) {
  $rootScope.pageTitle = '首页';

  $scope.$on('$stateChangeStart', function (evt, next, current) {
    if (next.name !== 'index')
    $scope.redirect(next.stateIndex);
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
      'display_name': '资料管理',
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


}

app.controller('HomeCtrl', ['$scope', function ($scope) {
  $scope.logoHide = false;

}]);
