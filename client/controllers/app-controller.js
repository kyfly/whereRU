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
app.controller('SignUpController', ['$scope', '$location', 'RUser', 'Auth', SignUpController]);
function SignUpController($scope, $location, RUser, Auth) {
  $scope.schools = [
    {
      id: 1,
      name: 'XX大学',
      logo: '/lib/img/logo/png'
    }, {
      id: 2,
      name: 'XX大学',
      logo: '/lib/img/logo/png'
    }
  ];
  $scope.signUp = function () {
    RUser.create({}, $scope.user, function (res) {
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
      if (res.err) return;
      Auth.setUser(res.token);
      $location.path('/');
    }, function () {
    });
  }
}
app.controller('UserHomeController', ['$scope', UserHomeController]);
function UserHomeController($scope) {
  // body...
}
app.controller('SearchController', ['$scope', SearchController]);
function SearchController($scope) {

}
app.controller('MyTeamController', ['$scope', 'Team', 'Auth', MyTeamController]);
function MyTeamController($scope, Team, Auth) {
  $scope.teams = Team.find({filter: {where:{userIds: Auth.getId()}, fields:['name', 'id', 'logoUrl', 'dynamic']}});
  $scope.collapsibleElements = [{
    icon: 'mdi-image-filter-drama',
    title: '公告一',
    content: '加班.'
  }, {
    icon: 'mdi-maps-place',
    title: '公告二',
    content: '加班.'
  }, {
    icon: 'mdi-social-whatshot',
    title: '公告三',
    content: '加班.'
  }
  ];
}
app.controller('ChatController', ['$scope', 'Auth', '$stateParams', function($scope, Auth, $stateParams){
  var roomId = $stateParams.id;
  var type = $stateParams.type;
  var chat = function (rt, Room) {
    Room.log(function (history) {
      console.log(history);
    });
    rt.on('join', function () {

    })
    .on('message', function (data) {
      console.log(data);
    });
    Room.send({
      test:'nihao'
    }, {
      receipt: true,
      transient: false,
      type: 'text'
    }, function (data) {
      console.log(data);
    })
  }
  createRealtimeObj(function (rt) {
    switch(type) {
      //聊天室ID，可直接通过ID获取对象
      case 'roomId':
        rt.room(roomId, function (Room) {
          if (Room) {
            chat(rt, Room);
          } else {
            //非法访问
          }
        });
      break;
      //用户ID，私聊模式，先确定有已存在的聊天室号，如果没有则需要创建新的聊天室
      case 'userId':

      break;
    }
  });
  
  
}]);
app.controller('ChatsController', ['$scope', 'Auth', function($scope, Auth){
  //用户所有聊天室
  getRooms(function (rooms) {
    $scope.rooms = rooms;
    console.log(rooms);
    $scope.$apply();
  });
}])