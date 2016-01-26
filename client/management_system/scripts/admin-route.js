function RouteConfigure($routeProvider) {
  $routeProvider
    .when('/eventManage/home', {
      templateUrl: '/admin/partials/index.html',
      controller: ['$scope', '$resource', HomeCtrl]
    })
    .when('/eventManage/member', {
      templateUrl: '/admin/partials/member.html',
      controller: ['$scope', '$resource', 'Team', MemberCtrl]
    })
    .when('/eventManage/event', {
      templateUrl: '/admin/partials/event.html',
      controller: ['$scope', '$resource', 'ContestOrg', 'Contest', EventCtrl]
    })
    .when('/eventManage/activity', {
      templateUrl: '/admin/partials/activity.html',
      controller: ['$scope', '$resource', ActivityCtrl]
    })
    .when('/eventManage/form', {
      templateUrl: '/admin/partials/form.html',
      controller: ['$scope', '$resource', FormCtrl]
    })
    .when('/eventManage/vote', {
      templateUrl: '/admin/partials/vote.html',
      controller: ['$scope', '$resource', VoteCtrl]
    })
    .when('/eventManage/seckill', {
      templateUrl: '/admin/partials/seckill.html',
      controller: ['$scope', '$resource', SeckillCtrl]
    })
    .when('/eventManage/album', {
      templateUrl: '/admin/partials/album.html',
      controller: ['$scope', '$resource', AlbumCtrl]
    })
    .when('/eventManage/setting', {
      templateUrl: '/admin/partials/setting.html',
      controller: ['$scope', 'ContestOrg', '$rootScope', 'School', SettingCtrl]
    })
    .when('/eventManage/help', {
      templateUrl: '/management_system/help.html',
      controller: HelpCtrl
    })
    .otherwise({redirectTo: '/eventManage/home'});
}
