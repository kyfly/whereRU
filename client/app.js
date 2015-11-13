var app = angular.module('WRU', ['ui.router', 'lbServices', 'ui.materialize', 'ng.ueditor'])
  //配置路由方式
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode({
    	enabled: true,
	   	//requireBase: false
	  });
  }]);

