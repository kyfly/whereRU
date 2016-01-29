app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when("", "/application/views/activity/index.html");
	$stateProvider
	.state('activities', {
		url: '/w/activities',
		controller: 'ActivitiesController',
		templateUrl: '/application/views/activity/index.html'
	})
    .state('activities.activitys', {
      url: '/activitys',
      controller: 'ActivitysController',
      templateUrl: '/application/views/activity/activitys.html'
    })
	//.state('activity', {
	//	url: '/w/activities/:id',
	//	controller: 'ActivitieController',
	//	templateUrl: 'application/views/activity/detail.html'
	//})


}]);
