app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.when("", "/application/views/coterie/index.html");
  $stateProvider
	.state('coteries', {
		url: '/w/coteries',
		controller: 'CoteriesController',
    templateUrl: 'application/views/coterie/index.html'
	})
	.state('coteries.edit', {
		url: '/:id/articles/edit',
		controller: 'ArticlesController',
		templateUrl: 'application/views/coterie/edit.html'
	})
	.state('article', {
		url: '/w/coteries/:id/articles/:fk',
		controller: 'ArticleController',
		templateUrl: 'application/views/coterie/article.html'
	})
  .state('coteries.articles', {
    url: '/:id',
    controller: 'CoterieController',
    templateUrl: 'application/views/coterie/detail.html'
  })
	
}]);
