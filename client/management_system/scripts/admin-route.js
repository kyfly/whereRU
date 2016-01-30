app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/MS/home');
  $stateProvider
    .state('home', {
      url: '/MS/home',
      templateUrl: '/management_system/views/home.html',
      controller: 'HomeCtrl'
    })
    .state('member', {
      url: '/MS/member',
      templateUrl: '/management_system/views/member.html',
      controller: 'MemberCtrl'
    })
    .state('eventList', {
      url: '/MS/event/list',
      templateUrl: '/management_system/views/event/list.html',
      controller: 'EventListCtrl'
    })
    .state('eventEdit', {
      url: '/MS/event/edit/:id',
      templateUrl: '/management_system/views/event/edit.html',
      controller: 'EventEditCtrl'
    })
    .state('activityList', {
      url: '/MS/activity/list',
      templateUrl: '/management_system/views/activity/list.html',
      controller: 'ActivityListCtrl'
    })
    .state('activityEdit', {
      url: '/MS/activity/edit/:id',
      templateUrl: '/management_system/views/activity/edit.html',
      controller: 'ActivityEditCtrl'
    })
    .state('formList', {
      url: '/MS/form/list',
      templateUrl: '/management_system/views/form/list.html',
      controller: 'FormListCtrl'
    })
    .state('formEdit', {
      url: '/MS/form/edit/:id',
      templateUrl: '/management_system/views/form/edit.html',
      controller: 'FormEditCtrl'
    })
    .state('formResult', {
      url: '/MS/form/result/:id',
      templateUrl: '/management_system/views/form/result.html',
      controller: 'FormResultCtrl'
    })
    .state('voteList', {
      url: '/MS/vote/list',
      templateUrl: '/management_system/views/vote/list.html',
      controller: 'VoteListCtrl'
    })
    .state('voteEdit', {
      url: '/MS/vote/edit/:id',
      templateUrl: '/management_system/views/vote/edit.html',
      controller: 'VoteEditCtrl'
    })
    .state('voteResult', {
      url: '/MS/vote/result/:id',
      templateUrl: '/management_system/views/vote/result.html',
      controller: 'VoteResultCtrl'
    })
    .state('seckillList', {
      url: '/MS/seckill/list',
      templateUrl: '/management_system/views/seckill/list.html',
      controller: 'SeckillListCtrl'
    })
    .state('seckillEdit', {
      url: '/MS/seckill/edit/:id',
      templateUrl: '/management_system/views/seckill/edit.html',
      controller: 'SeckillEditCtrl'
    })
    .state('seckillResult', {
      url: '/MS/seckill/result/:id',
      templateUrl: '/management_system/views/seckill/result.html',
      controller: 'SeckillResultCtrl'
    })
    .state('album', {
      url: '/MS/album',
      templateUrl: '/management_system/views/album.html',
      controller: 'AlbumCtrl'
    })
    .state('setting', {
      url: '/MS/setting',
      templateUrl: '/management_system/views/setting.html',
      controller: 'SettingCtrl'
    })
    .state('help', {
      url: '/MS/help',
      templateUrl: '/management_system/views/help.html',
      controller: 'HelpCtrl'
    })
});
