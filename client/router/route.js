app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('/', {
    url: "/",
    templateUrl: "/templates/index.html",
    resolve: {},
    controller: 'HomeController'
  });
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function ($injector, $location) {
    $location.path('/');
  });
}]);

