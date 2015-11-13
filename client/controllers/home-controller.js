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
	//$scope.teamConfig = Ueditor.config;
	$scope.schools = [
    {
    	id: 1,
      name:'XX大学',
      logo:'/lib/img/logo/png'
    },{
    	id: 2,
      name:'XX大学',
      logo:'/lib/img/logo/png'
    }
	];
	$scope.team = {
		pics: []
	};
	$scope.logoLoad = function () {
		var e = document.getElementById('logo').files;
		uploadFile(e, function (res) {
			$scope.team.logoUrl = res[0].url;
			$scope.logo = 'success';
		});	
	}
	$scope.picLoad = function () {
		var e = document.getElementById('pic').files;
		uploadFile(e, function (res) {
			for (r in res) {
				$scope.team.pics.push(res[r].url);
			}
			$scope.pic = 'success';
		});	
	}
	$scope.submit = function () {
		console.log($scope.team);
	}
	//$('select').material_select();
}
function FindTeamController ($scope) {
	console.log($scope);
}
function uploadFile (files, callback) {
	var formData = new FormData();
	for (var i = 0; i < files.length; i++) {
    file = files[i];
    formData.append(file.name, file);
	}
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	  if(xhr.readyState === 4 && xhr.status === 200)
	  {
	    callback(JSON.parse(xhr.responseText));
	  }
	}
	xhr.open("POST", "/ue/uploads?action=uploadimage&dynamicPath=team&files=" + files.length, true);
	xhr.send(formData);
}