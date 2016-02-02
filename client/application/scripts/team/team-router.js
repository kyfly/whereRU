app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('art.teams', {
		url: '/teams',
		controller: 'TeamController',
		templateUrl: 'application/views/team/index.html'
	})
	.state('team', {
		url: '/w/teams/:id',
		controller: 'TeamDetailController',
		templateUrl: 'application/views/team/detail.html'
	})

}]);
