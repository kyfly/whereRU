
app.controller('HomeController', ['$scope', '$http', 'Contest', '$templateCache', HomeController]);
function HomeController($scope, $http, Contest, $templateCache) {
  $scope.events = Contest.find({filter: {limit: 4}});
  $scope.collapsibleElements = [{
    icon: 'mdi-image-filter-drama',
    title: 'First',
    content: 'Lorem ipsum dolor sit amet.'
  }, {
    icon: 'mdi-maps-place',
    title: 'Second',
    content: 'Lorem ipsum dolor sit amet.'
  }, {
    icon: 'mdi-social-whatshot',
    title: 'Third',
    content: 'Lorem ipsum dolor sit amet.'
  }
  ];
}
app.controller('SignUpController', ['$scope', '$location', 'RUser', 'Auth', 'School', SignUpController]);
function SignUpController($scope, $location, RUser, Auth, School) {
  $scope.schools = School.find({
    filter: {
      fields: ['name']
    }
  });
  $scope.signUp = function () {
    RUser.create({}, $scope.user, function (res) {
      console.log(res);
      if (res.err) return;
      Auth.setUser(res.token);
      $location.path('/');
    }, function () {
    });
  }
}
app.controller('SignInController', ['$scope', '$location', 'RUser', 'Auth', SignInController]);
function SignInController($scope, $location, RUser, Auth) {
  $scope.login = function () {
    RUser.login($scope.user, function (res) {
      console.log(res);
      if (res.err) return;
      res.name = res.user.username;
      res.phone = res.user.phone;
      res.user = undefined;
      Auth.setUser(res);
      $location.path('/');
    }, function () {
    });
  }
}
app.controller('UserHomeController', ['$scope', 'Auth', UserHomeController]);
function UserHomeController($scope, Auth) {
  $scope.user = Auth.getUser();
}
app.controller('SearchController', ['$scope', SearchController]);
function SearchController($scope) {

}
app.controller('MyTeamController', ['$scope', 'Team', MyTeamController]);
function MyTeamController($scope, Team) {
  $scope.teams = Team.find({filter: {fields:['name', 'id', 'logoUrl', 'dynamic']}});
}
app.controller('ChatController', ['$scope', 'Auth', '$stateParams', function($scope, Auth, $stateParams){
  var roomId = $stateParams.id;
  var type = $stateParams.type;
  var userId = Auth.getId();
  var History = [];
  var Room;
  var rt;
  var historyFormat = function (message) {
    if (Array.isArray(message)) {
      History = message;
    }else if (History.length > 20) {
      History.shift();
      History.push(message);
    } else {
      History.push(message);
    }
    console.log(History);
    $scope.$apply(function () {
      $scope.history = History;
    });
  };
  $scope.align = function () {
    console.log('1');
    if (this.message.from === userId) {
      return true;
    }
    return false;
  };
  $scope.sendMsg = function () {
    console.log('1');
    Room.send({
      text: $scope.content,
      formUserName: Auth.getUserName()
    }, {
      receipt: true,
      transient: false,
    }, function (data) {
      historyFormat({
        form: Auth.getId(),
        msg: {
          text: $scope.content,
          formUserName: Auth.getUserName()
        }
      });
    });
  }
  createRealtimeObj(function (rt) {
    rt.room(roomId, function (room) {
      if (room) {
        Room = room;
        $scope.$apply(function () {
          $scope.room = room;
        });
        Room.log(function (history) {
          historyFormat(history);
        });
      } else {
        //非法访问
      }
    });
    rt.on('join', function () {

    })
    .on('message', function (data) {
      historyFormat(data);
    });
  });
  
  
}]);
app.controller('ChatsController', ['$scope', 'Auth', function($scope, Auth){
  //用户所有聊天室
  getRooms(function (rooms) {
    console.log(rooms);
    $scope.$apply(function () {
      $scope.rooms = rooms;
    });
  });
}])