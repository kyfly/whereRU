app.controller('MemberCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.pageTitle = '成员管理';
  Team.prototype_get_members({
      id: $scope.teamInfo.id
    },
    function (res) {
      $scope.members = res;
      memberChanged();
    },
    function () {
      Materialize.toast('获取成员列表失败！', 6000);
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

  $scope.agreeMemberIn = function (memberId) {
    var member = this.member;
    Team.prototype_updateById_members({
      id: $scope.teamInfo.id,
      fk: memberId
    }, {
      verified: true
    }, function () {
      Materialize.toast('已经同意申请', 2000);
      member.verified = true;
    }, function () {
      Materialize.toast('操作失败！', 2000);
    });
  };

  $scope.refuseMemberIn = function (memberId) {
    var that = this;
    Team.prototype_destroyById_members({
      id: $scope.teamInfo.id,
      fk: memberId
    }, function () {
      Materialize.toast('已经拒绝申请', 2000);
      delete that.member;
    }, function () {
      Materialize.toast('操作失败！', 2000);
    });
  };

  $scope.deleteMember = function () {
    var that = this;
    Team.prototype_destroyById_members({
      id: $scope.teamInfo.id,
      fk: this.member.id
    }, function () {
      Materialize.toast('删除成功！', 2000);
      delete that.members[that.$index];
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };

}]);
