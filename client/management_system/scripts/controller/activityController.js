app.controller('ActivityListCtrl', ['$scope', 'Team', function ($scope, Team) {
  $scope.allChosen = true;

  $scope.showSingleType = function (type) {
    if(type === 'all'){
      $scope.allChosen = true;
    } else {
      $scope.allChosen = false;
      $scope.chosenType = type;
    }
  };

  $scope.unFormat = "yyyy-MM-dd HH:mm";
  $scope.format = "yyyy-MM-dd";

  Team.prototype_get_activities({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
      order: 'created DESC'
    }
  }, function (res) {
    $scope.activityItems = res;
  }, function () {
    Materialize.toast('获取活动列表失败！', 6000);
  });

  $scope.deleteActivity = function () {
    var thisElement = this;
    console.log(thisElement);
    Team.prototype_destroyById_activities({
      id: localStorage.$LoopBack$currentTeamId,
      fk: thisElement.activityItem.id
    }, function () {
      Materialize.toast('删除成功！', 2000);
      var id = thisElement.activityItem.id;
      for (var x in $scope.activityItems) if ($scope.activityItems[x].id === id) {
        $scope.activityItems.splice(x, 1);
      }
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  }

}]);

app.controller('ActivityEditCtrl', ['$scope', 'Team', 'Ueditor', '$location', function ($scope, Team, Ueditor, $location) {
  $scope.activityData = {
    authorName: $scope.teamInfo.name,     //$scope.teamInfo在homeController里面获取
    authorId: $scope.teamInfo.id,
    type: $scope.teamInfo.type,
    school: $scope.teamInfo.school,
    hidden: false,
    created: new Date()
  };
  //Input-date的配置
  var currentTime = new Date();
  $scope.minDate = (new Date(currentTime.getTime())).toISOString();
  $scope.month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  $scope.monthShort = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  $scope.weekdaysFull = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  $scope.weekdaysLetter = ['日', '一', '二', '三', '四', '五', '六'];
  $scope.today = '今天';
  $scope.clear = '清除';
  $scope.close = '确定';
  $scope.deadline = {};

  var tabSelect = ['mainInfo', 'copywriter', 'complete'];
  $scope.nextStep = function (step) {
    $('#editActivityTabs').tabs('select_tab', tabSelect[step]);
  };

  $scope.activityEditorConfig = Ueditor.config;
  $scope.createActivity = function () {
    Team.prototype_create_activities({
      id: localStorage.$LoopBack$currentTeamId
    }, $scope.activityData, function () {
      Materialize.toast('创建成功！', 2000);
      $location.path('/MS/activity/list');
    }, function () {
      Materialize.toast('创建失败！', 2000);
    });
  }

}]);
