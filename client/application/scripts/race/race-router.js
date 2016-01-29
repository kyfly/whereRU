app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('art.races', {
		url: '/races',
		controller: 'RacesController',
		templateUrl: 'application/views/race/index.html'
	})
	.state('race', {
		url: '/w/races/:id',
		controller: 'RaceController',
		templateUrl: 'application/views/race/detail.html'
	})
}]);