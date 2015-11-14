function RouteConfigure($routeProvider) {
  $routeProvider
    .when('/eventManage/home', {
      templateUrl: '/admin/partials/home.html',
      controller: ['$scope', '$resource', HomeCtrl]
    })
    .when('/eventManage/event', {
      templateUrl: '/admin/partials/event.html',
      controller: ['$scope', '$resource', EventCtrl]
    })
    .when('/eventManage/setting', {
      templateUrl: '/admin/partials/setting.html',
      controller: ['$scope', '$resource', SettingCtrl]
    })
    .when('/eventManage/help', {
      templateUrl: '/admin/partials/help.html',
      controller: HelpCtrl
    })
    .when('/eventManage/login', {
      templateUrl: '/admin/partials/login.html',
      controller: ['$scope', 'ContestOrg', '$location', LoginCtrl]
    })
    .otherwise({redirectTo: '/eventManage/home'});
}
