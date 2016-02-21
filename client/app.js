var app = angular.module('WRU', ['ui.router', 'lbServices', 'ui.materialize', 'ng.ueditor'])

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
		
	});
	
}])
.controller('HeaderController', ['$scope', '$rootScope', "User",function ($scope, $rootScope, User){
	try {
		var token = JSON.parse(localStorage.$LoopBack$currentUserToken);
		token.user.id = token.userId;
		$rootScope.$currentUser = token.user;
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
	$scope.pullTeams = function () {
		User.prototype_get_teams({
			id: $scope.$currentUser.id
		}, function(teams){
			$scope.teams = teams;
			console.log($scope.teams);
		})
	}
	$scope.changeTeams = function () {
		localStorage.$LoopBack$accessTeamId = this.team.id;
	}
}])
.controller('HomeController', ['$scope', function($scope){
	
}])
.controller('BottomBarController', ['$scope', '$location', function($scope, $location){
	
	$scope.menus = [{
		name: '圈子',
		path: '/w/coteries',
		active: false
	},{
		name: '校园',
		path: '/w/activities',
		active: false
	},{
		name: '我的',
		path: '/u/home',
		active: false
	}];
	if($location.path().match(/^\/w\/coteries/)) {
		$scope.menus[0].active = true;
	} else if ($location.path().match(/^\/u\//)) {
		$scope.menus[2].active = true;
	} else {
		$scope.menus[1].active = true;
	}
	$scope.changePage = function () {
		$scope.menus.forEach(function(menu){
			menu.active = false;
		});
		this.menu.active = true;
		$location.path(this.menu.path)
	}
}]);


