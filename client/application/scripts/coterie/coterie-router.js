app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.when("", "/application/views/coterie/index.html");
  $stateProvider
	.state('coteries', {
		url: '/w/coteries',
		controller: 'CoteriesController',
    templateUrl: 'application/views/coterie/index.html'
	})
  .state('coteries.detail', {
    url: '/:id',
    controller: 'CoterieController',
    templateUrl: 'application/views/coterie/detail.html'
  })
	.state('coteries.edit', {
		url: '/:id/edit',
		controller: 'ArticleController',
		templateUrl: 'application/views/coterie/edit.html'
	})
}]);
