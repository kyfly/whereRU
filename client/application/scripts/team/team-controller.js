app.controller('TeamsController', ['$scope', 'Team', 'User', '$location', function ($scope, Team, User, $location) {
  $scope.types = [{
    "name": "校园组织"
  }, {
    "name": "校园团队"
  }, {
    "name": "兴趣团队"
  }, {
    "name": "技术团队"
  }];
  $scope.changeFilter = function () {
    $scope.choice = this.type.name;
  };
  $scope.team = {
    status: false,
    hidden: false
  };
  $scope.uploadLogo = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    console.log($scope.$currentUser);
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
    Xhr.open('POST', '/ue/uploads?dir=teamlogo&id=' + $scope.$currentUser.id + '&action=uploadimage', true);
    Xhr.send(Fd);
  };
  /**
   * 团队列表
   * school参数有问题，i++
   */
  if (!$scope.username) {
    Team.find(function (teams) {
      $scope.teams = teams;
    })
  } else {
    Team.getMySchoolTeams({
      school: $scope.$currentUser.school
    }, function (res) {
      $scope.teams = res.teams;
    });
  }


  /**
   * 创建团队
   */
  $scope.createTeam = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    User.prototype_create_teams({
      id: $scope.$currentUser.id
    }, $scope.team, function (team) {
      Materialize.toast('创建团队成功', 2000);
      $location.path('/w/teams/' + team.id);
    })
  }
}]);

/**
 * 团队详情
 */

app.controller('TeamController', 
  ['$scope', 'Team', '$stateParams', 'User', '$location',
  function ($scope, Team, $stateParams, User, $location) {
  $scope.userInfomation = {};

  if (!$scope.teamId) {
    $scope.teamId = $stateParams.id;
  }
  
  Team.findById({
      id: $scope.teamId
    }, function (res) {
      $scope.team = res;
      $scope.$emit('shareContentArrive', {
        bdText: res.name,
        bdPic: res.logoUrl,
        bdDesc: res.desc
      });
    }, function () {
    }
  );
  Team.prototype_get_activities({
    id: $scope.teamId
  }, function (activities) {
    $scope.activities = activities;
  });
  $scope.getUserInfo = function() {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    User.getInfo(function (user) {
      $scope.user = user;
      // if (!user.studentId) {
      //   console.log($location.url());
      //   url = 'http://cas.hdu.edu.cn/cas/login?service='
      //   + $location.protocol()
      //   + "://" + $location.host()
      //   + ":" + $location.port()
      //   + "/api/WUsers/"+ $scope.$currentUser.id + "/confirmSchool"
      //   + "?access_token=" + $scope.$currentUser.accessToken
      //   + "&from=" + $location.url();
      //   location.href = url;
      // }
        
    });
  };
  $scope.join = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    Team.prototype_create_members({
      id: $scope.teamId
    }, $scope.userInfomation, function (member) {
      Materialize.toast('申请成功,等待管理员同意', 2000);
    }, function (err) {
      console.log(err)
      Materialize.toast(err.data.error.message, 2000);
    });
  }
}]);
