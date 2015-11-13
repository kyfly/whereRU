app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('/', {
    url: "/",
    templateUrl: "/templates/index.html",
    resolve: {
      teams: function (Team) {
        return Team.find();
      }
    },
    controller: 'HomeController'
  })
  .state('home', {
  	url: '/home',
  	templateUrl: "/templates/user-home.html",
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
  })
  .state('createTeam', {
    url: '/myTeam/createTeam',
    templateUrl: '/templates/create-team.html',
    resolve: {

    },
    controller: 'CreateTeamController'
  }) 
  .state('findTeam', {
    url: '/myTeam/findTeam',
    templateUrl: '/templates/find-team.html',
    resolve: {

    },
    controller: 'FindTeamController'
  })
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $location.path('/');
  });
}]);

