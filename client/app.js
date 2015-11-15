var app = angular.module('WRU', ['ui.router', 'lbServices', 'ui.materialize', 'ng.ueditor'])
  //配置路由方式
.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
  	enabled: true
   	//requireBase: false
  });
}])
.config(['$httpProvider', function($httpProvider) {
	var interceptor = function ($q, $rootScope, Auth) {
		return {
			'responseError': function(rejection) {
				// 错误处理
				switch(rejection.status) {
					case 401:
						$rootScope.$broadcast('auth:loginRequired');
						break;
					case 403:
						$rootScope.$broadcast('auth:forbidden');
						break;
					case 404:
						$rootScope.$broadcast('page:notFound');
						break;
					case 500:
						$rootScope.$broadcast('server:error');
						break;
				}
				return $q.reject(rejection);
			},
			'request': function (req) {
				req.params = req.params || {};
				req.params.accessToken = Auth.getToken();
				return req;
			}
		}
	}
	$httpProvider.interceptors.push(interceptor);
}]);

//$(document).ready(function(){
//  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
//  $('.modal-trigger').leanModal();
//});

