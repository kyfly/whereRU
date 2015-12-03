app.controller('HomeController', ['$scope', '$http', 'Auth', 'ContestOrg', 'Message', 'Contest', '$templateCache', HomeController]);
function HomeController($scope, $http, Auth, ContestOrg, Message, Contest, $templateCache) {
  $scope.messages = Contest.find({
      include:[{
        relation: 'contestOrg',
        scope: {
          where: {'phone': 17764592171}
        }
      },{
        relation: 'messages',
        scope: {
          order: 'id DESC',
          limit: 3
        }
      }]
    });
  Contest.getMySchoolEvents({
   school: Auth.getSchool(),
   filter: {
    fields: ['id', 'name']
   }
  }, function (res) {
    $scope.events = res.events;
  });
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
      res.school = res.user.school;
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
app.controller('MyTeamController', ['$scope', 'Team', 'Auth', '$rootScope', MyTeamController]);
function MyTeamController($scope, Team, Auth, $rootScope) {
  $scope.chatCount = [];
  $scope.teams = Team.find({
    filter: 
    {
      fields:['name', 'id', 'logoUrl', 'dynamic', 'chatId'],
      where: {userIds: Auth.getId()}
    }
  });
  //监听消息
  createRealtimeObj(function (rt) {
    rt.on('message', function (message) {
      $scope.$apply(function () {
        $scope.chatCount[message.cid] = $scope.chatCount[message.cid] + 1;
      });
    });
  });
}
app.controller('ChatController', ['$scope', 'Auth', '$stateParams', function($scope, Auth, $stateParams){
  var roomId = $stateParams.id;
  var type = $stateParams.type;
  var userId = Auth.getId();
  var History = [];
  var Room;
  var rt;
  $scope.userId = userId;
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
  $scope.sendMsg = function () {
    Room.send({
      text: $scope.content,
      formUserName: Auth.getUserName()
    }, {
      receipt: true,
      transient: false,
    }, function (data) {
      historyFormat({
        from: Auth.getId(),
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
      console.log(data);
      $scope.$emit(roomId, data);
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