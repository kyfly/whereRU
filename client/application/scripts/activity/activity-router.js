app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
<<<<<<< HEAD
  $stateProvider
    .state('activities', {
      url: '/w/activities',
      controller: 'IndexController',
      templateUrl: 'application/views/activity/index.html'
    })
=======
	$stateProvider
	.state('activities', {
		url: '/w/activities',
		controller: 'ActivitiesController',
		templateUrl: 'application/views/activity/index.html'
	})
	.state('activity', {
		url: '/w/activities/:id',
		controller: 'ActivitieController',
		templateUrl: 'application/views/activity/detail.html'
	})
>>>>>>> liuJD
}]);
