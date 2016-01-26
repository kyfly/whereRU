function RouteConfigure($routeProvider) {
  $routeProvider
    .when('/MS/home', {
      templateUrl: '/management_system/views/index.html',
      controller: ['$scope', '$resource', HomeCtrl]
    })
    .when('/MS/member', {
      templateUrl: '/management_system/views/member.html',
      controller: ['$scope', '$resource', 'Team', MemberCtrl]
    })
    .when('/MS/event', {
      templateUrl: '/management_system/views/event.html',
      controller: ['$scope', '$resource', 'ContestOrg', 'Contest', EventCtrl]
    })
    .when('/MS/activity', {
      templateUrl: '/management_system/views/activity.html',
      controller: ['$scope', '$resource', ActivityCtrl]
    })
    .when('/MS/form', {
      templateUrl: '/management_system/views/form.html',
      controller: ['$scope', '$resource', FormCtrl]
    })
    .when('/MS/vote', {
      templateUrl: '/management_system/views/vote.html',
      controller: ['$scope', '$resource', VoteCtrl]
    })
    .when('/MS/seckill', {
      templateUrl: '/management_system/views/seckill.html',
      controller: ['$scope', '$resource', SeckillCtrl]
    })
    .when('/MS/album', {
      templateUrl: '/management_system/views/album.html',
      controller: ['$scope', '$resource', AlbumCtrl]
    })
    .when('/MS/setting', {
      templateUrl: '/management_system/views/setting.html',
      controller: ['$scope', 'ContestOrg', '$rootScope', 'School', SettingCtrl]
    })
    .when('/MS/help', {
      templateUrl: '/management_system/help.html',
      controller: HelpCtrl
    })
    .otherwise({redirectTo: '/MS/home'});
}
