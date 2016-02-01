app.controller('CoteriesController', ['$scope', 'User', function ($scope, User) {

  User.prototype_get_coteries({
      id: localStorage.$LoopBack$currentUserId,
      filter: {
        order: 'created DESC'
      }
    }, function (res) {
      $scope.existCoterieList = res;
      $scope.contentName = $scope.existCoterieList[0].name;
      console.log(res);
    }, function () {
    }
  );


  User.find({},
    function (res) {
      $scope.allCoteries = res;
    }, function () {
    }
  );

  $scope.coterieNewMessage = true;

  $scope.showAllConterie = false;

  $scope.showExitConterie = true;

  $scope.showName = function () {
    if($scope.showExitConterie == true){
      $scope.contentName = this.sideBarInfo.name;
    }
    if($scope.showAllConterie == true){
      $scope.contentName = this.allCoterie.name;
    }
  };


}]);

app.controller('CoterieDetailController', ['$scope', '$stateParams', 'User', function ($scope, $stateParams, User) {
  User.prototype_get_articles({
      id: $stateParams.id,
      filter: {
        order: 'created DESC'
      }
    }, function (res) {
      $scope.coterieArticles = res;
    }, function () {
    }
  );

  //关注圈子
  $scope.showDetail = function () {
    thisElement = this;
    //console.log(thisElement)
  };


  $scope.coterieConcern = function () {
    //console.log($scope.allCoteries);


    User.prototype_link_coteries({
        id: localStorage.$LoopBack$currentUserId,
        fk: $stateParams.id
      }, {}, function () {
        Materialize.toast('关注成功！', 2000);
      }, function () {
        Materialize.toast('关注失败！', 2000);
      }
    );
  };

  //圈子关注数量
  User.prototype_count_fans({
      id: $stateParams.id
      //filter: {
      //  order: 'created DESC'
      //}
    }, function (res) {
      $scope.coterieConcernedNum = res;
    }, function () {
    }
  );


  //系统消息待定
  $scope.systemElements = [{
    img: 'system.png',
    icon: 'mdi-image-filter-drama',
    title: '科技馆讲座',
    time: '2016-1-1',
    shortMessage: '简短消息',
    content: '具体信息.'
  }, {
    img: 'hangDian.png',
    icon: 'mdi-maps-place',
    title: '创业竞赛1',
    time: '2016-1-1',
    shortMessage: '简短消息',
    content: '具体信息.'
  }, {
    img: 'tuanTuan.png',
    icon: 'mdi-social-whatshot',
    title: '创业竞赛2',
    time: '2016-1-1',
    shortMessage: '简短消息',
    content: '具体信息.'
  }
  ];

  $(function () { $("[data-toggle='tooltip']").tooltip(); });
}]);



