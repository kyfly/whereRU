/**
 * 团队总页
 */
app.controller('ViewTeamController', ['$scope', 'Team', '$stateParams', ViewTeamController]);
function ViewTeamController($scope, Team, $stateParams) {
	Team.findById({
    id: $stateParams.id,
    filter: {fields: ['id', 'name', 'logoUrl','dynamic', 'chatId']}
  }, function (res) {
    $scope.team = res;
  });
}
/**
 * 创建团队
 * Team model 数据库Team模型
 * schools promise 所有学校名称查询结果
 */
app.controller('CreateTeamController', ['$scope', 'Team', 'School', '$location', 'Auth', CreateTeamController]);
function CreateTeamController($scope, Team, School, $location, Auth) {
  $scope.schools = School.find();
  $scope.teamTypes = ['竞赛', '学习', '体育', '创业', '旅游', '桌游', '聊天'];
  $scope.team = {
    pics: []
  };
  $scope.logoLoad = function () {
    var e = document.getElementById('logo').files;
    uploadFile(e, function (res) {
      $scope.team.logoUrl = res[0].url;
      $scope.logo = 'success';
      $scope.$apply();
    });
  };
  $scope.picLoad = function () {
    var e = document.getElementById('pic').files;
    uploadFile(e, function (res) {
      for (r in res) {
        $scope.team.pics.push(res[r].url);
      }
      $scope.pic = 'success';
      $scope.$apply();
    });
  };
  $scope.submit = function () {
    if (!Auth.getId)
      return;
    //为团队建一个聊天室
    createTeamRoom($scope.team.name, function (result) {
      //聊天室ID
      $scope.team.chatId = result.id;
      $scope.team.rUserId = Auth.getId();
      $scope.team.created = new Date();
      $scope.team.userIds = [Auth.getId()]
      //保存团队信息
      Team.create({}, $scope.team, function (res) {
        Materialize.toast('恭喜你！！！团队创建成功', 4000);
        //团队创建成功后应该做什么？
      })
    }, function () {
    });
  };
  function createTeamRoom(name, cb) {
    createRealtimeObj(function (rt) {
      rt.room({
        members: [Auth.getId()],
        name: name,
        attr: {
          type: 'team',
          names: [Auth.getUserName()]
        }
      }, function (result) {
        cb (result);
      });
    });
  }
}
/**
 * 查找团队
 */
app.controller('FindTeamController', ['$scope', 'Team', 'Auth', FindTeamController]);
function FindTeamController($scope, Team, Auth) {
  $scope.teams = Team.find({
    filter: 
    {
      fields: ['id', 'name', 'logoUrl'],
      where: {
        'userIds': {neq: Auth.getId()}
      }
    }
  });
}

/**
 * 消息管理
 * @param  {[type]} ){               }] [description]
 * @return {[type]}     [description]
 */
app.controller('TeamMessageController', ['$scope', '$stateParams', TeamMessageController]);
function TeamMessageController($scope, $stateParams) {
  $scope.teamId = $stateParams.id;
  $scope.announcementType = ['文本', '表单'];
  $scope.announcement = {
    pics: []
  };
}
/**
 * 成员管理
 * @param  {[type]} ){               }] [description]
 * @return {[type]}     [description]
 */
app.controller('TeamMemberController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.teamId = $stateParams.id;
}]);
/**
 * 介绍信息管理
 * @param  {[type]} ){               }] [description]
 * @return {[type]}     [description]
 */
app.controller('TeamInfoController', ['$scope','Team','$stateParams',TeamInfoController]);
  function TeamInfoController($scope, Team, $stateParams) {
    $scope.teamId = $stateParams.id;
    Team.findById({
      id: $stateParams.id,
      filter: {fields: ['id', 'name', 'dynamic', 'logoUrl']}
    }, function (res) {
      $scope.team = res;
    });
    $scope.logoLoad = function () {
      var e = document.getElementById('logo').files;
      uploadFile(e, function (res) {
        $scope.team.logoUrl = res[0].url;
        $scope.logo = 'success';
        $scope.$apply();
      });
    };
    $scope.picLoad = function () {
      var e = document.getElementById('pic').files;
      uploadFile(e, function (res) {
        for (r in res) {
          $scope.team.pics.push(res[r].url);
        }
        $scope.pic = 'success';
        $scope.$apply();
      });
    };
  }

/**
 * 项目管理
 * @param  {[type]} ){               }] [description]
 * @return {[type]}     [description]
 */
app.controller('TeamProjectController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.teamId = $stateParams.id;
}]);
/**
 * 成员列表
 * @param  {[type]} $scope          [description]
 * @param  {[type]} $stateParams){               $scope.teamId [description]
 * @return {[type]}                 [description]
 */
app.controller('TeamMembersController', ['$scope', '$stateParams', function($scope, $stateParams){
  $scope.teamId = $stateParams.id;
}]);
/**
 * 团队介绍列表
 * @param  {[type]} $scope          [description]
 * @param  {[type]} $stateParams){               $scope.teamId [description]
 * @return {[type]}                 [description]
 */
app.controller('TeamExplainController', ['$scope', '$stateParams', 'Team', function($scope, $stateParams, Team){
  $scope.teamId = $stateParams.id;
  Team.findById({
    id: $stateParams.id, 
    filter: {
      include: ['members']
    }
  }, function (res) {
    $scope.team = res;
  });
}]);
/**
 * [description]
 * @param  {[type]} $scope          [description]
 * @param  {[type]} $stateParams    [description]
 * @param  {[type]} Team            [description]
 * @param  {[type]} Auth){                       var           roomId [description]
 * @param  {[type]} options.userId: Auth.getId()  [description]
 * @param  {[type]} function        (res)         {                                               createRealtimeObj(function (rt) {      console.log(Auth.getId());      rt.room(roomId, function (Room) {        console.log(Room);        Room.add(Auth.getId())        Room.update({                  })      });    });  } [description]
 * @param  {[type]} function        (res)         {                   });}]       [description]
 * @return {[type]}                 [description]
 */
app.controller('JoinTeamController', ['$scope', '$stateParams', 'Team', 'Auth', function($scope, $stateParams, Team, Auth){
  var roomId = $stateParams.roomId;
  $scope.teamId = $stateParams.id;

  Team.members.create({
    id: $stateParams.id
  },{
    userId: Auth.getId()
  }, function (res) {
    createRealtimeObj(function (rt) {
      console.log(Auth.getId());
      rt.room(roomId, function (Room) {
        console.log(Room);
        Room.add(Auth.getId());
        Room.attr.names.push(Auth.getUserName());
        names = Room.attr.names;
        Room.update({
          attr: {
            //这里添加加入团队的用户姓名
            names: names
          }
        })
      });

    });
  }, function (res) {

  });

}])
/**
 * [uploadHtml description]
 * @param  {[type]}   content  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function uploadHtml(content, callback) {
  var Xhr = new XMLHttpRequest();
  //var formData = new FormData();
  Xhr.onreadystatechange = function () {
    if (Xhr.readyState === 4) {
      if (Xhr.status === 200) {
        callback(JSON.parse(Xhr.responseText));
      }
    }
  };
  // formData.append("content=", content);
  Xhr.open('POST', '/ue/uploads?action=uploadtext&dynamicPath=html&files=1', true);
  Xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  Xhr.send('content=' + content);
}
