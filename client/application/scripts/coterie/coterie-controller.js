
app.controller('CoteriesController', ['$scope', function($scope){
  $scope.sidebars = [
    {
      'id': 'message1',
      'display_name': '消息1',
      'url': '/w/message1',
      'uiSref':'coteries.message1'
    },
    {
      'id': 'message2',
      'display_name': '消息2',
      'url': '/w/message2',
      'uiSref':'coteries.message2'
    },
    {
      'id': 'message3',
      'display_name': '消息3',
      'url': '/w/message3',
      'uiSref':'coteries.message3'
    }
  ];
}]);

