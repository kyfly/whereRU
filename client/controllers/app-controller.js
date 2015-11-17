app.controller('HomeController', ['$scope', 'messages', '$http', '$sce', '$templateCache', HomeController]);
function HomeController($scope, messages, $http, $sce, $templateCache) {
  $scope.messages = messages;
  $scope.getExplain = function () {
    that = this;
    if (!this.team.explain) {
      that.team.explain = $sce.trustAsHtml("dend");
      $http.get(this.team.explainUrl).success(function (html) {
        that.team.explain = $sce.trustAsHtml(html);
      })
    }
  };
  $scope.collapsibleElements = [{
    icon: 'mdi-image-filter-drama',
    title: 'First',
    content: 'Lorem ipsum dolor sit amet.'
  }, {
    icon: 'mdi-maps-place',
    title: 'Second',
    content: 'Lorem ipsum dolor sit amet.'
  }, {
    icon: 'mdi-social-whatshot',
    title: 'Third',
    content: 'Lorem ipsum dolor sit amet.'
  }
  ];
}
app.controller('SignUpController', ['$scope', '$location', 'RUser', 'Auth', SignUpController]);
function SignUpController($scope, $location, RUser, Auth) {
  $scope.schools = [
    {
      id: 1,
      name: 'XX大学',
      logo: '/lib/img/logo/png'
    }, {
      id: 2,
      name: 'XX大学',
      logo: '/lib/img/logo/png'
    }
  ];
  $scope.signUp = function () {
    RUser.create({}, $scope.user, function (res) {
      if (res.err) return;
      Auth.setUser(res.token);
      $location.path('/');
    }, function () {
    });
  }
}
app.controller('SignInController', ['$scope', '$location', 'RUser', 'Auth', SignInController]);
function SignInController($scope, $location, RUser, Auth) {
  $scope.login = function () {
    RUser.login($scope.user, function (res) {
      if (res.err) return;
      Auth.setUser(res.token);
      $location.path('/');
    }, function () {
    });
  }
}
app.controller('UserHomeController', ['$scope', UserHomeController]);
function UserHomeController($scope) {
  // body...
}
app.controller('SearchController', ['$scope', SearchController]);
function SearchController($scope) {

}
app.controller('MyTeamController', ['$scope', 'teams', MyTeamController]);
function MyTeamController($scope, teams) {
  $scope.teams = teams;
  $scope.collapsibleElements = [{
    icon: 'mdi-image-filter-drama',
    title: '公告一',
    content: '加班.'
  }, {
    icon: 'mdi-maps-place',
    title: '公告二',
    content: '加班.'
  }, {
    icon: 'mdi-social-whatshot',
    title: '公告三',
    content: '加班.'
  }
  ];
}
app.controller('ViewTeamController', ['$scope', ViewTeamController]);
function ViewTeamController($scope) {

}
app.controller('CreateTeamController', ['$scope', 'Team', CreateTeamController]);
function CreateTeamController($scope, Team) {
  //$scope.teamConfig = Ueditor.config;
  $scope.schools = [
    {
      id: 1,
      name: 'XX大学',
      logo: '/lib/img/logo/png'
    }, {
      id: 2,
      name: 'XX大学',
      logo: '/lib/img/logo/png'
    }
  ];
  $scope.teamTypes = ['竞赛', '学习', '体育', '创业', '旅游', '桌游', '聊天'];
  $scope.team = {
    pics: []
  };
  $scope.logoLoad = function () {
    var e = document.getElementById('logo').files;
    uploadFile(e, function (res) {
      $scope.team.logoUrl = res[0].url;
      $scope.logo = 'success';
      $scope.$apply();
    });
  };
  $scope.picLoad = function () {
    var e = document.getElementById('pic').files;
    uploadFile(e, function (res) {
      for (r in res) {
        $scope.team.pics.push(res[r].url);
      }
      $scope.pic = 'success';
      $scope.$apply();
    });
  };
  $scope.submit = function () {
    Team.create({}, $scope.team, function (res) {
      console.log(res);
    }, function () {
    });
  };
  //$('select').material_select();
}
app.controller('FindTeamController', ['$scope', FindTeamController]);
function FindTeamController($scope) {
  console.log($scope);
}
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
  xhr.open("POST", "/ue/uploads?action=uploadimage&dynamicPath=team&files=" + files.length, true);
  xhr.send(formData);
}

function uploadHtml(content, callback) {
  var Xhr = new XMLHttpRequest();
  //var formData = new FormData();
  Xhr.onreadystatechange = function () {
    if (Xhr.readyState === 4) {
      if (Xhr.status === 200) {
        callback(JSON.parse(Xhr.responseText));
      }
    }
  };
  // formData.append("content=", content);
  Xhr.open('POST', '/ue/uploads?action=uploadtext&dynamicPath=html&files=1', true);
  Xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  Xhr.send('content=' + content);

}
