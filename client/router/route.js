app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('/', {
    url: "/",
    templateUrl: "/templates/index.html",
    resolve: {

    },
    controller: 'HomeController'
  })
  .state('home', {
  	url: '/home',
  	templateUrl: "/templates/user-homepage.html",
  	resolve: {

  	},
  	controller: 'UserHomeController'
  })
  .state('search', {
  	url: '/search',
  	templateUrl: '/templates/search.html',
  	resolve: {

  	},
  	controller: 'TeamController'
  })
  .state('myTeam', {
  	url: '/myTeam',
  	templateUrl: '/templates/my-team.html',
  	controller: 'MyTeamController'
  });
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $location.path('/');
  });
}]);

