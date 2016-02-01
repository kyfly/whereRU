app.controller('EventCtrl', ['$scope', 'Team', function ($scope, Team) {
  //获取竞赛列表
  Team.prototype_get_races({
    id: localStorage.$LoopBack$currentTeamId
  }, function (res) {
    if (res.length === 0) {
      $scope.noEvent = true;
    }
    console.log(res, '竞赛');
    $scope.contestLists = res;
  });
  $scope.noEvent = false;
  //ContestOrg.contests({
  //  id: localInfo.userId,
  //  access_token: localInfo.id
  //}, function (res) {
  //  if (res.length === 0) {
  //    $scope.noEvent = true;
  //  }
  //  console.log(res, '竞赛');
  //  $scope.contestLists = res;
  //
  //  $scope.deleteContest = function (index) {
  //    ContestOrg.contests.destroyById({
  //      id: localInfo.userId,
  //      fk: res[index].id,
  //      access_token: localInfo.id
  //    }, function () {
  //      history.go(0);
  //    })
  //  };
  //
  //  //更新竞赛信息
  //  $scope.changeEvent = res;
  //  $scope.updateExplainDoc = function (index) {
  //    var e = document.getElementById('changeExplainDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      console.log(data);
  //      $scope.changeEvent[index].explainUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.updateProcessDoc = function (index) {
  //    var e = document.getElementById('changeProcessDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      $scope.changeEvent[index].processUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.updateRuleDoc = function (index) {
  //    var e = document.getElementById('changeRuleDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      $scope.changeEvent[index].ruleUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.updateEvent = function (index) {
  //    ContestOrg.contests.updateById({
  //      id: localInfo.userId,
  //      fk: res[index].id,
  //      access_token: localInfo.id
  //    }, $scope.changeEvent[index], function () {
  //      Materialize.toast('更新成功！', 2000)
  //    }, function () {
  //      Materialize.toast('更新失败！', 2000)
  //    })
  //  };
  //
  //  $scope.material = {};
  //
  //  $scope.materialLoad = function (index) {
  //    var e = document.getElementById('addMaterialDoc' + index).files;
  //    uploadFile(e, function (data) {
  //      $scope.material.name = data[0].original;
  //      $scope.material.dataUrl = data[0].url;
  //      $scope.$apply();
  //    });
  //  };
  //
  //  $scope.creatMaterial = function (index) {
  //    $scope.material.loader = localInfo.name;
  //    $scope.material.createAt = new Date();
  //    if ($scope.material.dataUrl) {
  //      Contest.materials.create({
  //          id: res[index].id,
  //          access_token: localInfo.id
  //        }, $scope.material, function () {
  //          Materialize.toast('上传成功！', 2000)
  //        }, function () {
  //          Materialize.toast('上传失败！', 2000)
  //        }
  //      )
  //    } else {
  //      Materialize.toast('请先选择文件！', 2000)
  //    }
  //  };
  //
  //  $scope.loadContest = function (index) {
  //    Contest.materials({
  //      id: res[index].id,
  //      access_token: localInfo.id,
  //      filter: {
  //        order: 'createAt DESC'
  //      }
  //    }, function (res) {
  //      $scope.materialList = res;
  //    });
  //  };
  //
  //
  //});

  //新建竞赛
  $scope.contest = {};

  $scope.explainDocLoad = function () {
    var e = document.getElementById('explainDoc').files;
    uploadFile(e, function (res) {
      $scope.contest.explainUrl = res[0].url;
      $scope.$apply();
    });
  };

  $scope.processDocLoad = function () {
    var e = document.getElementById('processDoc').files;
    uploadFile(e, function (res) {
      $scope.contest.processUrl = res[0].url;
      $scope.$apply();
    });
  };

  $scope.ruleDocLoad = function () {
    var e = document.getElementById('ruleDoc').files;
    uploadFile(e, function (res) {
      $scope.contest.ruleUrl = res[0].url;
      $scope.$apply();
    });
  };

  //上传文件
  function uploadFile(files, callback) {
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      file = files[i];
      formData.append(file.name, file);
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      }
    };
    xhr.open("POST", "/ue/uploads?action=uploadfile&dynamicPath=contest&files=" + files.length, true);
    xhr.send(formData);
  }

  $scope.addContest = function () {
    if (!($scope.contest.name && $scope.contest.ruleUrl && $scope.contest.processUrl && $scope.contest.explainUrl)) {
      Materialize.toast('请填写完整哦！', 2000);
    } else {
      ContestOrg.contests.create({
        id: localInfo.userId,
        access_token: localInfo.id
      }, $scope.contest, function () {
        history.go(0);
      }, function () {
        Materialize.toast('创建失败！', 2000);
      });
    }
  };

  //参赛队伍，通知管理，资料库，竞赛设置的切换
  $scope.contentType = 0;

  $scope.contentTypeChange = function (contentType) {
    $scope.contentType = contentType;
  };

  //通知管理
  $scope.newNotice = {};
  $scope.uploadAttachment = false;
  $scope.addGetInfo = false;

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
  $scope.deadline = {};
}]);