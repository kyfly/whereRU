app.controller('SeckillListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.pageTitle = '抢票列表';
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

app.controller('SeckillEditCtrl', ['$scope', '$location', 'Team', '$rootScope', '$stateParams',
  function ($scope, $location, Team, $rootScope, $stateParams) {
    $scope.startTime = {};
    $scope.isEdit = false;
    if ($stateParams.id !== '') {
      $scope.isEdit = true;
      Team.prototype_findById_seckills({
        id: localStorage.$LoopBack$currentTeamId,
        fk: $stateParams.id
      }, function (res) {
        $scope.uploadData = res;
        $scope.seckills = res._seckillItems;
        var startInfo = new Date(res.started);
        $scope.startTime.date = startInfo;
        $scope.startTime.hour = startInfo.getHours();
        $scope.startTime.minute = startInfo.getMinutes();
      });
    } else {
      $scope.seckills = [];
      $scope.uploadData = {
        teamId: localStorage.$LoopBack$currentTeamId
      };
    }
    $rootScope.pageTitle = $scope.isEdit ? '编辑抢票' : '新建抢票';
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

    $scope.hourChange = function () {
      if ($scope.startTime.hour > 23) {
        $scope.startTime.hour = 23;
      } else if ($scope.startTime.hour < 0) {
        $scope.startTime.hour = 0;
      }
      $scope.startTime.hour = parseInt($scope.startTime.hour);
    };

    $scope.minuteChange = function () {
      if ($scope.startTime.minute > 59) {
        $scope.startTime.minute = 59;
      } else if ($scope.startTime.minute < 0) {
        $scope.startTime.minute = 0;
      }
      $scope.startTime.minute = parseInt($scope.startTime.minute);
    };


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
      var startTimeSet = new Date($scope.startTime.date);
      startTimeSet.setHours($scope.startTime.hour);
      startTimeSet.setMinutes($scope.startTime.minute);
      startTimeSet.setSeconds(0);
      $scope.uploadData.started = startTimeSet;
      $scope.uploadData._seckillItems = $scope.seckills;
      if ($scope.seckills.length === 0) {
        Materialize.toast('请至少添加一个抢票项！', 1000);
      } else if (!$scope.uploadData.title) {
        Materialize.toast('请填写抢票名称！', 1000);
      } else {
        if ($scope.isEdit) {
          Team.prototype_updateById_seckills({
            id: localStorage.$LoopBack$currentTeamId,
            fk: $stateParams.id
          }, $scope.uploadData, function () {
            Materialize.toast('更新成功！请在抢票模板里查看', 2000);
            $location.path('/MS/seckill/list');
          }, function (res) {
            Materialize.toast(res.data.error.message || '更新失败', 2000);
          });
        } else {
          Team.prototype_create_seckills({
            id: localStorage.$LoopBack$currentTeamId
          }, $scope.uploadData, function () {
            Materialize.toast('创建成功！请在抢票模板里查看', 2000);
            $location.path('/MS/seckill/list');
          }, function (res) {
            Materialize.toast(res.data.error.message || '创建失败', 2000);
          });
        }
      }
    };
  }]);

app.controller('SeckillResultCtrl',
  ['$scope', '$rootScope', '$stateParams', 'Seckill', 'Team',
    function ($scope, $rootScope, $stateParams, Seckill, Team) {
      Team.prototype_findById_seckills({
        id: localStorage.$LoopBack$currentTeamId,
        fk: $stateParams.id
      }, function (res) {
        $rootScope.pageTitle = '[' + res.title + ']结果';
        $scope.seckill = res;
        $scope.getNum = 0;
      });
      Seckill.prototype_get_seckillResults({
        id: $stateParams.id
      }, function (results) {
        $scope.results = results;
        $scope.getNum = 0;
        for (var i = 0; i < results.length; i++) {
          if (results[i].get === true)
            $scope.getNum++;
        }
      });
      var active = 'active';
      $scope.pageViewActive = active;
      $scope.pageView = function () {
        $scope.pageViewActive = active;
        $scope.allViewActive = false;
      };
      $scope.allViewActive = false;
      $scope.allView = function () {
        $scope.pageViewActive = false;
        $scope.allViewActive = active;
      };
      $scope.queryInput = function () {
        if (!$scope.query.verifyId) {
          $scope.query = undefined;
        }
      };
      $scope.invoice = function () {
        var that = this;
        Seckill.prototype_updateById_seckillResults({
          id: $stateParams.id,
          fk: this.resultItem.id
        }, {
          invoiced: true
        }, function (res) {
          that.resultItem.invoiced = true;
        });
      };
    }]);
