app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.when("", "/application/views/coterie/index.html");
  $stateProvider
	.state('coteries', {
		url: '/w/coteries',
		controller: 'CoteriesController',
    templateUrl: 'application/views/coterie/index.html'
	})
  .state('coteries.articles', {
    url: '/:id',
    controller: 'CoterieController',
    templateUrl: 'application/views/coterie/detail.html'
  })
	.state('edit', {
      url: '/w/articles/:id/edit',
      controller: 'CoterieController',
      templateUrl: 'application/views/coterie/edit.html'
    })
  .state('coterie', {
    url: '/w/coteries/:id/articles',
    controller: 'CoterieController',
    templateUrl: 'application/views/coterie/detail.html'
  })

	.state('article', {
    url: '/w/articles/:id',
    controller: 'ArticleController',
    templateUrl: 'application/views/coterie/article.html'
  })
}]);
