app.controller('ActivitiesController', ['$scope', 'Activity', function ($scope, Activity) {
  //匿名用户获取部分活动信息
  if (!$scope.username) {
    Activity.find(function (activities) {
      $scope.activityCurrent = activities[0];
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
      $scope.activityCurrent = $scope.activityItems[0];
      getActivityInfo({
        model: Activity,
        id: $scope.activityCurrent.id,
        actType: $scope.activityCurrent.actType
      }, $scope);
    });
  }
  //切换当前活动
  $scope.changeCurrentActivity = function () {
    $scope.activityCurrent = this.activityItem;
    var option = {
      model: Activity,
      id: $scope.activityCurrent.id,
      actType: $scope.activityCurrent.actType
    };
    getActivityInfo(option, $scope);
  };
}]);

function getActivityInfo (arg, scope) {
  if (arg.actType === 'common')
    return;
  arg.model['prototype_get_'+ arg.actType +'s']({
    id: arg.id
  }, function (res) {
    scope[arg.actType + 's'] = res[0];
    if (arg.actType === 'seckill') {
      scope.countDown = (new Date() - new Date(res[0].started))/1000;
    }
  });
}

app.controller('ActivityController', ['$scope', 'Activity', 'User', '$stateParams', '$interval',function($scope, Activity, User, $stateParams, $interval){
  if ($stateParams.id) {
    //获取当前活动信息
    Activity.findById({
      id: $stateParams.id
    }, function (res) {
      $scope.activityCurrent = res;
      getActivityInfo ({
        model: Activity,
        actType: res.actType,
        id: $stateParams.id
      }, $scope)
    });
  }
  $scope.onClickJoinActivity = function () {
    console.log($scope.activityCurrent)
    var actType = $scope.activityCurrent.actType;
    if (actType !== 'common') {
      $scope.result = new Array($scope[actType + 's']['_'+ actType +'Items'].length);
      $scope[actType + 's'] = $scope[actType + 's'];
    }
    if (actType === 'seckill') {
      var timer = $interval(function () {
        $scope.countDown --;
        if ($scope.countDown <= 0) {
          $interval.cancel(timer)
        }
      }, 1000);
    }
  };

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

