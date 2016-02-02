app.controller('EventListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.logoHide = false;
  $scope.unFormat = "yyyy-MM-dd HH:mm";
  $scope.format = "yyyy-MM-dd";

  Team.prototype_get_races({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
      order: 'created DESC'
    }
  }, function (res) {
    $scope.eventItems = res;
  }, function () {
    Materialize.toast('获取创建竞赛列表失败！', 6000);
  });

  Team.prototype_get_partakedRaces({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
      order: 'created DESC'
    }
  }, function (res) {
    $scope.partakedEventItems = res;
    $scope.deletedLength = 0;
    for (var x in $scope.partakedEventItems) if ($scope.partakedEventItems[x].deleted === true) {
      $scope.deletedLength ++;
    }
  }, function () {
    Materialize.toast('获取参与竞赛列表失败！', 2000);
  });

  $scope.showSingleType = function (type) {
    $scope.allChosen = type === 'all';
  };

  $scope.deleteEvent = function () {
    var thisElement = this;

    Team.prototype_updateById_races({
      id: localStorage.$LoopBack$currentTeamId,
      fk: thisElement.eventItem.id
    }, {deleted: true}, function () {
      Materialize.toast('删除成功！', 2000);
      var id = thisElement.eventItem.id;
      for (var x in $scope.eventItems) if ($scope.eventItems[x].id === id) {
        $scope.eventItems.splice(x, 1);
      }
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };

  $scope.quitEvent = function () {
    var thisElement = this;

    Team.prototype_unlink_partakedRaces({
      id: localStorage.$LoopBack$currentTeamId,
      fk: thisElement.partakedEventItem.id
    }, {deleted: true}, function () {
      Materialize.toast('删除成功！', 2000);
      var id = thisElement.partakedEventItem.id;
      for (var x in $scope.partakedEventItems) if ($scope.partakedEventItems[x].id === id) {
        $scope.partakedEventItems.splice(x, 1);
      }
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };

}]);

app.controller('EventEditCtrl', ['$scope', 'Team', 'Ueditor', '$http', '$location', function ($scope, Team, Ueditor, $http, $location) {
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
    var Xhr = new XMLHttpRequest();
    var fileExt = /\.[^\.]+/.exec(document.getElementById('eventImg').value.toLowerCase());
    if (!((fileExt[0] === '.png') || (fileExt[0] === '.jpg') || (fileExt[0] === '.jpeg') || (fileExt[0] === '.gif'))) {
      alert('请确认您上传的logo文件格式是jpg、png、gif或jpeg');
      return false;
    }
    var readyHandle = function () {
      if (Xhr.readyState === 4) {
        if (Xhr.status === 200) {
          $scope.eventData.imgUrl = 'http://oss.etuan.org/' + JSON.parse(Xhr.responseText).url;
        }
      }
    };
    var Fd = new FormData();
    Fd.append('img', file);
    Xhr.onreadystatechange = readyHandle;
    Xhr.open('POST', '/ue/uploads?dir=team&id=' + localStorage.$LoopBack$currentTeamId + '&action=uploadimage', true);
    Xhr.send(Fd);
  };

  $scope.eventEditorConfig = Ueditor.config;

  $scope.createEvent = function () {
    $http({
      url: '/ue/uploads?dir=team&id=' + localStorage.$LoopBack$currentTeamId + '&action=uploadtext',
      method: "post",
      data: {
        'content': $scope.eventEditorContent
      }
    }).success(function (res) {
      $scope.eventData.explainUrl = 'http://oss.etuan.org/' + res.url;
      $scope.eventData.created = new Date();
      $scope.eventData.deleted = false;
      Team.prototype_create_races({
        id: localStorage.$LoopBack$currentTeamId
      }, $scope.eventData, function () {
        Materialize.toast('创建成功！', 2000);
        $location.path('/MS/event/list');
      }, function () {
        Materialize.toast('创建失败！', 2000);
      });
    });
  }

}]);

app.controller('EventDetailCtrl', ['$scope', 'Race', '$http', '$stateParams', function ($scope, Race, $http, $stateParams) {
  Race.findById({
    id: $stateParams.id
  }, function (res) {
    $scope.raceInfo = res;
    $scope.materialInfo = {
      loader: $scope.raceInfo.authorName,
      open: true
    };

    $scope.materialLoad = function () {
      var file = document.getElementById('addMaterialDoc').files[0];
      var Xhr = new XMLHttpRequest();
      var readyHandle = function () {
        if (Xhr.readyState === 4) {
          if (Xhr.status === 200) {
            $scope.materialInfo.dataUrl = 'http://oss.etuan.org/' + JSON.parse(Xhr.responseText).url;
          }
        }
      };
      var Fd = new FormData();
      Fd.append('text', file);
      Xhr.onreadystatechange = readyHandle;
      Xhr.open('POST', '/ue/uploads?dir=team&id=' + localStorage.$LoopBack$currentTeamId + '&action=uploadfile', true);
      Xhr.send(Fd);
    };

    $scope.createMaterial = function () {
      $scope.materialInfo.created = new Date();
      if ($scope.materialInfo.name) {
        Race.prototype_create_materials({
          id: $stateParams.id
        }, $scope.materialInfo, function (response) {
          Materialize.toast('上传成功！', 2000);
          $scope.materialList.push(response);
        }, function () {
          Materialize.toast('上传失败！', 2000);
        });
      } else {
        Materialize.toast('请先选择一个文件哦！', 2000);
      }

    }
  });

  $scope.isAuthor = $stateParams.type === 'author';
  $scope.uploadAttachmentBtn = false;
  $scope.addGetInfoBtn = false;
  $scope.newNotice = {};

  Race.prototype_get_notices({
    id: $stateParams.id
  }, function (res) {
    $scope.noticeList = res;
    $scope.deletedNum = 0;
    for (var x in $scope.noticeList) if ($scope.noticeList[x].deleted === true) {
      $scope.deletedNum++;
    }
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
      var id = thisElement.notice.id;
      for (var x in $scope.noticeList) if ($scope.noticeList[x].id === id) {
        $scope.noticeList.splice(x, 1);
      }
    }, function () {
      Materialize.toast('删除失败！', 2000);
    });
  };

  $scope.uploadAttachment = function () {
    var file = document.getElementById('attachmentFile').files[0];
    var Xhr = new XMLHttpRequest();
    var readyHandle = function () {
      if (Xhr.readyState === 4) {
        if (Xhr.status === 200) {
          $scope.newNotice.attachmentUrl = 'http://oss.etuan.org/' + JSON.parse(Xhr.responseText).url;
        }
      }
    };
    var Fd = new FormData();
    Fd.append('text', file);
    Xhr.onreadystatechange = readyHandle;
    Xhr.open('POST', '/ue/uploads?dir=team&id=' + localStorage.$LoopBack$currentTeamId + '&action=uploadfile', true);
    Xhr.send(Fd);
  };

  $scope.createNotice = function () {
    $scope.newNotice.created = new Date();
    if ($scope.newNotice.content) {
      Race.prototype_create_notices({
        id: $stateParams.id
      }, $scope.newNotice, function (res) {
        Materialize.toast('创建成功！', 2000);
        $scope.noticeList.push(res);
      }, function () {
        Materialize.toast('创建失败！', 2000);
      });
    } else {
      Materialize.toast('请先填写通知内容哦', 2000);
    }
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
      var id = thisElement.raceTeam.id;
      for (var x in $scope.raceTeams) if ($scope.raceTeams[x].id === id) {
        $scope.raceTeams.splice(x, 1);
      }
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
      var id = thisElement.materialSingle.id;
      for (var x in $scope.materialList) if ($scope.materialList[x].id === id) {
        $scope.materialList.splice(x, 1);
      }
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
