app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('confirmSchool', {
      url: '/w/confirmSchool',
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
    .state('info', {
      url: '/u/info',
      controller: 'UserInfoController',
      templateUrl: '/application/views/user/info.html'
    })
    .state('auth', {
      url: '/u/auth',
      controller: 'AuthController',
      templateUrl: '/application/views/user/auth.html'
    })
    .state('activityResult', {
      url: '/u/results/:id/:type',
      controller: 'ActivityResultController',
      templateUrl: '/application/views/user/activity-result.html'
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
