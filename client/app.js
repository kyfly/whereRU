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
	function IsPC()
	{
		var userAgentInfo = navigator.userAgent;
		var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
		}
		return flag;
	}
	$rootScope.mediaIsPC = IsPC();
	$rootScope.$on('auth:loginRequired', function () {
		$rootScope.loginShow = true;
	});
	$rootScope.cancelLogin = function () {
		$rootScope.loginShow = false;
	};
	$rootScope.focus = function () {
    $rootScope.$broadcast('hiddenBottomBar');
  };
  $rootScope.blur = function () {
    $rootScope.$broadcast('showBottomBar');
  };
  $rootScope.errorTip = function (err) {
    Materialize.toast(err.data.error.message + '<br>' +'好像遇到了一点小问题,请您联系我们哦', 4000);
  }
}])
.controller('HeaderController',
	['$scope', '$rootScope', "User", "$location", "$window",
	function ($scope, $rootScope, User, $location, $window){
	try {
		var token = JSON.parse(localStorage.$LoopBack$currentUserToken);
		token.user.id = token.userId;
		$rootScope.$currentUser = token.user;
		if (new Date().getTime() - new Date(token.created).getTime() > token.ttl * 1000) {
			Materialize.toast('你的TOKEN已失效,你需要重新登录', 2000);
		} else {
			$rootScope.username = token.user.name;
		}
	} catch (err) {
		console.log(err);
	}
	$scope.pullTeams = function () {
		User.prototype_get_teams({
			id: $scope.$currentUser.id
		}, function(teams){
			$scope.teams = teams;
		})
	}
	$scope.logOut = function () {
		$rootScope.$currentUser = null;
		localStorage.$LoopBack$currentUserToken = '';
		localStorage.$LoopBack$accessTokenId = '';
		$rootScope.username = false;
		Materialize.toast('退出成功', 2000);
		$location.path("/w/activities");
	}
	$scope.goLogin = function (){
    if (!$scope.$currentUser) {
      return $scope.$emit('auth:loginRequired');
    }
  }
}])
.controller('BottomBarController', ['$scope', '$location', '$rootScope', '$window',
	function($scope, $location, $rootScope, $window){
	$scope.$on('$stateChangeStart', function(evt, next, current) {
		$scope.bottomBar = true;
		if (!$rootScope.mediaIsPC && next.name === 'index') {
			$location.path('/w/activities');
		}
		$scope.menus.forEach(function(menu){
			menu.active = false;
		});

		if($location.path().match(/^\/w\/coteries/)) {
			$scope.menus[0].active = true;
		} else if ($location.path().match(/^\/u\//)) {
			$scope.menus[2].active = true;
		} else {
			$scope.menus[1].active = true;
		}
	});
	$rootScope.$on('hiddenBottomBar', function () {
		$scope.bottomBar = false;
	});
	$rootScope.$on('showBottomBar', function () {
		$scope.bottomBar = true;
	});

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
	$scope.goback = function () {
		$window.history.back();
	}
}])
.controller('HomeController', ['$scope', 'Activity', 'Race',function($scope, Activity, Race){
	var tenDay = new Date() - 10*24*3600;
	var filter = {
		where: {
			created: {
				lt: tenDay
			}
		},
		limit: 8,
		order: 'readers DESC'
	};
	Activity.find({
		filter: filter
	}, function (res) {
		$scope.activities = res;
	});
	Race.find({
		filter: filter
	}, function (res) {
		$scope.races = res;
	});
		//首页移动动画 hear为当前展示 n为总张数
	var time1;
	function move(hear,n){
		var P=document.getElementsByClassName("desc");
		P[hear].className="desc p2";
		P[(hear+1)%n].className="desc p3";
		P[((hear-1)%n+n)%n].className="desc p0";
		P[((hear-2)%n+n)%n].className="desc p1";
	}
	function headtra(n){//动画n为图片数量
		var P=document.getElementsByClassName("desc");
		var show= 1,i;
		P[0].className="desc p1";
		P[1].className="desc p0";
		P[2].className="desc p2";
		for(i=0;i<3;i++){
			P[i].style.transition="all 1.5s ease 0s";
		}
		for(i=3;i<n;i++){
			P[i].className="desc p3";
			P[i].style.transition="all 1.6s ease 0s";
		}
		time1=setInterval(function(){
			move(show,n);
			show--;
			if(show<0){
				show=n-1;
			}
		},5000);
	}
	headtra(5);
	$scope.$on("$destroy", function() {
		clearInterval(time1);
	})
}]);

