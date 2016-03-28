var app = angular.module('app', [
	'ngResource',
	'lbServices',
	'ui.router',
	'ui.materialize',
	'ng.ueditor',
	'ng.upload',
	'ue.config'
]);
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });
}])
.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://*.etuan.org/**'
  ]);
})
.run(['$rootScope', 'Team', '$timeout', function($rootScope, Team, $timeout){
	if (localStorage.$LoopBack$currentTeamId) {
		Team.findById({
		  id: localStorage.$LoopBack$currentTeamId
		}, function (res) {
			$rootScope.teamInfo = res;
			$rootScope.accesstoken = localStorage.$LoopBack$accessTokenId;
			if (localStorage.$LoopBack$currentUserId == res.userId)
			{
			  $rootScope.teamInfo.owner = true;
			} else {
			  $rootScope.teamInfo.owner = false;
			}
		}, function (err) {
			Materialize.toast('参数不真确,即将返回首页', 2000);
			$timeout(function () {
			  window.location.href = '/';
			}, 2000);
		});
  } else {
    Materialize.toast('参数不真确,即将返回首页', 2000);
    $timeout(function () {
      window.location.href = '/';
    }, 2000);
  }
}])

