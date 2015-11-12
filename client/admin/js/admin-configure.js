var app = angular.module('app', ['ngResource', 'ngRoute']);
app.config(['$routeProvider', RouteConfigure]);
app.controller('AdminCtrl', ['$scope', '$timeout', '$window', AdminCtrl]);
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
    //requireBase: false
  });
}]);
