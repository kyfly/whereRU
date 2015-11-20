app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('/', {
    url: "/",
    templateUrl: "/templates/index.html",
    controller: 'HomeController'
  })
  .state('signUp', {
    url: '/signUp',
    templateUrl: '/templates/sign-up.html',
    controller: 'SignUpController'
  })
  .state('signIn', {
    url: '/login',
    templateUrl: '/templates/sign-in.html',
    controller: 'SignInController'
  })
  .state('home', {
  	url: '/home',
  	templateUrl: "/templates/user.html",
  	controller: 'UserHomeController'
  })
  .state('search', {
  	url: '/search',
  	templateUrl: '/templates/search.html',
  	controller: 'SearchController'
  })
  .state('myTeam', {
  	url: '/myTeam',
  	templateUrl: '/templates/team/team.html',
  	controller: 'MyTeamController'
  })
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $location.path('/');
  });
}]);

