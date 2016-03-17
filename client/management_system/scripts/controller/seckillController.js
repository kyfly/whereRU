app.controller('SeckillListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.logoHide = false;
  $scope.showType = 0;
  Team.prototype_get_seckills({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
      order: 'updated DESC'
    }
  }, function (res) {
    $scope.seckillItems = res;
    $scope.isActivity = function (index) {
      if ($scope.showType === 0) {
        return $scope.seckillItems[index].activityId
      } else {
        return !$scope.seckillItems[index].activityId
      }
    };
  }, function () {
    Materialize.toast('获取抢票列表失败！', 6000);
  });


  $scope.deleteSeckill = function () {
    var thisElement = this;
    Team.prototype_destroyById_seckills({
        id: localStorage.$LoopBack$currentTeamId,
        fk: thisElement.seckillItem.id
      }, function () {
        Materialize.toast('删除成功！', 2000);
        var id = thisElement.seckillItem.id;
        for (var x in $scope.seckillItems) if ($scope.seckillItems[x].id === id) {
          $scope.seckillItems.splice(x, 1);
        }
      },
      function () {
        Materialize.toast('删除失败！', 2000);
      });
  };

}]);

app.controller('SeckillEditCtrl', ['$scope', '$location', 'Team', '$rootScope', '$stateParams', function ($scope, $location, Team, $rootScope, $stateParams) {
  $rootScope.logoHide = true;
  $scope.isEdit = false;
  if ($stateParams.id !== '') {
    $scope.isEdit = true;
    Team.prototype_findById_seckills({
      id: localStorage.$LoopBack$currentTeamId,
      fk: $stateParams.id
    }, function (res) {
      console.log(res);
      $scope.uploadData = res;
      $scope.seckills = res._seckillItems;
    });
  } else {
    $scope.seckills = [];
    $scope.uploadData = {
      teamId: localStorage.$LoopBack$currentTeamId
    };
  }

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

  
  $scope.addSeckill = function () {
    $scope.seckills.push({
      name: ''
    });
  }
  ;

  $scope.removeSeckill = function (index) {
    $scope.seckills.splice(index, 1);
  };
  $scope.moveUpSeckill = function () {
    if (this.$index > 0) {
      $scope.seckills.splice(this.$index - 1, 0, $scope.seckills.splice(this.$index, 1)[0]);
    }
  };
  $scope.moveDownSeckill = function () {
    if (this.$index < $scope.seckills.length) {
      $scope.seckills.splice(this.$index + 1, 0, $scope.seckills.splice(this.$index, 1)[0]);
    }
  };
  $scope.appendContent = function () {
    $scope.seckills[this.$parent.$parent.$index].options.push('');
  };
  $scope.removeContent = function () {
    $scope.seckills[this.$parent.$parent.$parent.$index].options.splice(this.$index, 1);
  };

  
  $scope.uploadSeckill = function () {
    for (x in $scope.seckills) {
      $scope.seckills[x].id = parseInt(x);
    }
    $scope.uploadData.updated = new Date();
    $scope.uploadData._seckillItems = $scope.seckills;
    if ($scope.seckills.length === 0) {
      Materialize.toast('请至少添加一个抢票项！', 1000);
    } else if (!$scope.uploadData.title) {
      Materialize.toast('请填写抢票名称！', 1000);
    } else if (!$scope.uploadData.limit) {
      Materialize.toast('请填写每人可抢票数！', 1000);
    } else {
      if($scope.isEdit){
        Team.prototype_updateById_seckills({
          id: localStorage.$LoopBack$currentTeamId,
          fk:　$stateParams.id
        }, $scope.uploadData, function () {
          Materialize.toast('更新成功！请在抢票模板里查看', 2000);
          $location.path('/MS/seckill/list');
        }, function () {
          Materialize.toast('更新失败！', 2000);
        });
      } else {
        Team.prototype_create_seckills({
          id: localStorage.$LoopBack$currentTeamId
        }, $scope.uploadData, function () {
          Materialize.toast('创建成功！请在抢票模板里查看', 2000);
          $location.path('/MS/seckill/list');
        }, function () {
          Materialize.toast('创建失败！', 2000);
        });
      }
    }
  };
}]);


app.controller('SeckillResultCtrl', ['$scope', function ($scope) {

}]);
