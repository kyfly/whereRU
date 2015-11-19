app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  /**
   * 创建团队
   * @param  {[type]}
   * @return {[type]}            
   */
  .state('createTeam', {
    url: '/myTeam/createTeam',
    templateUrl: '/templates/team/create-team.html',
    resolve: {
      schools: function (School) {
        return School.find({filter: {fields: {name: true}}})
      }
    },
    controller: 'CreateTeamController'
  }) 
  /**
   * 
   * @type {String}
   */
  .state('findTeam', {
    url: '/myTeam/findTeam',
    templateUrl: '/templates/team/find-team.html',
    resolve: {

    },
    controller: 'FindTeamController'
  })
  /**
   * 
   */
  .state('viewTeam', {
    url: '/myTeam/:id',
    resolve: {
      team: function ($stateParams, Team) {
        return Team.findById({
          id: $stateParams.id,
          filter: {
            include: ['histories', 'messages', 'members', 'projects']
          }
        })
      }
    },
    templateUrl: '/templates/team/view-team.html',
    controller: 'ViewTeamController'
  })
  
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $location.path('/');
  });
}]);

