app.controller('HomeController', ['$scope', '$http', '$sce', '$templateCache', HomeController]);
function HomeController($scope, $http, $sce, $templateCache) {

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

app.controller('MyTeamController', ['$scope', 'Team', MyTeamController]);
function MyTeamController($scope, Team) {
  $scope.teams = Team.find({filter: {fields:['name', 'id', 'logoUrl', 'dynamic']}});
}
