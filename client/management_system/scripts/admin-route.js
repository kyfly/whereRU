app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/MS/home');
  $stateProvider
    .state('home', {
      url: '/MS/home',
      templateUrl: '/management_system/views/home.html',
      controller: 'HomeCtrl',
      stateIndex: 0
    })
    .state('member', {
      url: '/MS/member',
      templateUrl: '/management_system/views/member.html',
      controller: 'MemberCtrl',
      stateIndex: 1
    })
    .state('eventList', {
      url: '/MS/event/list',
      templateUrl: '/management_system/views/event/list.html',
      controller: 'EventListCtrl',
      stateIndex: 2
    })
    .state('eventEdit', {
      url: '/MS/event/edit?:id',
      templateUrl: '/management_system/views/event/edit.html',
      controller: 'EventEditCtrl',
      stateIndex: 2
    })
    .state('eventDetail', {
      url: '/MS/event/detail/:type/:id',
      templateUrl: '/management_system/views/event/detail.html',
      controller: 'EventDetailCtrl',
      stateIndex: 2
    })
    .state('activityList', {
      url: '/MS/activity/list',
      templateUrl: '/management_system/views/activity/list.html',
      controller: 'ActivityListCtrl',
      stateIndex: 3
    })
    .state('activityEdit', {
      url: '/MS/activity/edit/:id',
      templateUrl: '/management_system/views/activity/edit.html',
      controller: 'ActivityEditCtrl',
      stateIndex: 3
    })
    .state('formList', {
      url: '/MS/form/list',
      templateUrl: '/management_system/views/form/list.html',
      controller: 'FormListCtrl',
      stateIndex: 4
    })
    .state('formEdit', {
      url: '/MS/form/edit/:id',
      templateUrl: '/management_system/views/form/edit.html',
      controller: 'FormEditCtrl',
      stateIndex: 4
    })
    .state('formResult', {
      url: '/MS/form/result/:id',
      templateUrl: '/management_system/views/form/result.html',
      controller: 'FormResultCtrl',
      stateIndex: 4
    })
    .state('voteList', {
      url: '/MS/vote/list',
      templateUrl: '/management_system/views/vote/list.html',
      controller: 'VoteListCtrl',
      stateIndex: 5
    })
    .state('voteEdit', {
      url: '/MS/vote/edit/:id',
      templateUrl: '/management_system/views/vote/edit.html',
      controller: 'VoteEditCtrl',
      stateIndex: 5
    })
    .state('voteResult', {
      url: '/MS/vote/result/:id',
      templateUrl: '/management_system/views/vote/result.html',
      controller: 'VoteResultCtrl',
      stateIndex: 5
    })
    .state('seckillList', {
      url: '/MS/seckill/list',
      templateUrl: '/management_system/views/seckill/list.html',
      controller: 'SeckillListCtrl',
      stateIndex: 6
    })
    .state('seckillEdit', {
      url: '/MS/seckill/edit/:id',
      templateUrl: '/management_system/views/seckill/edit.html',
      controller: 'SeckillEditCtrl',
      stateIndex: 6
    })
    .state('seckillResult', {
      url: '/MS/seckill/result/:id',
      templateUrl: '/management_system/views/seckill/result.html',
      controller: 'SeckillResultCtrl',
      stateIndex: 6
    })
    .state('album', {
      url: '/MS/album',
      templateUrl: '/management_system/views/album.html',
      controller: 'AlbumCtrl',
      stateIndex: 7
    })
    .state('setting', {
      url: '/MS/setting',
      templateUrl: '/management_system/views/setting.html',
      controller: 'SettingCtrl',
      stateIndex: 8
    })
    .state('help', {
      url: '/MS/help',
      templateUrl: '/management_system/views/help.html',
      controller: 'HelpCtrl',
      stateIndex: 9
    })
    .state('index', {
      url: '/',
      controller: function () {
        window.location.href = '/';
      }
    })
});
