
app.controller('CoteriesController', ['$scope','User', function($scope,User){
  User.prototype_get_coteries({
      id: localStorage.$LoopBack$currentUserId,
      filter: {
        order: 'created DESC'
      }
    },function(res){
    $scope.existCoterieList=res;
    console.log(res);
  },function(){}
  );

  $scope.sidebars = [
    {
      'id': 'message1',
      'display_name': '系统消息',
      'url': '/w/message1',
      'uiSref':'coteries.message1'
    },
    {
      'id': 'message2',
      'display_name': ' 杭州电子科技大学',
      'url': '/w/message2',
      'uiSref':'coteries.message2'
    },
    {
      'id': 'message3',
      'display_name': '团团一家',
      'url': '/w/message3',
      'uiSref':'coteries.message3'
    }
    ];
    $scope.systemElements = [{
      img:'system.png',
      icon: 'mdi-image-filter-drama',
      title: '科技馆讲座',
      time:'2016-1-1',
      shortMessage:'简短消息',
      content: '具体信息.'
    },{
      img:'hangDian.png',
      icon: 'mdi-maps-place',
      title: '创业竞赛1',
      time:'2016-1-1',
      shortMessage:'简短消息',
      content: '具体信息.'
    },{
      img:'tuanTuan.png',
      icon: 'mdi-social-whatshot',
      title: '创业竞赛2',
      time:'2016-1-1',
      shortMessage:'简短消息',
      content: '具体信息.'
    }
    ];

}]);
app.controller('CoterieDetailController', ['$scope', function($scope){

}]);

app.controller('CoterieController', ['$scope', function($scope){

}]);

