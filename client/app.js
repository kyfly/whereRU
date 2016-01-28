var app = angular.module('WRU', ['ui.router', 'lbServices', 'ui.materialize'])
  //配置路由方式
.config(['$locationProvider', '$urlRouterProvider', function ($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode({
  	enabled: true
   	//requireBase: false
  });
  $urlRouterProvider.otherwise('/');
}])
.run(['$rootScope', function ($rootScope) {
	$rootScope.goback = function () {
		window.history.back();
	}
}])
// .config(['$httpProvider', function($httpProvider) {
// 	var interceptor = function ($q, $rootScope, Auth) {
// 		return {
// 			'responseError': function(rejection) {
// 				// 错误处理
// 				switch(rejection.status) {
// 					case 401:
// 						$rootScope.$broadcast('auth:loginRequired');
// 						break;
// 					case 403:
// 						$rootScope.$broadcast('auth:forbidden');
// 						break;
// 					case 404:
// 						$rootScope.$broadcast('page:notFound');
// 						break;
// 					case 500:
// 						$rootScope.$broadcast('server:error');
// 						break;
// 				}
// 				return $q.reject(rejection);
// 			},
// 			'request': function (req) {
// 				req.params = req.params || {};
// 				req.params.accessToken = Auth.getToken();
// 				return req;
// 			}
// 		}
// 	};
// 	$httpProvider.interceptors.push(interceptor);
// }]);


