app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  //$urlRouterProvider.when("", "/application/views/coterie/index.html");
  $stateProvider
	.state('coteries', {
		url: '/w/coteries',
		controller: 'CoteriesController',
    templateUrl: 'application/views/coterie/index.html'
	})
    .state('coteries.message1',{
      url: '/w/message1',
      controller: 'CoteriesController',
      templateUrl: 'application/views/coterie/message1.html'
  })
    .state('coteries.message2',{
      url: '/w/message2',
      controller: 'CoteriesController',
      templateUrl: 'application/views/coterie/message2.html'
    })
    .state('coteries.message3',{
      url: '/w/message3',
      controller: 'CoteriesController',
      templateUrl: 'application/views/coterie/message3.html'
    })
	.state('coterie', {
		url: '/w/coteries/:id',
		controller: 'CoterieController',
		templateUrl: 'application/views/coterie/detail.html'
	})
}]);
