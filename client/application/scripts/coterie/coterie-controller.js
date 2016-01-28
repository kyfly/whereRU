app.controller('UCoterieController', ['$scope', UCoterieController]);
function UCoterieController($scope){
  $(".button-collapse").sideNav();
  $scope.sidebars = [
    {
      'display_name':'null'
    },
    {
      'img' :'/client/application/images/coterie/xiTong.png',
      'id': 'sidebarSystemInfo',
      'display_name': '系统消息',
      'url': '/w/systemInfo'
    },
    {
      'img' :'/client/application/images/coterie/hangDian.png',
      'id': 'sidebarHangDianInfo',
      'display_name': '杭州电子科技大学',
      'url': '/w/hangDianInfo'
    },
    {
      'id': 'sidebarEvent',
      'display_name': '竞赛管理',
      'url': '/MS/event'
    }
  ];
}


