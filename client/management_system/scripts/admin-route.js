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
    .state('event', {
      url: '/MS/event',
      templateUrl: '/management_system/views/event.html',
      controller: 'EventCtrl'
    })
    .state('activity', {
      url: '/MS/activity',
      templateUrl: '/management_system/views/activity.html',
      controller: 'ActivityCtrl'
    })
    //.state('list', {
    //  url: '/MS/:type*/list/:id*',
    //  templateUrl: '/management_system/views/list.html',
    //  controller: 'ListCtrl'
    //})
    .state('edit', {
      url: '/MS/:type*/edit',
      templateUrl: '/management_system/views/edit.html',
      controller: 'EditCtrl'
    })
    .state('result', {
      url: '/MS/:type*/result/:id*',
      templateUrl: '/management_system/views/result.html',
      controller: 'ResultCtrl'
    })
    .state('form', {
      url: '/MS/form',
      templateUrl: '/management_system/views/form.html',
      controller: 'FormCtrl',
      views: {
        '': {
          templateUrl: '/management_system/views/list.html'
        },
        'columnOne@form': {
          template: '这里是第一列的内容'
        },
        'columnTwo@form': {
          template: '2323'
        }
      }
    })
    .state('form.list', {
      url: '/list',
      template: '/management_system/views/list.html',
      controller: 'ListCtrl'
    })
    .state('vote', {
      url: '/MS/vote',
      templateUrl: '/management_system/views/vote.html',
      controller: 'VoteCtrl'
    })
    .state('seckill', {
      url: '/MS/seckill',
      templateUrl: '/management_system/views/seckill.html',
      controller: 'SeckillCtrl'
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
