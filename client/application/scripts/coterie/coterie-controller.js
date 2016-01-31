
app.controller('CoteriesController', ['$scope','User', '$location', function($scope,User,$location){
  console.log($location.search().id);
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

  User.prototype_get_articles({
      id: $location.search().id,
      filter: {
        order: 'created DESC'
      }
    },function(res){
      $scope.coterieArticles=res;

    },function(){}
  );


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

