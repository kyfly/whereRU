function RouteConfigure($routeProvider) {
  $routeProvider
    .when('/contest/home', {
      templateUrl: '/admin/partials/home.html',
      controller: ['$scope', '$resource', HomeCtrl]
    })
    .when('/contest/event', {
      templateUrl: '/admin/partials/event.html',
      controller: ['$scope', '$resource', EventCtrl]
    })
    .when('/contest/setting', {
      templateUrl: '/admin/partials/setting.html',
      controller: ['$scope', '$resource', SettingCtrl]
    })
    .when('/contest/help', {
      templateUrl: '/admin/partials/help.html',
      controller: HelpCtrl
    })
    .otherwise({redirectTo: '/contest/home'});
}
