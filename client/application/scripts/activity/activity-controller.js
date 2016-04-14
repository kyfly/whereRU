app.controller('ActivitiesController', ['$scope', 'Activity', '$window', function ($scope, Activity, $window) {
  $scope.activityFilter = ['全部', '进行中', '未开始', '已结束'];
  $scope.choice = '全部';
  $window.pull = true;
  $scope.activityItems = [];
  $scope.filterBar = 'ng-hide';
  var page = 0;
  var status = 0;
  $scope.changeFilter = function () {
    $scope.choice = this.filter;
  };
  angular.element($window).bind('scroll', function (e) {
    var body = e.target.body;
    if (body.scrollHeight - body.clientHeight - body.scrollTop < 600 && $window.pull && !$scope.last) {
      $scope.getActivities();
      $window.pull = false;
    } else if (body.scrollHeight - body.clientHeight - body.scrollTop > 600) {
      $window.pull = true;
    }
  });
  $scope.$on('$destroy', function (event, data) {
    angular.element($window).unbind('scroll');
    $scope.activityItems = undefined;
  });
  $scope.formFilter = function () {
    $scope.query = {
      actType: 'form'
    };
    page = 0;
    $scope.last = false;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.typeHide = true;
    $scope.type = '表单';
  };
  $scope.voteFilter = function () {
    $scope.query = {
      actType: 'vote'
    };
    page = 0;
    $scope.last = false;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.typeHide = true;
    $scope.type = '投票';
  };
  $scope.seckillFilter = function () {
    $scope.query = {
      actType: 'seckill'
    };
    page = 0;
    $scope.last = false;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.typeHide = true;
    $scope.type = '抢票';
  };
  $scope.allTypeFilter = function () {
    $scope.query = undefined;
    status = 0;
    page = 0;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.typeHide = true;
    $scope.type = '类型';
  };
  $scope.allStatusFilter = function () {
    $scope.query = undefined;
    status = 0;
    page = 0;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.status = '状态';
    $scope.statusHide = true;
  };
  $scope.ingFilter = function () {
    $scope.query = {
      status: 'ing'
    };

    $scope.statusHide = true;
    status = 1;
    page = 0;
    $scope.last = false;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.status = '进行中';
  };
  $scope.nosFilter = function () {
    $scope.query = {
      status: 'nos'
    };
    $scope.statusHide = true;
    status = 2;
    page = 0;
    $scope.last = false;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.status = '未开始';
  };
  $scope.endFilter = function () {
    $scope.query = {
      status: 'end'
    };
    $scope.statusHide = true;
    status = -1;
    page = 0;
    $scope.last = false;
    $scope.activityItems = [];
    $scope.getActivities();
    $scope.status = '已结束';
  };
  $scope.titleFilter = function () {
    if (!this.filterTitle) {
      $scope.query = undefined;
    } else {
      $scope.query = {
        title: this.filterTitle
      };
    }
  };
  function getActivityStatus(activity) {
    var now = new Date();
    try {
      if (new Date(activity.ended) < now) {
        activity.status = 'end';
      } else if (new Date(activity.started) > now) {
        activity.status = 'nos';
      } else {
        activity.status = 'ing';
      }
    } catch (err) {

    }
    return activity;
  }

  $scope.getActivities = function () {
    if (!$scope.$currentUser) {
      $scope.$emit('auth:loginRequired');
      return;
    }
    var query = $scope.query || {};
    var actType = query.actType || 'all';
    Activity.getMySchoolActiveties({
      school: $scope.$currentUser.school,
      actType: actType,
      status: status,
      page: page,
      filter: {
        order: 'created DESC'
      }
    }, function (res) {
      for (x in res) if (x === 'activties') {
        page++;
        if (res[x].length < 16 || res[x].length === 0) {
          $scope.last = true;
        }
        res[x].forEach(function (activity) {
          $scope.activityItems.push(getActivityStatus(activity));
        });
      }
    });
  };
  if (!$scope.$currentUser) {
    Activity.find(function (activities) {
      $scope.activityItems = activities;
      $scope.activityItems.forEach(function (activity) {
        getActivityStatus(activity);
      });
    });
  } else {
    $scope.getActivities();
  }
}]);

app.directive("ngTap", function () {
  return function ($scope, $element, $attributes) {
    var tapped;
    tapped = false;
    $element.bind("click", function () {
      if (!tapped) {
        return $scope.$apply($attributes["ngTap"]);
      }
    });
    $element.bind("touchstart", function (event) {
      return tapped = true;
    });
    $element.bind("touchmove", function (event) {
      tapped = false;
      return event.stopImmediatePropagation();
    });
    return $element.bind("touchend", function () {
      if (tapped) {
        return $scope.$apply($attributes["ngTap"]);
      }
    });
  };
});

app.controller('ActivityController',
  ['$scope', 'Activity', 'User', '$stateParams', '$interval', 'uploadFile', '$location', 'Article', '$rootScope',
    function ($scope, Activity, User, $stateParams, $interval, uploadFile, $location, Article, $rootScope) {
      function formatTime(time) {
        var s = time % 60;
        var d = Math.floor(time / (3600 * 24));
        var h = Math.floor((time - d * 3600 * 24) / 3600);
        var m = Math.floor((time - d * 3600 * 24 - h * 3600) / 60);
        return {
          d: d,
          h: h,
          m: m,
          s: s
        };
      }

      var seckillTimer, timer;

      function autoLoadSeckill() {
        seckillTimer = $interval(function () {
          Activity.prototype_get_seckills({
            id: $stateParams.id
          }, function (res) {
            $scope.seckill = res[0];
          });
        }, 1000);
      }

      Activity.findById({
        id: $stateParams.id
      }, function (activity) {
        $scope.activity = activity;
        $scope.article = activity;
        Article.prototype_get_comments({
          id: activity.id,
          filter: {
            order: 'created DESC'
          }
        }, function (comments) {
          $scope.article.comments = comments;
          $scope.article.showCommentBox = true;
        });
        if (activity.actType === 'common')
          return;
        Activity['prototype_get_' + activity.actType + 's']({
          id: $stateParams.id
        }, function (res) {
          $scope[activity.actType] = res[0];
          if (activity.actType === 'seckill') {
            var countDown = Math.floor((new Date($scope.seckill.started) - new Date($scope.seckill.serverTime)) / 1000);
            var time = formatTime(countDown);
            $scope.countDown = countDown;
            $scope.seckillTime = time;
            timer = $interval(function () {
              countDown--;
              var s = countDown % 60;
              var d = Math.floor(countDown / (3600 * 24));
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
          }
        });
      });
      $scope.$on('$destroy', function () {
        $interval.cancel(timer);
        $interval.cancel(seckillTimer);
      });
      $scope.onClickJoinActivity = function () {
        var actType = $scope.activity.actType;
        $scope.activityEnded = false;
        if (!$scope.$currentUser) {
          $scope.$emit('auth:loginRequired');
        }
        if ($scope.$currentUser && $scope.activity.verifyRule === '学号') {
          $scope.activity.verifyId = $scope.$currentUser.studentId;
        } else if ($scope.$currentUser && $scope.activity.verifyRule === '手机') {
          $scope.activity.verifyId = $scope.$currentUser.phone;
        }
        if (actType !== 'common') {
          $scope.result = new Array($scope[actType]['_' + actType + 'Items'].length);
        }
        if (new Date() - new Date($scope.activity.ended) > 0) {
          $scope.activityEnded = true;
        }
      };


      $scope.checkedForVote = function () {
        var results = $scope.result.filter(function (item) {
          return item;
        });
        if ($scope.vote.max && results.length > $scope.vote.max) {
          this.result[this.$index] = undefined;
          Materialize.toast('只能选择' + $scope.vote.max + '项哦', 2000);
          return;
        }
        if (this.result[this.$index]) {
          this.voteIteam.count++;
        } else {
          this.voteIteam.count--;
        }
      };

      $scope.submitFormResult = function () {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        if ($scope.activity.verifyRule && !$scope.activity.verifyId) {
          Materialize.toast('请填写验证规则', 2000);
          return;
        }
        for (var x in $scope.form._formItems) if ($scope.form._formItems[x].type === 'select') {
          $scope.result[x].type = 'selelct';
          $scope.result[x].name = $scope.result[x].option;
          $scope.result[x].option = undefined;
        } else {
          $scope.result[x].type = $scope.form._formItems[x].type;
        }
        var formResult = {
          'verifyId': $scope.activity.verifyId,
          'formId': $scope.form.id,
          'created': new Date(),
          'result': $scope.result
        };
        User.prototype_create_formResults({
          id: $scope.$currentUser.id
        }, formResult, function (res) {
          if (res.status === 1000 || res.status === 1100)
            Materialize.toast(res.message, 2000);
          else {
            Materialize.toast('参与成功,可在个人主页查看结果', 4000);
          }

        });
      };
      $scope.uploadFile = function () {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        var that = this.$parent;
        $scope.result[that['$index']] = {};
        var file = document.getElementById('file').files[0];
        if (!file) {
          return;
        }
        var fileName = $scope.tem;

        uploadFile.file(file, 'user', $scope.$currentUser.id)
          .success(function (res) {
            $scope.result[that['$index']].name = fileName;
            $scope.result[that['$index']].url = res.url;
          });
      };
      $scope.submitVoteResult = function () {
        var result = [];
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        if ($scope.activity.verifyRule && !$scope.activity.verifyId) {
          Materialize.toast('请填写验证规则', 2000);
          return;
        }
        for (var x in $scope.result) if ($scope.result[x]) {
          result.push($scope.vote._voteItems[x].id);
        }
        if ($scope.vote.limit && result.length < $scope.vote.limit) {
          Materialize.toast('必须选择' + $scope.vote.limit + '项哦', 2000);
          return;
        }
        if ($scope.vote.max && result.length > $scope.vote.max) {
          Materialize.toast('只能选择' + $scope.vote.max + '项哦', 2000);
          return;
        } else if (result.length <= 0) {
          Materialize.toast('至少选择一项哦', 2000);
          return;
        }
        var voteResult = {
          'verifyId': $scope.activity.verifyId,
          'voteId': $scope.vote.id,
          'created': new Date(),
          'result': result
        };
        User.prototype_create_voteResults({
          id: $scope.$currentUser.id
        }, voteResult, function (res) {
          if (res.status === 1000) {
            Materialize.toast(res.message, 2000);
          }
          else
            Materialize.toast('参与成功,可在个人主页查看结果', 4000);
        });
      };

      $scope.submitSeckillResult = function () {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        if ($scope.activity.verifyRule && !$scope.activity.verifyId) {
          Materialize.toast('请填写验证规则', 800);
          return;
        }
        var seckillResult = {
          "created": new Date(),
          "verifyId": $scope.activity.verifyId,
          "itemId": this.seckillItem.id,
          "seckillId": $scope.seckill.id
        };
        $scope.activityEnded = true;
        User.prototype_create_seckillResults({
          id: $scope.$currentUser.id
        }, seckillResult, function (res) {
          if (res.status === 1000 || res.status === 1100) {
            Materialize.toast(res.message, 500);
            $scope.activityEnded = true;
          } else {
            Materialize.toast('参与成功,可在个人主页查看结果', 4000);
            autoLoadSeckill();
          }
        });
      };
    }]);

