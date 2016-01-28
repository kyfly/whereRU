app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('teams', {
		url: '/w/teams',
		controller: 'TeamsController',
		templateUrl: 'application/views/team/index.html'
	})
	.state('team', {
		url: '/w/teams/:id',
		controller: 'TeamController',
		templateUrl: 'application/views/team/detail.html'
	})
}]);
