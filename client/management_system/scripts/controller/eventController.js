app.controller('EventListCtrl', ['$scope', 'Team', function ($scope, Team) {
  $scope.showSingleType = function () {
    if(type === 'all'){
      $scope.allChosen = true;
    } else {
      $scope.allChosen = false;
      $scope.chosenType = type;
    }
  }
}]);

app.controller('EventEditCtrl', ['$scope', 'Team', function ($scope, Team) {

}]);
