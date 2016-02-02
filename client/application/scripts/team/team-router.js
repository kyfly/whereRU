app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('art.teams', {
		url: '/teams',
		controller: 'TeamsController',
		templateUrl: 'application/views/team/index.html'
	})
	.state('create', {
		url: '/w/teams/create',
		controller: 'TeamsController',
		templateUrl: 'application/views/team/create.html'
	})
	.state('team', {
		url: '/w/teams/:id',
		controller: 'TeamController',
		templateUrl: 'application/views/team/detail.html'
	})
}]);
