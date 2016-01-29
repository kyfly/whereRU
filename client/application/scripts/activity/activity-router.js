app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when("", "/application/views/activity/index.html");
  $stateProvider
    
    .state('art.activities', {
      url: '/activities',
      controller: 'ActivitiesController',
      templateUrl: '/application/views/activity/index.html'
    })
    .state('art.activity', {
      url: '/:id/detail',
      controller: 'ActivityDetailController',
      templateUrl: '/application/views/activity/detail.html'
    })
    .state('activity', {
      url: '/w/activities/:id',
      controller: 'ActivityController',
      templateUrl: 'application/views/activity/detail.html'
    })


}]);
