/**
 * 团队总页
 */
app.controller('ViewTeamController', ['$scope', 'Team', '$stateParams', ViewTeamController]);
function ViewTeamController($scope, Team, $stateParams) {
	Team.findById({
    id: $stateParams.id,
    filter: {fields: ['id', 'name', 'logoUrl','dynamic']}
  }, function (res) {
    $scope.team = res;
  });
}
/**
 * 创建团队
 * Team model 数据库Team模型
 * schools promise 所有学校名称查询结果
 */
app.controller('CreateTeamController', ['$scope', 'Team', 'School', CreateTeamController]);
function CreateTeamController($scope, Team, School) {
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
    Team.create({}, $scope.team, function (res) {
      console.log(res);
      Materialize.toast('恭喜你！！！团队创建成功', 4000);
    }, function () {
    });
  };
}
/**
 * 查找团队
 */
app.controller('FindTeamController', ['$scope', FindTeamController]);
function FindTeamController($scope) {
  console.log($scope);
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
/**
 * [uploadFile description]
 * @param  {[type]}   files    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function uploadFile(files, callback) {
  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    formData.append(file.name, file);
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.open("POST", "/ue/uploads?action=uploadimage&dynamicPath=team&files=" + files.length, true);
  xhr.send(formData);
}
