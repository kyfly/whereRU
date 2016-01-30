app.controller('ActivitiesController', ['$scope', 'Activity', function($scope, Activity){
	$scope.currentActivity = undefined;
	Activity.find({},function(res){
   	$scope.currentActivity = res[0];
   	$scope.activityItems = res ;
  },function(){
  
  });
  $scope.changeCurrentActivity = function () {
  	$scope.currentActivity = this.activityItem;
  }
}]);
app.controller('ActivityController', ['$scope', function($scope){

}])