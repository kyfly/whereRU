app.controller('TeamsController', ['$scope', 'Team', 'User', '$location', 'uploadFile', '$window',
  function ($scope, Team, User, $location, uploadFile, $window) {
  $scope.filterBar = 'ng-hide';
  $scope.types = [{
    "name": "校园组织"
  }, {
    "name": "校园团队"
  }, {
    "name": "兴趣团队"
  }, {
    "name": "竞赛团队"
  }];
  $window.pull = true;
  $scope.teams = [];
  var page = 0;
  angular.element($window).bind('scroll', function (e) {
    var body = e.target.body;
    if (body.scrollHeight - body.clientHeight - body.scrollTop < 600 && $window.pull && !$scope.last) {
      $scope.getTeams();
      $window.pull = false;
    } else if (body.scrollHeight - body.clientHeight - body.scrollTop > 600) {
      $window.pull = true;
    }
  });
  $scope.$on('$destroy', function (event,data) {
    angular.element($window).unbind('scroll');
    $scope.teams = undefined;
  });
  $scope.team = {
    status: false,
    hidden: false
  };
  $scope.allStatusFilter = function () {
    $scope.query = undefined;
    $scope.status = '状态';
  };
  $scope.statusFilter = function () {
    $scope.query = {
      status: 1
    };
    page = 0;
    $scope.last = false;
    $scope.teams = [];
    $scope.getTeams();
    $scope.status = '可加入';
  };
  $scope.organizationFilter = function () {
    $scope.query = {
      type: '校园组织'
    };
    page = 0;
    $scope.last = false;
    $scope.teams = [];
    $scope.getTeams();
    $scope.typeHide = true;
    $scope.type = '校园组织';
  };
  $scope.associationFilter = function () {
    $scope.query = {
      type: '校园社团'
    };
    page = 0;
    $scope.last = false;
    $scope.teams = [];
    $scope.getTeams();
    $scope.typeHide = true;
    $scope.type = '校园社团';
  };
  $scope.avocationFilter = function () {
    $scope.query = {
      type: '兴趣团队'
    };
    page = 0;
    $scope.last = false;
    $scope.teams = [];
    $scope.getTeams();
    $scope.typeHide = true;
    $scope.type = '兴趣团队';
  };
  $scope.raceFilter = function () {
    $scope.query = {
      type: '竞赛团队'
    };
    page = 0;
    $scope.last = false;
    $scope.teams = [];
    $scope.getTeams();
    $scope.typeHide = true;
    $scope.type = '竞赛团队';
  };
  $scope.allTypeFilter = function () {
    $scope.query = undefined;
    $scope.typeHide = true;
    $scope.type = '团队类型';
  };
  $scope.titleFilter = function () {
    if (!this.filterTitle) {
      $scope.query = undefined;
    } else {
      $scope.query = {
        name: this.filterTitle
      };
    }
  };
  $scope.uploadLogo = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    var file = document.getElementById('teamlogo').files[0];
    var Xhr = new XMLHttpRequest();
    var fileExt = /\.[^\.]+/.exec(document.getElementById('teamlogo').value.toLowerCase());
    if (!((fileExt[0] === '.png') || (fileExt[0] === '.jpg') || (fileExt[0] === '.jpeg') || (fileExt[0] === '.gif'))) {
      alert('请确认您上传的logo文件格式是jpg、png、gif或jpeg');
      return false;
    }
    uploadFile.img(file, 'teamlogo', $scope.$currentUser.id)
    .success(function (res) {
      $scope.team.logoUrl = res.url;
    });
  };
  
  $scope.getTeams = function () {
    if (!$scope.$currentUser) {
      $scope.$emit('auth:loginRequired');
      return;
    }
    var query = $scope.query || {};
    Team.getMySchoolTeams({
      school: $scope.$currentUser.school,
      page: page,
      type: query.type,
      status: query.status
    }, function (res) {
      if (res.teams.length < 16 || res.teams.length === 0) {
        $scope.last = true;
      }
      page ++;
      $scope.teams.push.apply($scope.teams, res.teams);
    });
  }
  /**
   * 团队列表
   * school参数有问题，i++
   */
  if (!$scope.username) {
    Team.find(function (teams) {
      $scope.teams = teams;
    })
  } else {
    $scope.getTeams();
  }


  /**
   * 创建团队
   */
  $scope.createTeam = function () {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    if (!$scope.team.logoUrl) {
      return Materialize.toast('团队logo未上传成功,请稍等', 2000);
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
  ['$scope', 'Team', '$stateParams', 'User', '$location', '$timeout',
  function ($scope, Team, $stateParams, User, $location, $timeout) {
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
    $scope.activities.forEach(function (activity) {
      getActivityStatus(activity);
    });
  });
  function getActivityStatus(activity) {
    var now = new Date();
    try{
      if (new Date(activity.ended) < now) {
        activity.status = 'end';
      } else if (new Date(activity.started) > now){
        activity.status = 'nos';
      } else {
        activity.status = 'ing';
      }
    } catch (err){
      
    }
  }
  $scope.getUserInfo = function() {
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
    User.getInfo(function (user) {
      $scope.user = user;
      if (!user.studentId) {
        Materialize.toast('加入团队需要验证学号信息', 2000);
        $timeout(function () {
          $location.path('/u/confirmSchool');
        }, 1000);
      }
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
