app.controller('ActivityListCtrl', ['$scope', 'Team', function ($scope, Team) {
  $scope.allChosen = true;

  $scope.showAll = function () {
    $scope.allChosen = true;
  };

  $scope.showFormOnly = function () {
    $scope.allChosen = false;
    $scope.typeChosen = '表单';
  };

  $scope.showVoteOnly = function () {
    $scope.allChosen = false;
    $scope.typeChosen = '投票';
  };

  $scope.showSeckillOnly = function () {
    $scope.allChosen = false;
    $scope.typeChosen = '抢票';
  };

  $scope.unFormat = "yyyy-MM-dd HH:mm";
  $scope.format = "yyyy-MM-dd";

  Team.prototype_get_activities({
    id: localStorage.$LoopBack$currentTeamId
  }, function (res) {
    console.log(res, '活动列表');
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

app.controller('ActivityEditCtrl', ['$scope', 'Team', function ($scope, Team) {
  $scope.activityData = {};
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

  $scope.isActive = [];

  $scope.nextStep = function (step) {
    if(step === 0){
      $('#editActivityTabs').tabs('select_tab', 'copywriter');
    } else if(step === 1){
      $('#editActivityTabs').tabs('select_tab', 'complete');
    }

  }

}]);
