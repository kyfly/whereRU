app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('confirmSchool', {
      url: '/u/confirmSchool',
      controller: 'ConfirmSchoolController',
      templateUrl: 'application/views/confirm-school.html'
    })
    .state('register', {
      url: '/u/register',
      controller: 'RegisterController',
      templateUrl: 'application/views/user/register.html'
    })
    .state('index', {
  		url: '/',
  		controller: 'HomeController',
  		templateUrl: '/application/views/index.html'
  	})
    .state('home', {
      url: '/u/home',
      controller: 'UserController',
      templateUrl: '/application/views/user/index.html'
    })
    .state('detail', {
      url: '/u/:id',
      controller: 'UserDetailController',
      templateUrl: '/application/views/user/detail.html'
    })
    .state('info', {
      url: '/u/info',
      controller: 'UserInfoController',
      templateUrl: '/application/views/user/info.html'
    })
    .state('retrieve', {
      url: '/u/retrieve',
      controller: 'RetController',
      templateUrl: '/application/views/user/retrieve.html'
    })
    .state('auth', {
      url: '/u/auth',
      controller: 'AuthController',
      templateUrl: '/application/views/user/auth.html'
    })
    .state('bind', {
      url: '/u/bind',
      controller: 'BindController',
      templateUrl: '/application/views/user/bind.html'
    })
    .state('activityResult', {
      url: '/u/results/:id/:type',
      controller: 'ActivityResultController',
      templateUrl: '/application/views/user/activity-result.html'
    })
    .state('orgLogin', {
      url: '/u/orgLogin',
      controller: 'OrgLoginController',
      templateUrl: '/application/views/user/org-user-login.html'
    })
    .state('MS', {
      url: '/w/team/:id',
      controller: 'MSController',
      template: '<div></div>'
    })
    .state('art', {
      url: '/w',
      controller: 'ARTController',
      template: '<div ui-view></div>'
    })

}]);
