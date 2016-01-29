var app = angular.module('app', ['ngResource', 'lbServices', 'ui.router', 'ui.materialize', 'ng.ueditor']);
app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });
}]);

