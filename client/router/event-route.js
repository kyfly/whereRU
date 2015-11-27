app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  /**
   * 竞赛介绍
   * @param  {[type]}
   * @return {[type]}            
   */
  .state('eventExplain', {
    url: '/events/:id/explains',
    templateUrl: '/templates/event/explain.html',
    controller: 'EventExplainController'
  })
  /**
   * 竞赛通知
   * @param  {[type]}
   * @return {[type]}            
   */
  .state('eventMessage', {
    url: '/events/:id/messages',
    templateUrl: '/templates/event/message.html',
    controller: 'EventMessageController'
  })
  /**
   * 参赛团队
   * @param  {[type]}
   * @return {[type]}            
   */
  .state('eventTeams', {
    url: '/events/:id/teams',
    templateUrl: '/templates/event/team.html',
    controller: 'EventTeamsController'
  })
}]);

