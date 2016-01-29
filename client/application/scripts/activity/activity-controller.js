
app.controller('ActivitiesController', ['$scope', function($scope){

}])
app.controller('ActivitieController', ['$scope', function($scope){

}])
app.controller('campusEventCtrl', ['$scope', 'Activity', function($scope, Activity){
  Activity.find({},function(res){
   console.log(res);
   $scope.activityItems = res ;
   },function(){
   }
);
Activity.findById({},function(res){
console.log(res);
$scope.detailUrl = res.explainUrl;
}
);
}])
