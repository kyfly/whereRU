app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.when("", "/application/views/coterie/index.html");
  $stateProvider
	.state('coteries', {
		url: '/w/coteries',
		controller: 'CoteriesController',
    templateUrl: 'application/views/coterie/index.html'
	})
    .state('coteries.systemMessage',{
      url: '/systemMessage',
      controller: 'CoterieDetailController',
      templateUrl: 'application/views/coterie/systemMessage.html'
    })
    .state('coteries.userMessage',{
      url: '/userMessage/:id',
      controller: 'CoterieDetailController',
      templateUrl: 'application/views/coterie/userMessage.html'
    })
  .state('coteries.detail', {
    url: 'detail/:id',
    controller: 'CoterieDetailController'
  })
	.state('coterie', {
		url: '/w/coteries/:id',
		controller: 'CoterieController',
		templateUrl: 'application/views/coterie/detail.html'
	})
}]);
