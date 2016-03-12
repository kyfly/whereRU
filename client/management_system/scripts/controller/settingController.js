app.controller('SettingCtrl', ['$scope', '$rootScope', 'Team', function ($scope, $rootScope, Team) {
  $rootScope.logoHide = false;
  $scope.team = {};

  Team.findById({
    id: localStorage.$LoopBack$currentTeamId
  }, function (res) {
    $scope.team = res;
  });

  $scope.types = [{
    "name": "校园组织"
  }, {
    "name": "校园团队"
  }, {
    "name": "兴趣团队"
  }, {
    "name": "技术团队"
  }];

  $scope.uploadLogo = function () {
    var file = document.getElementById('teamlogo').files[0];
    var Xhr = new XMLHttpRequest();
    var fileExt = /\.[^\.]+/.exec(document.getElementById('teamlogo').value.toLowerCase());
    if (!((fileExt[0] === '.png') || (fileExt[0] === '.jpg') || (fileExt[0] === '.jpeg') || (fileExt[0] === '.gif'))) {
      alert('请确认您上传的logo文件格式是jpg、png、gif或jpeg');
      return false;
    }
    var readyHandle = function () {
      if (Xhr.readyState === 4) {
        if (Xhr.status === 200) {
          $scope.$apply(function () {
            $scope.team.logoUrl = 'http://cdn-img.etuan.org/' + JSON.parse(Xhr.responseText).url + '@1e_1c_0o_0l_100h_100w_100q.src';
          });
        }
      }
    };
    var Fd = new FormData();
    Fd.append('img', file);
    Xhr.onreadystatechange = readyHandle;
    Xhr.open('POST', '/ue/uploads?dir=teamlogo&id=' + localStorage.$LoopBack$currentUserId + '&action=uploadimage', true);
    Xhr.send(Fd);
  };

  $scope.addDepartment = function () {
    $scope.team.teamDepartments.push({
      name: '',
      desc: ''
    });
  };
  $scope.moveUpDepartment = function (index) {
    if (index > 0) {
      $scope.team.teamDepartments.splice(index - 1, 0, $scope.team.teamDepartments.splice(index, 1)[0]);
    }
  };
  $scope.moveDownDepartment = function (index) {
    if (index < $scope.team.teamDepartments.length) {
      $scope.team.teamDepartments.splice(index + 1, 0, $scope.team.teamDepartments.splice(index, 1)[0]);
    }
  };
  $scope.removeDepartment = function (index) {
    $scope.team.teamDepartments.splice(index, 1);
  };

  $scope.updateInfo = function () {
    $scope.team.updated = new Date();
    var dsTmp = [];
    if($scope.team.teamDepartments.length){
      for (var i = 0; i < $scope.team.teamDepartments.length; i++) {
        dsTmp.push($scope.team.teamDepartments[i]);
        dsTmp[i].id = i;
      }
    }
    console.log($scope.team);
    Team.prototype_updateAttributes({
      id: localStorage.$LoopBack$currentTeamId
    }, $scope.team, function () {
      Materialize.toast('更新成功！', 2000);
    }, function () {
      Materialize.toast('更新失败！', 2000);
    });
  }
}]);
