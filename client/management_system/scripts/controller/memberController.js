app.controller('MemberCtrl', ['$scope', 'Team', function ($scope, Team) {
  Team.prototype_get_members({
      id: localStorage.$LoopBack$currentTeamId
    },
    function (res) {
      $scope.members = res;
      memberChanged();
    },
    function () {
      alert("获取成员列表失败！")
    });

  function memberChanged(){
    $scope.memberLength = 0;
    $scope.members.forEach(function (member) {
      if (member.verified === true) {
        $scope.memberLength = $scope.memberLength + 1;
      }
    });
  }

  $scope.isShowMemberDetail = false;

  $scope.showMemberDetail = function () {
    $scope.isShowMemberDetail = !$scope.isShowMemberDetail;
  };

  $scope.agreeMemberIn = function (userId) {
    Team.prototype_updateById_members({
      id: localStorage.$LoopBack$currentTeamId,
      fk: userId
    }, {verified: true}, function () {
      Materialize.toast('已经同意申请', 2000);
      $scope.members.forEach(function (member) {
        if (member.id === userId) {
          member.verified = true;
        }
      });
      memberChanged();
    }, function () {
      Materialize.toast('操作失败！', 2000);
    });
  };

  $scope.refuseMemberIn = function (userId) {
    Team.prototype_destroyById_members({
      id: localStorage.$LoopBack$currentTeamId,
      fk: userId
    }, function () {
      Materialize.toast('已经拒绝申请', 2000);
      for (var x in $scope.members) if ($scope.members[x].id === userId) {
        $scope.members[x] = undefined;
      }
    }, function () {
      Materialize.toast('操作失败！', 2000);
    });
  };

  $scope.deleteMember = function () {
    var thisElement = this;
    Team.prototype_destroyById_members({
      id: localStorage.$LoopBack$currentTeamId,
      fk: thisElement.member.id
    }, function () {
      Materialize.toast('删除成功！', 2000);
      var id = thisElement.member.id;
      for (var x in $scope.members) if ($scope.members[x].id === id) {
        $scope.members.splice(x,1);
      }
      memberChanged();
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  }


}]);
