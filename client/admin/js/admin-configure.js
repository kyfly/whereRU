var app = angular.module('app', ['ngResource', 'ngRoute']);
app.config(['$routeProvider', RouteConfigure]);
app.controller('AdminCtrl', ['$scope', '$timeout', '$window', AdminCtrl]);
