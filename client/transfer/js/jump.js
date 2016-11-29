/**
 * Created by 瑜超 on 2016/8/22.
 */
var app=angular.module('myapp',[]);
app.config(['$locationProvider',function($locationProvider){
    $locationProvider.html5Mode({enable:true,requireBase:false});

}]);
app.controller('JumpController',['$location','$scope',function($location,$scope){
    var jumplist={};

    $scope.confirm=function(){
       var postData={
           teamId:$scope.jumplist.teamId,
           media_id:$location.path().split("/")[2],
           token:$location.path().split("/")[3]
       }
        $http.post("/weixiao?type=configSave",postData).success(function(){
          alert('成功');
        }).error(function(data,status){

        });

    };

}]);