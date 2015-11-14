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
  	templateUrl: '/templates/my-team.html',
  	controller: 'MyTeamController'
  })
  .state('viewTeam', {
    url: '/myTeam/:id',
    resolve: {
      team: function ($stateParams, Team) {
        console.log($stateParams.id);
        return Team.findById({
          id: $stateParams.id,
          filter: {
            include: ['histories', 'messages', 'members', 'projects']
          }
        })
      }
    },
    templateUrl: '/templates/view-team.html',
    controller: 'ViewTeamController'
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

