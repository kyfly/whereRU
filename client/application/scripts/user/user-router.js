app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('confirmSchool', {
      url: '/w/confirmSchool',
      controller: 'ConfirmSchoolController',
      templateUrl: 'application/views/confirm-school.html'
    })
    .state('register', {
      url: '/w/register',
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
    .state('management_system', {
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
