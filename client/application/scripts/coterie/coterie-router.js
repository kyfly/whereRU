app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('coteries', {
		url: '/w/coteries',
		controller: 'CoteriesController',
		templateUrl: 'application/views/coterie/index.html'
	})
	.state('coterie', {
		url: '/w/coteries/:id',
		controller: 'CoterieController',
		templateUrl: 'application/views/coterie/detail.html'
	})
}]);
