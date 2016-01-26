app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
		url: '/w/login',
		controller: 'LoginController',
		templateUrl: 'application/views/login.html'
	})
	.state('confirmSchool', {
		url: '/w/confirmSchool',
		controller: 'ConfirmSchoolController',
		templateUrl: 'application/views/confirm-school.html'
	})
	.state('register', {
		url: '/w/register',
		controller: 'RegisterController',
		templateUrl: 'application/views/register.html'
	})
	.state('index', {
		url: '/',
		controller: 'TestController',
		templateUrl: '/application/views/index.html'
	})
    .state('management_system', {
      url: '/management_system/*',
      controller: 'MSController',
      template: '<div></div>'
    })
}])
