app.controller('HomeController', ['$scope', '$http', 'Contest', '$templateCache', HomeController]);
function HomeController($scope, $http, Contest, $templateCache) {
  $scope.events = Contest.find({filter: {limit: 4}});
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
