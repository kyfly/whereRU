app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('/', {
    url: "/",
    templateUrl: "/templates/index.html",
    resolve: {
      messages: function (Message) {
        return Message.find();
      }
    },
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
  	resolve: {

  	},
  	controller: 'UserHomeController'
  })
  .state('search', {
  	url: '/search',
  	templateUrl: '/templates/search.html',
  	resolve: {

  	},
  	controller: 'SearchController'
  })
  .state('myTeam', {
  	url: '/myTeam',
    resolve: {
      teams: function (Team) {
        return Team.find({
          filter: 
          {
            fields: {
              id: true, 
              name: true, 
              dynamic: true,
              logoUrl:true
            }
          }
        });
      } 
    },
  	templateUrl: '/templates/team/my-team.html',
  	controller: 'MyTeamController'
  })
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $location.path('/');
  });
}]);

