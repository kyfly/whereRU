app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  /**
   * 创建团队
   * @param  {[type]}
   * @return {[type]}
   */
  .state('createTeam', {
    url: '/myTeam/createTeam',
    templateUrl: '/templates/team/create.html',
    controller: 'CreateTeamController'
  })
  /**
   *
   * @type {String}
   * 发现团队
   */
  .state('findTeam', {
    url: '/myTeam/findTeam',
    templateUrl: '/templates/team/find.html',
    controller: 'FindTeamController'
  })
  /**
   * 团队总页面
   */
  .state('viewTeam', {
    url: '/myTeam/:id',
    templateUrl: '/templates/team/view.html',
    controller: 'ViewTeamController'
  })
  /**
   * 团队管理页面
   */
  .state('teamManage', {
    abstract: true,
    url: '/myTeam/:id/manage',
    template: "<div ui-view></div>"
  })
  /**
   * 通知管理页面
   */
  .state('teamManage.messages', {
    url: '/messages',
    templateUrl: '/templates/team/message.html',
    controller: 'TeamMessageController'
  })
  /**
   * 成员管理页面
   */
  .state('teamManage.members', {
    url: '/members',
    templateUrl: "/templates/team/member.html",
    controller: 'TeamMemberController'
  })
  /**
   * 信息管理页面
   */
  .state('teamManage.info', {
    url: '/info',
    templateUrl: "/templates/team/info.html",
    controller: 'TeamInfoController'
  })
  /**
   * 项目管理页面
   */
  .state('teamManage.project', {
    url: '/projects',
    templateUrl: "/templates/team/project.html",
    controller: 'TeamProjectController'
  })
  /**
   * 所有成员信息管理页面
   */
  .state('teamMembers', {
    url: '/myTeam/:id/members',
    templateUrl: "/templates/team/members.html",
    controller: 'TeamMembersController'
  })
  /**
   * 团队介绍页面
   */
  .state('teamExplain', {
    url: '/teams/:id',
    templateUrl: "/templates/team/explain.html",
    controller: 'TeamExplainController'
  })
  /**
   * 团队展示页面
   */
  .state('teamExplainMore', {
    url: '/teams/:id/more',
    templateUrl: "/templates/team/more.html",
    controller: 'TeamMoreController'
  })
  /**
   * 加入团队
   */
  .state('join', {
    url: '/teams/:id/join/:roomId',
    templateUrl: 'templates/team/join.html',
    controller: 'JoinTeamController'
  })
}]);

