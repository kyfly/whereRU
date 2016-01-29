app.controller('ActivitiesController', ['$scope', 'Activity', function($scope, Activity){
	Activity.find({},function(res){
   	console.log(res);
   	$scope.activityItems = res ;
  },function(){
  
  });
}]);
app.controller('ActivityController', ['$scope', function($scope){

}])