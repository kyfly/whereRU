app.controller('LoginController', ['User', '$scope', function(User, $scope){
	$scope.login = function () {
		User.login({
			phone: "15456",
			password: "54",
			a: {
				a:c
			}
		}, function (data) {
 
		});
	}
}])
app.controller('ConfirmSchoolController', ['User', '$scope', function(User, $scope){
	$scope.confirm = function () {
	
		User.confirmSchool({id: localStorage['$LoopBack$currentUserId']},$scope.user, function () {

		});
	}
}])
app.controller('RegisterController', ['User', function(){
	
}])
app.controller('TestController', ['User', function(){
	
}])