/**
 * 查看团队信息
 * team promise 团队信息
 */
app.controller('ViewTeamController', ['$scope', 'team', ViewTeamController]);
function ViewTeamController($scope, team) {
	$scope.team = team;
	$scope.edit = true;
}
/**
 * 创建团队
 * Team model 数据库Team模型
 * schools promise 所有学校名称查询结果
 */
app.controller('CreateTeamController', ['$scope', 'Team', 'schools', CreateTeamController]);
function CreateTeamController($scope, Team, schools) {
  $scope.schools = schools;
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

app.controller('FindTeamController', ['$scope', FindTeamController]);
function FindTeamController($scope) {
  console.log($scope);
}
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