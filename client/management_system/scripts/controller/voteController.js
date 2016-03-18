app.controller('VoteListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.pageTitle = '投票列表';
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

app.controller('VoteEditCtrl',
  ['$scope', '$location', 'Team', '$rootScope', '$stateParams', 'uploadFile', 'appConfig',
    function ($scope, $location, Team, $rootScope, $stateParams, uploadFile, appConfig) {
      $scope.isEdit = false;
      if ($stateParams.id !== '') {
        $scope.isEdit = true;
        Team.prototype_findById_votes({
          id: localStorage.$LoopBack$currentTeamId,
          fk: $stateParams.id
        }, function (res) {
          $scope.uploadData = res;
          $scope.votes = res._voteItems;
        });
      } else {
        $scope.votes = [];
        $scope.uploadData = {
          teamId: localStorage.$LoopBack$currentTeamId
        };
      }
      $rootScope.pageTitle = $scope.isEdit?'编辑投票':'新建投票';

      $scope.addVote = function () {
        $scope.votes.push({
          name: ''
        });
      };

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
      $scope.uploadImg = function () {
        var vote = this.vote;
        var file = document.getElementById('vote_' + this.$index).files[0];
        if (!file) {
          return;
        }
        var fileExt = /\.[^\.]+/.exec(document.getElementById('vote_' + this.$index).value.toLowerCase());
        if (!((fileExt[0] === '.png') || (fileExt[0] === '.jpg') || (fileExt[0] === '.jpeg') || (fileExt[0] === '.gif'))) {
          alert('请确认您上传的logo文件格式是jpg、png、gif或jpeg');
          return false;
        }
        uploadFile.file(file, 'team', $scope.teamInfo.id)
          .success(function (res) {
            vote.imgUrl = appConfig.IMG_URL + res.url;
          });
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
        } else if (!($scope.uploadData.max || $scope.uploadData.limit)) {
          Materialize.toast('请填写投票票数限制！', 1000);
        } else {
          if ($scope.isEdit) {
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

app.controller('VoteResultCtrl', ['$scope', '$rootScope', '$stateParams', 'Vote', 'Team',
  function ($scope, $rootScope, $stateParams, Vote, Team) {
    Team.prototype_findById_votes({
      id: localStorage.$LoopBack$currentTeamId,
      fk: $stateParams.id
    }, function (res) {
      $rootScope.pageTitle = '[' + res.title + ']结果';
      $scope.vote = res;
      $scope.sum = 0;
      $scope.vote._voteItems = sort($scope.vote._voteItems);
      $scope.vote._voteItems.forEach(function (item) {
        $scope.sum += item.count;
        item.point = (item.count / $scope.vote._voteItems[$scope.vote._voteItems.length - 1].count) * 100;
      });
    });
    $scope.ASCActive = 'active';
    $scope.DESCActive = false;
    $scope.ASC = function () {
      $scope.DESCActive = false;
      $scope.ASCActive = 'active';
    };

    $scope.DESC = function () {
      $scope.DESCActive = 'active';
      $scope.ASCActive = false;
    }
  }]);
function sort(array) {
  var i = 0;
  var j = array.length - 1;
  var Sort = function (i, j) {

    // 结束条件
    if (i == j) {
      return
    }

    var key = array[i].count;
    var stepi = i;
    var stepj = j;
    while (j > i) {
      if (array[j].count >= key) {
        j--;
      } else {
        array[i].count = array[j].count;
        while (j > ++i) {
          if (array[i].count > key) {
            array[j].count = array[i].count;
            break;
          }
        }
      }
    }
    if (stepi == i) {
      Sort(++i, stepj);
      return;
    }
    array[i].count = key;
    Sort(stepi, i);
    Sort(j, stepj);
  };

  Sort(i, j);

  return array;
}
