app.controller('ActivityListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.logoHide = false;
  $scope.chosenType = 'all';

  $scope.unFormat = "yyyy-MM-dd HH:mm";
  $scope.format = "yyyy-MM-dd";

  Team.prototype_get_activities({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
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
        for (var x in $scope.activityItems) if ($scope.activityItems[x].id === id) {
          $scope.activityItems.splice(x, 1);
        }
      }
      ,
      function () {
        Materialize.toast('删除失败！', 2000);
      }
    )
    ;
  }

}]);

app.controller('ActivityEditCtrl', ['$scope', 'Team', 'Ueditor', '$location', '$http', '$rootScope', 'Form', 'Activity', '$stateParams', function ($scope, Team, Ueditor, $location, $http, $rootScope, Form, Activity, $stateParams) {
  $scope.isEdit = false;
  $scope.preType = {};
  if ($stateParams.id !== '') {
    $scope.isEdit = true;

    Activity.findById({
      id: $stateParams.id
    }, function (res) {
      $http.get(res.explainUrl)
        .success(function (contentHtml) {
          $scope.activityEditorContent = contentHtml;
          $scope.activityData = res;
        });
      if (res.actType === 'form') {
        $scope.preType = {
          type: 'form'
        };

        Activity.prototype_get_forms({
          id: $stateParams.id
        }, function (res) {
          console.log(res);
          if(res[0]){
            $scope.formData = res[0];
            $scope.preType.id = res[0].id;
          }
        });
      }
    });

  }
  $scope.activityData = {
    authorName: $rootScope.teamInfo.name,     //$scope.teamInfo在homeController里面获取
    authorId: $scope.teamInfo.id,
    type: $scope.teamInfo.type,
    school: $scope.teamInfo.school,
    created: new Date()
  };
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

  var tabSelect = ['mainInfo', 'copywriter', 'complete'];
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
    var readyHandle = function () {
      if (Xhr.readyState === 4) {
        if (Xhr.status === 200) {
          $scope.activityData.imgUrl = 'http://cdn-img.etuan.org/' + JSON.parse(Xhr.responseText).url + '@4e_0o_0l_200h_360w_90q.src';
        }
      }
    };
    var Fd = new FormData();
    Fd.append('img', file);
    Xhr.onreadystatechange = readyHandle;
    Xhr.open('POST', '/ue/uploads?dir=team&id=' + localStorage.$LoopBack$currentTeamId + '&action=uploadimage', true);
    Xhr.send(Fd);
  };

  $scope.activityEditorConfig = Ueditor.config;

  $scope.getFormList = function () {
    Team.prototype_get_forms({
      id: localStorage.$LoopBack$currentTeamId
    }, function (res) {
      $scope.formItems = res;
      $scope.isActivity = function (index) {
        return !$scope.formItems[index].activityId
      };
    }, function () {
      Materialize.toast('获取活动列表失败！', 6000);
    });

    $scope.isFormAuthor = function (index) {
      return $scope.formItems[index].teamId === localStorage.$LoopBack$currentTeamId;
    };
  };

  $scope.addFormFunc = function () {
    var thisElement = this;
    $scope.formData = thisElement.formItem;
    $('#addForm').closeModal();
  };

  $scope.removeFormData = function () {
    $scope.formData = undefined;
  };

  $scope.createActivity = function () {
    if ($scope.isEdit) {
      $http({
        url: '/ue/uploads?dir=team&id=' + localStorage.$LoopBack$currentTeamId + '&action=uploadtext',
        method: "post",
        data: {
          'content': $scope.activityEditorContent
        }
      }).success(function (res) {
        $scope.activityData.explainUrl = 'http://oss.etuan.org/' + res.url;
        if ($scope.formData) {
          $scope.activityData.actType = 'form'
        } else if ($scope.voteData) {
          $scope.activityData.actType = 'vote'
        } else if ($scope.seckillData) {
          $scope.activityData.actType = 'seckill'
        } else {
          $scope.activityData.actType = 'common'
        }

        Team.prototype_updateById_activities({
          id: localStorage.$LoopBack$currentTeamId,
          fk: $stateParams.id
        }, $scope.activityData, function (res) {
          Materialize.toast('更新成功！', 2000);

          if ($scope.formData) {
            $scope.formData.updated = new Date();
            $scope.formData.activityId = res.id;
            $scope.formData.id = undefined;
            $scope.formData.activityId = $stateParams.id;

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
              })
            }
          }

          $location.path('/MS/activity/list');
        }, function () {
          Materialize.toast('更新失败！', 2000);
        });

      });
    } else {
      $http({
        url: '/ue/uploads?dir=team&id=' + localStorage.$LoopBack$currentTeamId + '&action=uploadtext',
        method: "post",
        data: {
          'content': $scope.activityEditorContent
        }
      }).success(function (res) {
        $scope.activityData.explainUrl = 'http://oss.etuan.org/' + res.url;
        if ($scope.formData) {
          $scope.activityData.actType = 'form'
        } else if ($scope.voteData) {
          $scope.activityData.actType = 'vote'
        } else if ($scope.seckillData) {
          $scope.activityData.actType = 'seckill'
        } else {
          $scope.activityData.actType = 'common'
        }

        Team.prototype_create_activities({
          id: localStorage.$LoopBack$currentTeamId
        }, $scope.activityData, function (res) {
          Materialize.toast('创建成功！', 2000);
          if ($scope.formData) {
            $scope.formData.updated = new Date();
            $scope.formData.activityId = res.id;
            $scope.formData.id = undefined;
            $scope.formData.activityId = localStorage.$LoopBack$currentTeamId;
            Activity.prototype_create_forms({
              id: res.id
            }, $scope.formData)
          }

          $location.path('/MS/activity/list');
        }, function () {
          Materialize.toast('创建失败！', 2000);
        });

      });
    }
  };

}]);
