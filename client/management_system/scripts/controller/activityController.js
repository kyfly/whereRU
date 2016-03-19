app.controller('ActivityListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.pageTitle = '活动列表';
  $scope.chosenType = '';

  $scope.unFormat = "yyyy-MM-dd HH:mm";
  $scope.format = "yyyy-MM-dd";

  Team.prototype_get_activities({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
      where: {
        deleted: false
      },
      order: 'created DESC'
    }
  }, function (res) {
    $scope.activityItems = res;
  }, function () {
    Materialize.toast('获取活动列表失败！', 6000);
  });

  $scope.deleteActivity = function () {
    var thisElement = this;
    Team.prototype_updateById_activities({
      id: localStorage.$LoopBack$currentTeamId,
      fk: thisElement.activityItem.id
    }, {deleted: true}, function () {
      Materialize.toast('删除成功！', 2000);
      var id = thisElement.activityItem.id;
      for (var x in $scope.activityItems)
        if ($scope.activityItems[x].id === id) {
          $scope.activityItems.splice(x, 1);
        }
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };

}]);

app.controller('ActivityEditCtrl',
  ['$scope', 'Team', 'Ueditor', '$location', '$http', 'Activity', '$stateParams', 'uploadFile', '$timeout', '$rootScope',
    function ($scope, Team, Ueditor, $location, $http, Activity, $stateParams, uploadFile, $timeout, $rootScope) {
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
      $scope.activityEditorConfig = Ueditor.config;
      $scope.activityData = {
        authorName: $scope.teamInfo.name,     //$scope.teamInfo在homeController里面获取
        authorId: $scope.teamInfo.id,
        type: $scope.teamInfo.type,
        school: $scope.teamInfo.school,
        created: new Date()
      };
      $scope.startTime = {};
      $scope.endTime = {};
      var tabSelect = ['mainInfo', 'copywriter', 'complete'];
      $scope.isEdit = $stateParams.id || false;
      $rootScope.pageTitle = $scope.isEdit ? '编辑活动' : '新建活动';
      $scope.picNotice = $scope.isEdit ? "如果要更换图片请上传,建议900*500像素" : "请上传活动封面,建议900*500像素";
      $scope.preType = {};
      if ($stateParams.id) {
        Activity.findById({
          id: $stateParams.id
        }, function (activity) {
          $scope.activityData = activity;
          var startInfo = new Date(activity.started);
          var endInfo = new Date(activity.ended);
          $scope.startTime.date = startInfo;
          $scope.startTime.hour = startInfo.getHours();
          $scope.startTime.minute = startInfo.getMinutes();
          $scope.endTime.date = endInfo;
          $scope.endTime.hour = endInfo.getHours();
          $scope.endTime.minute = endInfo.getMinutes();
          if ($stateParams.id) {
            $http.get($scope.activityData.explainUrl)
              .success(function (contentHtml) {
                $scope.activityEditorContent = contentHtml;
              });
          }
          if (activity.actType !== 'common') {
            $scope.preType.type = activity.actType;

            Activity['prototype_get_' + activity.actType + 's']({
              id: $stateParams.id
            }, function (res) {
              if (res[0]) {
                $scope[activity.actType + 'Data'] = res[0];
                $scope.preType.id = res[0].id;
              }
            });
          }
        });
      }

      $scope.hourChange = function (type) {
        if (type === 0) {
          if ($scope.startTime.hour > 23) {
            $scope.startTime.hour = 23;
          } else if ($scope.startTime.hour < 0) {
            $scope.startTime.hour = 0;
          }
          $scope.startTime.hour = parseInt($scope.startTime.hour);
        } else {
          if ($scope.endTime.hour > 23) {
            $scope.endTime.hour = 23;
          } else if ($scope.endTime.hour < 0) {
            $scope.endTime.hour = 0;
          }
          $scope.endTime.hour = parseInt($scope.endTime.hour);
        }
      };

      $scope.minuteChange = function (type) {
        if (type === 0) {
          if ($scope.startTime.minute > 59) {
            $scope.startTime.minute = 59;
          } else if ($scope.startTime.minute < 0) {
            $scope.startTime.minute = 0;
          }
          $scope.startTime.minute = parseInt($scope.startTime.minute);
        } else {
          if ($scope.endTime.minute > 59) {
            $scope.endTime.minute = 59;
          } else if ($scope.endTime.minute < 0) {
            $scope.endTime.minute = 0;
          }
          $scope.endTime.minute = parseInt($scope.endTime.minute);
        }
      };

      $scope.nextStep = function (step) {
        $('#editActivityTabs').tabs('select_tab', tabSelect[step]);
      };

      $scope.activityImgLoad = function () {
        var file = document.getElementById('activityImg').files[0];
        var Xhr = new XMLHttpRequest();
        var fileExt = /\.[^\.]+/.exec(document.getElementById('activityImg').value.toLowerCase());
        if (!((fileExt[0] === '.png') || (fileExt[0] === '.jpg') || (fileExt[0] === '.jpeg') || (fileExt[0] === '.gif'))) {
          alert('请确认您上传的logo文件格式是jpg、png、gif或jpeg');
          return false;
        }
        uploadFile.file(file, 'team', $scope.teamInfo.id)
          .success(function (res) {
            $scope.activityData.imgUrl = res.url;
          });
      };

      $scope.getActivityList = function (type) {
        Team['prototype_get_' + type + 's']({
          id: $scope.teamInfo.id
        }, function (res) {
          $scope[type + 'Items'] = res.filter(function (item) {
            return !(item.activityId || item.noticeId);
          });
        });
      };

      $scope.addFormFunc = function () {
        $scope.formData = this.formItem;
        $('#addForm').closeModal();
      };

      $scope.addVoteFunc = function () {
        $scope.voteData = this.voteItem;
        $('#addVote').closeModal();
      };

      $scope.addSeckillFunc = function () {
        $scope.seckillData = this.seckillItem;
        $('#addSeckill').closeModal();
      };

      $scope.removeFormData = function () {
        $scope.formData = undefined;
      };

      $scope.removeVoteData = function () {
        $scope.voteData = undefined;
      };

      $scope.removeSeckillData = function () {
        $scope.seckillData = undefined;
      };

      $scope.createActivity = function () {
        var startTimeSet = new Date($scope.startTime.date);
        startTimeSet.setHours($scope.startTime.hour);
        startTimeSet.setMinutes($scope.startTime.minute);
        startTimeSet.setSeconds(0);
        $scope.activityData.started = startTimeSet;
        var endTimeSet = new Date($scope.endTime.date);
        endTimeSet.setHours($scope.endTime.hour);
        endTimeSet.setMinutes($scope.endTime.minute);
        endTimeSet.setSeconds(0);
        $scope.activityData.ended = endTimeSet;
        uploadFile.text($scope.activityEditorContent, 'team', $scope.teamInfo.id)
          .success(function (res) {
            $scope.activityData.explainUrl = res.url;
            $scope.activityData.team = undefined;
            if ($scope.formData) {
              $scope.activityData.actType = 'form'
            } else if ($scope.voteData) {
              $scope.activityData.actType = 'vote'
            } else if ($scope.seckillData) {
              $scope.activityData.actType = 'seckill'
            } else {
              $scope.activityData.actType = 'common'
            }
            if ($stateParams.id) {
              Team.prototype_updateById_activities({
                id: localStorage.$LoopBack$currentTeamId,
                fk: $stateParams.id
              }, $scope.activityData, function (res) {
                Materialize.toast('更新成功！', 2000);

                if ($scope.formData) {
                  $scope.formData.updated = new Date();
                  $scope.formData.id = undefined;
                  $scope.formData.activityId = $stateParams.id;
                  $scope.formData.teamId = localStorage.$LoopBack$currentTeamId;

                  if ($scope.preType.type === 'form') {
                    Activity.prototype_updateById_forms({
                      id: res.id,
                      fk: $scope.preType.id
                    }, $scope.formData)
                  } else {
                    Activity.prototype_create_forms({
                      id: res.id
                    }, $scope.formData)
                  }
                } else {
                  if ($scope.preType.type === 'form') {
                    Activity.prototype_delete_forms({
                      id: res.id
                    });
                  }
                }

                if ($scope.voteData) {
                  $scope.voteData.updated = new Date();
                  $scope.voteData.id = undefined;
                  $scope.voteData.activityId = $stateParams.id;
                  $scope.voteData.teamId = localStorage.$LoopBack$currentTeamId;

                  if ($scope.preType.type === 'vote') {
                    Activity.prototype_updateById_votes({
                      id: res.id,
                      fk: $scope.preType.id
                    }, $scope.voteData)
                  } else {
                    Activity.prototype_create_votes({
                      id: res.id
                    }, $scope.voteData)
                  }
                } else {
                  if ($scope.preType.type === 'vote') {
                    Activity.prototype_delete_votes({
                      id: res.id
                    })
                  }
                }

                if ($scope.seckillData) {
                  $scope.seckillData.updated = new Date();
                  $scope.seckillData.id = undefined;
                  $scope.seckillData.activityId = $stateParams.id;
                  $scope.seckillData.teamId = localStorage.$LoopBack$currentTeamId;


                  if ($scope.preType.type === 'seckill') {
                    Activity.prototype_updateById_seckills({
                      id: res.id,
                      fk: $scope.preType.id
                    }, $scope.seckillData)
                  } else {
                    Activity.prototype_create_seckills({
                      id: res.id
                    }, $scope.seckillData)
                  }
                } else {
                  if ($scope.preType.type === 'seckill') {
                    Activity.prototype_delete_seckills({
                      id: res.id
                    })
                  }
                }

                $location.path('/MS/activity/list');
              }, function () {
                Materialize.toast('更新失败！', 2000);
              });
            } else {
              Team.prototype_create_activities({
                id: localStorage.$LoopBack$currentTeamId
              }, $scope.activityData, function (res) {
                Materialize.toast('创建成功！', 2000);
                if ($scope.formData) {
                  $scope.formData.updated = new Date();
                  $scope.formData.activityId = res.id;
                  $scope.formData.id = undefined;
                  $scope.formData.teamId = localStorage.$LoopBack$currentTeamId;
                  Activity.prototype_create_forms({
                    id: res.id
                  }, $scope.formData)
                } else if ($scope.voteData) {
                  $scope.voteData.updated = new Date();
                  $scope.voteData.activityId = res.id;
                  $scope.voteData.id = undefined;
                  $scope.voteData.teamId = localStorage.$LoopBack$currentTeamId;
                  Activity.prototype_create_votes({
                    id: res.id
                  }, $scope.voteData)
                } else if ($scope.seckillData) {
                  $scope.seckillData.updated = new Date();
                  $scope.seckillData.activityId = res.id;
                  $scope.seckillData.id = undefined;
                  $scope.seckillData.teamId = localStorage.$LoopBack$currentTeamId;
                  Activity.prototype_create_seckills({
                    id: res.id
                  }, $scope.seckillData)
                }
                $location.path('/MS/activity/list');
              }, function () {
                Materialize.toast('创建失败！请不要漏填信息哦！', 2000);
              });
            }
          }).error(function () {
          Materialize.toast('别忘了写活动文案哦！', 2000);
        });
      };
    }]);
