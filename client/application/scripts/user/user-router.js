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
    .state('ucoterie', {
      url: '/w/ucoteries',
      controller: 'UCoterieController',
      templateUrl: '/application/views/ucoterie.html'
    })
    .state('systemInfo', {
      url: '/w/systemInfo',
      controller: 'UCoterieController',
      templateUrl: '/application/views/coterie/systemInfo.html'
    })
    .state('hangDianInfo', {
      url: '/w/hangDianInfo',
      controller: 'UCoterieController',
      templateUrl: '/application/views/coterie/hangDianInfo.html'
    })
    .state('management_system', {
      url: '/w/team/:id',
      controller: 'MSController',
      template: '<div></div>'
    })
}])
