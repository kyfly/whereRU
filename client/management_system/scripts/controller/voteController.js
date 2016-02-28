app.controller('VoteListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.logoHide = false;
  $scope.showType = 0;
  Team.prototype_get_votes({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
      order: 'updated DESC'
    }
  }, function (res) {
    $scope.voteItems = res;
    $scope.isActivity = function (index) {
      if ($scope.showType === 0) {
        return $scope.voteItems[index].activityId
      } else {
        return !$scope.voteItems[index].activityId
      }
    };
  }, function () {
    Materialize.toast('获取投票列表失败！', 6000);
  });


  $scope.deleteVote = function () {
    var thisElement = this;
    Team.prototype_destroyById_votes({
        id: localStorage.$LoopBack$currentTeamId,
        fk: thisElement.voteItem.id
      }, function () {
        Materialize.toast('删除成功！', 2000);
        var id = thisElement.voteItem.id;
        for (var x in $scope.voteItems) if ($scope.voteItems[x].id === id) {
          $scope.voteItems.splice(x, 1);
        }
      },
      function () {
        Materialize.toast('删除失败！', 2000);
      });
  };

}]);

app.controller('VoteEditCtrl', ['$scope', '$location', 'Team', '$rootScope', '$stateParams', function ($scope, $location, Team, $rootScope, $stateParams) {
  $rootScope.logoHide = true;
  $scope.isEdit = false;
  if ($stateParams.id !== '') {
    $scope.isEdit = true;
    Team.prototype_findById_votes({
      id: localStorage.$LoopBack$currentTeamId,
      fk: $stateParams.id
    }, function (res) {
      console.log(res);
      $scope.uploadData.title = res.title;
      $scope.uploadData.max = res.max;
      $scope.uploadData.limit = res.limit;
      $scope.uploadData.cycle = res.cycle;
      $scope.votes = res._voteItems;
    });
  }

  $scope.votes = [];
  $scope.addVote = function () {
    $scope.votes.push({
      name: ''
    });
  }
  ;

  $scope.removeVote = function (index) {
    $scope.votes.splice(index, 1);
  };
  $scope.moveUpVote = function () {
    if (this.$index > 0) {
      $scope.votes.splice(this.$index - 1, 0, $scope.votes.splice(this.$index, 1)[0]);
    }
  };
  $scope.moveDownVote = function () {
    if (this.$index < $scope.votes.length) {
      $scope.votes.splice(this.$index + 1, 0, $scope.votes.splice(this.$index, 1)[0]);
    }
  };
  $scope.appendContent = function () {
    $scope.votes[this.$parent.$parent.$index].options.push('');
  };
  $scope.removeContent = function () {
    $scope.votes[this.$parent.$parent.$parent.$index].options.splice(this.$index, 1);
  };

  $scope.uploadData = {
    teamId: localStorage.$LoopBack$currentTeamId
  };
  $scope.uploadVote = function () {
    for (x in $scope.votes) {
      $scope.votes[x].id = parseInt(x);
    }
    $scope.uploadData.updated = new Date();
    $scope.uploadData._voteItems = $scope.votes;
    if ($scope.votes.length === 0) {
      Materialize.toast('请至少添加一个投票项！', 1000);
    } else if (!$scope.uploadData.title) {
      Materialize.toast('请填写投票名称！', 1000);
    }else if (!($scope.uploadData.max || $scope.uploadData.limit)) {
      Materialize.toast('请填写投票票数限制！', 1000);
    } else {
      if($scope.isEdit){
        Team.prototype_updateById_votes({
          id: localStorage.$LoopBack$currentTeamId,
          fk: $stateParams.id
        }, $scope.uploadData, function () {
          Materialize.toast('修改成功！请在投票模板里查看', 2000);
          $location.path('/MS/vote/list');
        }, function () {
          Materialize.toast('修改失败！', 2000);
        });
      } else {
        Team.prototype_create_votes({
          id: localStorage.$LoopBack$currentTeamId
        }, $scope.uploadData, function () {
          Materialize.toast('创建成功！请在投票模板里查看', 2000);
          $location.path('/MS/vote/list');
        }, function () {
          Materialize.toast('创建失败！', 2000);
        });
      }
    }

  };


}]);


app.controller('VoteResultCtrl', ['$scope', function ($scope) {

}]);
