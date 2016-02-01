var app = angular.module('WRU', ['ui.router', 'lbServices', 'ui.materialize'])

  //配置路由方式
.config(['$locationProvider', '$urlRouterProvider', function ($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode({
  	enabled: true
   	//requireBase: false
  });
  $urlRouterProvider.otherwise('/');
}])
.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://*.etuan.org/**'
  ]);
})
.run(['$rootScope', function ($rootScope) {
	$rootScope.$on('$stateChangeStart', function(evt, next, current) {
		if (window.document.getElementById('loginForm'))
			window.document.getElementById('loginForm').style.display = "none";
	});
	$rootScope.goback = function () {
		window.history.back();
	}
	$rootScope.goSignIn = function () {
		window.document.getElementById('loginForm').style.display = "block";
	};
	window.document.getElementById('doc').onclick = function () {
		if (window.document.getElementById('loginForm').style.display === "block") {
			window.document.getElementById('loginForm').style.display="none"
		}
	};
}])
.controller('HeaderController', ['$scope', '$rootScope', function ($scope, $rootScope){
	try {
		var token = JSON.parse(localStorage.$LoopBack$currentUserToken);
		$rootScope.$currentUser = token.user;
		console.log(new Date().getTime() - new Date(token.created).getTime());
		if (new Date().getTime() - new Date(token.created).getTime() > token.ttl * 1000) {
			Materialize.toast('你的TOKEN已失效,你需要重新登录', 4000);
		} else {
			$rootScope.username = token.user.name;
		}
	} catch (err) {
		console.log(err);
	}
	$scope.$on('auth:loginRequired', function () {
		if (window.document.getElementById('loginForm').style.display === "block") {
			Materialize.toast('验证失败,请检查是否输入正确', 4000);
		} else if (localStorage.$LoopBack$accessTokenId) {
			Materialize.toast('你需要重新登录或者可能没有权限访问', 4000);
		} else {
			$scope.goSignIn();
		}
	});
}])
.controller('HomeController', ['$scope', function($scope){
	
}])


