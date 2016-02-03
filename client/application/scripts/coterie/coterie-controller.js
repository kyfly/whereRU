app.controller('CoteriesController', ['$scope', 'User','$stateParams', function ($scope, User,$stateParams) {

  User.prototype_get_coteries({
      id: localStorage.$LoopBack$currentUserId,
      filter: {
        order: 'created DESC'
      }
    }, function (res) {
      $scope.existCoterieList = res;
      $scope.contentName = $scope.existCoterieList[0].name;
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

  ////在发现更多里面出去去已有coterie
  //$scope.coterieRemove = function () {
  //  for (var i=0;i<count($scope.existCoterieList);i++){
  //    for (var j=0;j<count($scope.allCoteries);j++){
  //      if($scope.existCoterieList[i].id == $scope.allCoteries.id){
  //        $scope.showAllConterie = true;
  //      }
  //    }
  //  }
  //};
  //

  //修改最后浏览时间
  $scope.updateLastView = function (index) {

    if($stateParams.id == $scope.existCoterieList[index].id) {
      User.prototype_link_coteries({
          id: localStorage.$LoopBack$currentUserId,
          fk: $stateParams.id
        }, {
          lastView : new Date()
        }, function () {
          Materialize.toast('修改最后阅读时间成功！', 2000);
        }, function () {
        }
      );
    }
  };




}]);

app.controller('CoterieDetailController', ['$scope', '$stateParams', 'User','$rootScope' ,function ($scope, $stateParams, User,$rootScope) {
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


  //修改最后浏览时间
  //$rootScope.updateLastView = function (index) {
  //  console.log(index);
  //  if($stateParams.id == $rootScope.existCoterieList[index].id) {
  //    User.prototype_link_coteries({
  //        id: localStorage.$LoopBack$currentUserId,
  //        fk: $stateParams.id
  //      }, {
  //        lastView : new Date()
  //      }, function () {
  //        Materialize.toast('修改最后阅读时间成功！', 2000);
  //      }, function () {
  //
  //      }
  //    );
  //  }
  //};

  //关注圈子
  $scope.showDetail = function () {
    thisElement = this;
  };



  //用来关注
  $scope.coterieConcern = function () {
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


}]);



