app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('activities', {
      url: '/w/activities',
      controller: 'IndexController',
      templateUrl: 'application/views/activity/index.html'
    })
}]);
