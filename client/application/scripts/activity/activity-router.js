app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when("", "/application/views/activity/index.html");
  $stateProvider
    .state('activities', {
      url: '/w',
      controller: 'ActivitiesController',
      templateUrl: '/application/views/activity/index.html'
    })
    .state('activities.campusEvent', {
      url: '/activities',
      controller: 'campusEventCtrl',
      templateUrl: '/application/views/activity/campusEvent.html'
    })

    .state('activity', {
      url: '/w/activities/:id',
      controller: 'ActivitieController',
      templateUrl: 'application/views/activity/detail.html'
    })


}]);
