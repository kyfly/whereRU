
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

  User.find({},
    function(res){
      $scope.allCoteries=res;
    },function(){}
  );

  $scope.coterieNewMessage=true;



  $scope.showAllConterie = false;

  $scope.showExitConterie = true;



}]);
app.controller('CoterieDetailController', ['$scope', '$location','User', function($scope,$location,User){
  console.log($location.search().id);
  User.prototype_get_articles({
      id: $location.search().id,
      filter: {
        order: 'created DESC'
      }
    },function(res){
      $scope.coterieArticles=res;

    },function(){}
  );





  //系统消息待定
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



