app.controller('ActivitiesController', ['$scope', 'Activity', function ($scope, Activity) {
  //匿名用户获取部分活动信息
  if (!$scope.username) {
    Activity.find(function (activities) {
      $scope.activityItems = activities;
    });
  } 
  //登录用户获取所在学校活动信息
  else {
    Activity.getMySchoolActiveties({
      school: $scope.$currentUser.school
    }, function(res){
      for (x in res) if (x === 'activties') {
        $scope.activityItems = res[x];
      }
    });
  }
}]);

app.controller('ActivityController', ['$scope', 'Activity', 'User', '$stateParams', '$interval',function($scope, Activity, User, $stateParams, $interval){
  Activity.findById({
    id: $stateParams.id
  }, function (activity) {
    $scope.activityCurrent = activity;
    $scope.$emit('shareContentArrive', {
      bdText: activity.title,
      bdDesc: activity.keyword,
      bdPic: activity.imgUrl
    });
    if (activity.actType === 'common')
      return;
    Activity['prototype_get_'+ activity.actType +'s']({
      id: $stateParams.id
    }, function (res) {
      $scope[activity.actType + 's'] = res[0];
      if (activity.actType === 'seckill') {
        scope.countDown = (new Date(res[0].started) - new Date(res[0].serverTime));
      }
    });
  });
  $scope.onClickJoinActivity = function () {
    var actType = $scope.activityCurrent.actType;
    if (actType !== 'common') {
      $scope.result = new Array($scope[actType + 's']['_'+ actType +'Items'].length);
      $scope[actType + 's'] = $scope[actType + 's'];
    }
    if (actType === 'seckill' && $scope.countDown > 0) {
      var countDown = $scope.countDown / 1000;
      var timer = $interval(function () {
        var time = $scope.countDown --;
        $scope.seckillState = time;
        // if ($scope.countDown <= 0) {
        //   $interval.cancel(timer)
        // }
      }, 1000);
    } else {
      $scope.seckillState = "正在进行中";
    }
  };

  function formatTime (time) {
    time = Math.floor(time/1000);
    var s = time % 60;
    var d = Math.floor(time / (3600*24));
    var h = Math.floor((time - d * 3600 * 24) / 3600);
    var m = Math.floor((time - d * 3600 * 24 - h * 3600) / 60);
    return d + '天' + h + '小时' + m + '分' + s;
  }

  $scope.checkedForVote = function () {
    var results = $scope.result.filter(function (item) {
      return item;
    });
    if (results.length > $scope.votes.max) {
      this.result[this.$index] = undefined;
      Materialize.toast('只能选择' + $scope.votes.max + '项哦', 4000);
      return;
    }
    if (this.result[this.$index]) {
      this.vote.count ++;
    } else {
      this.vote.count --;
    }
  }

  $scope.submitFormResult = function () {
    for (var x in $scope.forms._formItems) if ($scope.forms._formItems[x].type === 'select') {
      $scope.result[x].type = 'selelct';
      $scope.result[x].name = $scope.result[x].option;
      $scope.result[x].option = undefined;
    } else {
      $scope.result[x].type = $scope.forms._formItems[x].type;
    }
    var formResult = {
      'verifyId': $scope.verifyId,
      'formId': $scope.forms.id,
      'created': new Date(),
      'result': $scope.result
    };
    User.prototype_create_formResults({
      id: $scope.$currentUser.id
    }, formResult, function (res) {
      Materialize.toast('参与成功', 4000);
    });
  };
  $scope.submitVoteResult = function () {
    var result = [];
    for (var x in $scope.result) if ($scope.result[x]) {
      result.push($scope.votes._voteItems[x].id);
    }
    if (result.length > $scope.votes.max) {
      Materialize.toast('只能选择' + $scope.votes.max + '项哦', 4000);
      return;
    } else if (result.length <= 0) {
      Materialize.toast('至少选择一项哦', 4000);
      return;
    }
    var voteResult = {
      'verifyId': $scope.verifyId,
      'voteId': $scope.votes.id,
      'created': new Date(),
      'result': result
    }
    User.prototype_create_voteResults({
      id: $scope.$currentUser.id
    }, voteResult, function (res) {
      Materialize.toast('参与成功', 4000);
    });
  };
  $scope.submitSeckillResult = function () {

  }
}]);

