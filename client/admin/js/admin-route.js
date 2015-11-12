function RouteConfigure($routeProvider) {
  $routeProvider
    .when('/eventManage/homepage', {
      templateUrl: '/admin/partials/homepage.html',
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
    .otherwise({redirectTo: '/eventManage/homepage'});
}
