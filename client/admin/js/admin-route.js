function RouteConfigure($routeProvider) {
  $routeProvider
    .when('/eventManage/home', {
      templateUrl: '/admin/partials/index.html',
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
      templateUrl: '/admin/partials/sign-in.html',
      controller: ['$scope', 'ContestOrg', '$location', LoginCtrl]
    })
    .when('/eventManage/reg', {
      templateUrl: '/admin/partials/sign-up.html',
      controller: ['$scope', 'ContestOrg', '$location', SignUpCtrl]
    })
    .otherwise({redirectTo: '/eventManage/home'});
}
