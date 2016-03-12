
app.controller('ActivitiesController', ['$scope', 'Activity', function ($scope, Activity) {
  $scope.activityFilter = ['全部', '进行中', '未开始', '已结束'];
  $scope.choice = '全部';
  $scope.changeFilter = function () {
    $scope.choice = this.filter;
  }
  $scope.filterFun = function (activity) {
    switch($scope.choice) {
      case '全部':
        return true;
      case '进行中':
        if (activity.status === 'ing')
          return true;
      case '未开始':
        if (activity.status === 'nos')
          return true;
      case '已结束':
        if (activity.status === 'end')
          return true;
    }
  }
  function getActivityStatus(activity) {
    var now = new Date();
    if (activity.ended < now) {
      activity.status = 'end';
    } else if (activity.started > now){
      activity.status = 'nos';
    } else {
      activity.status = 'ing';
    }
  }
  if (!$scope.$currentUser) {
    Activity.find(function (activities) {
      $scope.activityItems = activities;
      $scope.activityItems.forEach(function (activity) {
        getActivityStatus(activity);
      });
    }, function (err) {
      $scope.errorTip(err);
    });
  }

  //登录用户获取所在学校活动信息
  else {
    Activity.getMySchoolActiveties({
      school: $scope.$currentUser.school
    }, function(res){
      for (x in res) if (x === 'activties') {
        $scope.activityItems = res[x];
        $scope.activityItems.forEach(function (activity) {
          getActivityStatus(activity);
        });
      }
    }, function (err) {
      $scope.errorTip(err);
    });
  }
}]);


app.controller('ActivityController', ['$scope', 'Activity', 'User', '$stateParams', '$interval',function($scope, Activity, User, $stateParams, $interval){
  Activity.findById({
    id: $stateParams.id
  }, function (activity) {
    $scope.activity = activity;
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
      $scope[activity.actType] = res[0];
      if (activity.actType === 'seckill') {
        var countDown = Math.floor((new Date($scope.seckill.started) - new Date($scope.seckill.serverTime))/1000);
        var time = formatTime(countDown);
        $scope.countDown = countDown;
        $scope.seckillTime = time;
        var timer = $interval(function () {
          countDown --;
          var s = countDown % 60;
          var d = Math.floor(countDown / (3600*24));
          var h = Math.floor((countDown - d * 3600 * 24) / 3600);
          var m = Math.floor((countDown - d * 3600 * 24 - h * 3600) / 60);
          $scope.seckillTime = {
            d: d,
            h: h,
            m: m,
            s: s
          };
          if (countDown <= 0) {
            $interval.cancel(timer);
          }
        }, 1000);
        $scope.$on('$destroy',function(){
          $interval.cancel(timer);
        });
      }
    }, function (err) {
      $scope.errorTip(err);
    });
  }, function (err) {
    $scope.errorTip(err);
  });
  $scope.onClickJoinActivity = function () {
    var actType = $scope.activity.actType;
    if (actType !== 'common') {
      $scope.result = new Array($scope[actType]['_'+ actType +'Items'].length);
    }
  };

  function formatTime (time) {
    var s = time % 60;
    var d = Math.floor(time / (3600*24));
    var h = Math.floor((time - d * 3600 * 24) / 3600);
    var m = Math.floor((time - d * 3600 * 24 - h * 3600) / 60);
    return {
      d: d,
      h: h,
      m: m,
      s: s
    };
  }

  $scope.checkedForVote = function () {
    var results = $scope.result.filter(function (item) {
      return item;
    });
    if (results.length > $scope.vote.max) {
      this.result[this.$index] = undefined;
      Materialize.toast('只能选择' + $scope.vote.max + '项哦', 2000);
      return;
    }
    if (this.result[this.$index]) {
      this.voteIteam.count ++;
    } else {
      this.voteIteam.count --;
    }
  };

  $scope.submitFormResult = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    for (var x in $scope.form._formItems) if ($scope.form._formItems[x].type === 'select') {
      $scope.result[x].type = 'selelct';
      $scope.result[x].name = $scope.result[x].option;
      $scope.result[x].option = undefined;
    } else {
      $scope.result[x].type = $scope.form._formItems[x].type;
    }
    var formResult = {
      'verifyId': $scope.verifyId,
      'formId': $scope.form.id,
      'created': new Date(),
      'result': $scope.result
    };
    User.prototype_create_formResults({
      id: $scope.$currentUser.id
    }, formResult, function (res) {
      if (res.status === 1000 || res.status === 1100)
        Materialize.toast(res.message, 2000);
      else
        Materialize.toast('参与成功', 2000);
    }, function (err) {
      $scope.errorTip(err);
    });
  };
  $scope.submitVoteResult = function () {
    var result = [];
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    if ($scope.activity.verifyRule && !$scope.verifyId) {
      Materialize.toast('验证规则必须填', 2000);
      return;
    }
    for (var x in $scope.result) if ($scope.result[x]) {
      result.push($scope.vote._voteItems[x].id);
    }
    if (result.length > $scope.vote.max) {
      Materialize.toast('只能选择' + $scope.vote.max + '项哦', 2000);
      return;
    } else if (result.length <= 0) {
      Materialize.toast('至少选择一项哦', 2000);
      return;
    }
    var voteResult = {
      'verifyId': $scope.verifyId,
      'voteId': $scope.vote.id,
      'created': new Date(),
      'result': result
    }
    User.prototype_create_voteResults({
      id: $scope.$currentUser.id
    }, voteResult, function (res) {
      if (res.status === 1000) {
        Materialize.toast(res.message, 2000);
      } 
      else
        Materialize.toast('参与成功', 2000);
    }, function (err) {
      $scope.errorTip(err);
    });
  };
  $scope.submitSeckillResult = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    var seckillResult = {
      "created": new Date(),
      "verifyId": $scope.verifyId,
      "itemId": this.seckillItem.id,
      "seckillId": $scope.seckill.id
    };
    User.prototype_create_seckillResults({
      id: $scope.$currentUser.id
    }, seckillResult, function (res) {
      if (res.status === 1000 || res.status === 1100)
        Materialize.toast(res.message, 2000);
      else 
        Materialize.toast('恭喜你,抢到了', 2000);
    }, function (err) {
      $scope.errorTip(err);
    });
  }
}]);

