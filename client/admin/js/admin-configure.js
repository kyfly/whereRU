var app = angular.module('app', ['ngResource', 'lbServices', 'ngRoute', 'ui.materialize']);
app.config(['$routeProvider', RouteConfigure]);
app.controller('AdminCtrl', ['$scope', '$timeout', '$window', '$rootScope', AdminCtrl]);
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });
}]);
app.run(['$rootScope', '$location', function ($rootScope, $location) {
	$rootScope.$on('$routeChangeStart', function (evt, next, current) {
		if (!$rootScope.access && next.$$route.originalPath !== '/eventManage/reg')
			$location.path('/eventManage/login');
	});
}]);
