app.controller('HomeController', ['$scope', 'teams', '$http', '$sce', '$templateCache', HomeController])
.controller('UserHomeController', ['$scope', UserHomeController])
.controller('TeamController', ['$scope', TeamController])
.controller('MyTeamController', ['$scope', MyTeamController])
.controller('CreateTeamController', ['$scope', 'Ueditor', CreateTeamController])
.controller('FindTeamController', ['$scope', FindTeamController])
function HomeController($scope, teams, $http, $sce, $templateCache) {
	$scope.teams = teams;
	$scope.getExplain = function () {
		that = this;
		if (!this.team.explain) {
			that.team.explain = $sce.trustAsHtml("dend");
			$http.get(this.team.explainUrl).success(function (html) {
				that.team.explain = $sce.trustAsHtml(html);
			})
		}
	}
}
function UserHomeController ($scope) {
	// body...
}
function TeamController ($scope) {
	
}
function MyTeamController ($scope) {
	// body...
}
function CreateTeamController ($scope, Ueditor) {
	$scope.teamConfig = Ueditor.config;
	$scope.selectC = function () {
		$scope.schools = ['s','d','a'];

	}
	//$('select').material_select();
}
function FindTeamController ($scope) {
	console.log($scope);
}