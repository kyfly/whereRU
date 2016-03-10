app.controller('EventListCtrl', 
  ['$scope', 'Team', '$rootScope', 'Race', 
  function ($scope, Team, $rootScope, Race) {
  $rootScope.logoHide = false;
  $scope.unFormat = "yyyy-MM-dd HH:mm";
  $scope.format = "yyyy-MM-dd";

  Team.prototype_get_races({
    id: $scope.teamInfo.id,
    filter: {
      where: {
        deleted: false
      },
      order: 'created DESC'
    }
  }, function (res) {
    $scope.eventItems = res;
  }, function () {
    Materialize.toast('获取创建竞赛列表失败！', 6000);
  });

  Team.prototype_get_partakedRaces({
    id: $scope.teamInfo.id,
    filter: {
      order: 'created DESC'
    }
  }, function (res) {
    $scope.partakedEventItems = res;
  }, function () {
    Materialize.toast('获取参与竞赛列表失败！', 2000);
  });
  var oneMonthAfter = new Date() + 30*24*3600;
  Race.find({
    filter: {
      where: {
        or:[{
          started: {gt: oneMonthAfter}
        }, {
          ended: {lt: new Date()}
        }],
        school: $scope.teamInfo.school
      }
    }
  }, function (res) {
    $scope.recommendRaces = res;
  });
  $scope.deleteEvent = function () {
    var thisElement = this;

    Team.prototype_updateById_races({
      id: $scope.teamInfo.id,
      fk: thisElement.eventItem.id
    }, {
      deleted: true,
      updated: new Date()
    }, function () {
      Materialize.toast('删除成功！', 2000);
      delete thisElement.eventItem;
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };

  $scope.quitEvent = function () {
    var thisElement = this;

    Team.prototype_unlink_partakedRaces({
      id: localStorage.$LoopBack$currentTeamId,
      fk: thisElement.partakedEventItem.id
    }, function () {
      Materialize.toast('删除成功！', 2000);
      delete thisElement.partakedEventItem;
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };
  $scope.joinRace = function () {
    Team.prototype_link_partakedRaces({
      id: $scope.teamInfo.id,
      fk: this.race.id
    }, {},function (status) {
      Materialize.toast('参与成功,刷新后可在参与列表查看', 2000);
    });
  }
}]);

app.controller('EventEditCtrl', 
  ['$scope', 'Team', 'Ueditor', '$http', '$location', 'appConfig', 'uploadFile',
  function ($scope, Team, Ueditor, $http, $location, appConfig, uploadFile) {
  $scope.eventData = {
    authorName: $scope.teamInfo.name,     //$scope.teamInfo在homeController里面获取
    authorId: $scope.teamInfo.id,
    school: $scope.teamInfo.school
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
    $('#editEventTabs').tabs('select_tab', tabSelect[step]);
  };

  $scope.eventImgLoad = function () {
    var file = document.getElementById('eventImg').files[0];
    var fileExt = /\.[^\.]+/.exec(document.getElementById('eventImg').value.toLowerCase());
    if (!((fileExt[0] === '.png') || (fileExt[0] === '.jpg') || (fileExt[0] === '.jpeg') || (fileExt[0] === '.gif'))) {
      alert('请确认您上传的logo文件格式是jpg、png、gif或jpeg');
      return false;
    }
    uploadFile.file(file, 'team', $scope.teamInfo.id)
    .success(function(res) {
      $scope.eventData.imgUrl = appConfig.IMG_URL + res.url;
    });
  };

  $scope.eventEditorConfig = Ueditor.config;

  $scope.createEvent = function () {
    uploadFile.text($scope.eventEditorContent, 'team', $scope.teamInfo.id)
    .success(function (res) {
      $scope.eventData.explainUrl = appConfig.FILE_URL + res.url;
      $scope.eventData.created = new Date();
      $scope.eventData.deleted = false;
      Team.prototype_create_races({
        id: $scope.teamInfo.id
      }, $scope.eventData, function () {
        Materialize.toast('创建成功！', 2000);
        $location.path('/MS/event/list');
      }, function () {
        Materialize.toast('创建失败！', 2000);
      });
    });
  };

}]);

app.controller('EventDetailCtrl', 
  ['$scope', 'Race', '$http', '$stateParams', 'appConfig', 'uploadFile',
  function ($scope, Race, $http, $stateParams, appConfig, uploadFile) {
  $scope.isAuthor = $stateParams.type === 'author';
  $scope.uploadAttachmentBtn = false;
  $scope.addGetInfoBtn = false;
  $scope.newNotice = {};
  $scope.materialInfo = {
    loader: $scope.teamInfo.name,
    open: true
  };
  Race.findById({
    id: $stateParams.id
  }, function (res) {
    $scope.raceInfo = res;
    
  });
  $scope.materialLoad = function () {
    var file = document.getElementById('addMaterialDoc').files[0];
    uploadFile.file(file, 'team', $scope.teamInfo.id)
    .success(function (res) {
      $scope.materialInfo.dataUrl = appConfig.FILE_URL + res.url;
    })
    .error();
  };

  $scope.createMaterial = function () {
    $scope.materialInfo.created = new Date();
    if ($scope.materialInfo.name) {
      Race.prototype_create_materials({
        id: $stateParams.id
      }, $scope.materialInfo, function (response) {
        Materialize.toast('上传成功！', 2000);
        $scope.materialInfo = undefined;
        $scope.materialList.push(response);
      }, function () {
        Materialize.toast('上传失败！', 2000);
      });
    } else {
      Materialize.toast('请先选择一个文件哦！', 2000);
    }
  };
  Race.prototype_get_notices({
    id: $stateParams.id,
    filter: {
      where: {
        deleted: false
      }
    }
  }, function (res) {
    $scope.noticeList = res;
  }, function () {
    Materialize.toast('获取通知列表失败！', 2000);
  });

  $scope.deleteNotice = function () {
    var thisElement = this;
    Race.prototype_updateById_notices({
      id: $stateParams.id,
      fk: thisElement.notice.id
    }, {deleted: true}, function () {
      Materialize.toast('删除成功！', 2000);
      delete thisElement.notice;
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };

  $scope.uploadAttachment = function () {
    var file = document.getElementById('attachmentFile').files[0];
    uploadFile.file(file, 'team', $scope.teamInfo.id)
    .success(function (res) {
      $scope.newNotice.attachmentUrl = appConfig.FILE_URL + res.url;
    })
    .error();
  };

  $scope.createNotice = function () {
    $scope.newNotice.created = new Date();
    if ($scope.newNotice.content) {
      Race.prototype_create_notices({
        id: $stateParams.id
      }, $scope.newNotice, function (res) {
        Materialize.toast('创建成功！', 2000);
        $scope.newNotice = undefined;
        $scope.noticeList.push(res);
      }, function () {
        Materialize.toast('创建失败！', 2000);
      });
    } else {
      Materialize.toast('请先填写通知内容哦', 2000);
    }
  };
  $scope.uploadNoticeFile = function () {
    var file = document.getElementById(this.notice.id).files[0];
    notice = this.notice;
    uploadFile.file(file, 'team', $scope.teamInfo.id)
    .success(function (res) {
      notice.dataUrl = appConfig.FILE_URL + res.url;
      $scope.putFileInfo(notice);

    })
    .error();
  };
  $scope.putFileInfo = function (notice) {
    Race.prototype_updateById_notices({
      id: $stateParams.id,
      fk: notice.id
    }, {
      name: notice.file,
      dataUrl: notice.dataUrl,
      created: new Date(),
      loader: $scope.teamInfo.name,
      teamId: $scope.teamInfo.id
    }, function (res) {
      Materialize.toast('资料上传成功！', 2000);
    }, function (err) {
      Materialize.toast(err.data.error.message, 2000);
    });
  };
  Race.prototype_get_raceTeams({
    id: $stateParams.id
  }, function (res) {
    $scope.raceTeams = res;
  });

  $scope.deleteRaceTeam = function () {
    var thisElement = this;
    Race.prototype_unlink_raceTeams({
      id: $stateParams.id,
      fk: thisElement.raceTeam.id
    }, function () {
      Materialize.toast('删除参赛团队成功！', 2000);
      delete thisElement.raceTeam;
    }, function () {
      Materialize.toast('删除参赛团队失败！', 2000);
    });
  };

  Race.prototype_get_materials({
    id: $stateParams.id
  }, function (res) {
    $scope.materialList = res;
  }, function () {
    Materialize.toast('获取资料列表失败！', 6000);
  });

  $scope.deleteMaterial = function () {
    var thisElement = this;
    Race.prototype_destroyById_materials({
      id: $stateParams.id,
      fk: thisElement.materialSingle.id
    }, function () {
      Materialize.toast('删除资料成功！', 2000);
      delete thisElement.materialSingle;
    }, function () {
      Materialize.toast('删除资料失败！', 2000);
    });
  };

  $scope.changeOpen = function () {
    var thisElement = this;
    Race.prototype_updateById_materials({
      id: $stateParams.id,
      fk: thisElement.materialSingle.id
    }, {open: thisElement.materialSingle.open}, function () {
      Materialize.toast('更改权限成功！', 2000);
    }, function () {
      Materialize.toast('更改权限失败！', 2000);
    });
  }

}]);
