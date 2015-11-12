function RouteConfigure($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: '/admin/partials/home.html',
      controller: ['$scope', '$resource', HomeCtrl]
    })
    .when('/event', {
      templateUrl: '/admin/partials/event.html',
      controller: ['$scope', '$resource', EventCtrl]
    }).when('/setting', {
      templateUrl: '/admin/partials/setting.html',
      controller: ['$scope', '$resource', SettingCtrl]
    })
    .when('/help', {
      templateUrl: '/admin/partials/help.html',
      controller: HelpCtrl
    })
    .otherwise({redirectTo: '/home'});
}
