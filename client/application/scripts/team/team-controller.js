app.controller('TeamsController', ['$scope','Team', 'User', function ($scope, Team, User) {
  $scope.types = [{
    "name": "校园组织",
  },{
    "name": "校园团队",
  },{
    "name": "兴趣团队",
  },{
    "name": "技术团队",
  }];
  $scope.team = {};
  // Team.getMySchoolTeams({
  //     school: $scope.$currentUser.school,
  //     last: new Date('2017-12-03T16:00:00.000Z')
  //   }, function (res) {
  //     console.log(res);
  //     $scope.teamItems = res.teams;
  //   }, function () {
  //   }
  // );
  $scope.uploadLogo = function () {
    var file = document.getElementById('teamlogo').files[0];
    var Xhr = new XMLHttpRequest();
    var fileExt = /\.[^\.]+/.exec(document.getElementById('teamlogo').value.toLowerCase());
    if (!((fileExt[0] === '.png') || (fileExt[0] === '.jpg') || (fileExt[0] === '.jpeg') || (fileExt[0] === '.gif'))) {
      alert('请确认您上传的logo文件格式是jpg、png、gif或jpeg');
      return false;
    }
    var readyHandle = function () {
      if (Xhr.readyState === 4) {
        if (Xhr.status === 200) {
          $scope.$apply(function () {
            $scope.team.logoUrl = 'http://oss.etuan.org/' + JSON.parse(Xhr.responseText).url;
          });
        }
      }
    };
    var Fd = new FormData();
    Fd.append('img', file);
    Xhr.onreadystatechange = readyHandle;
    Xhr.open('POST', '/ue/uploads?dir=user&id=' + $scope.$currentUser.id + '&action=uploadimage', true);
    Xhr.send(Fd);
  }
  $scope.createTeam = function () {
    User.prototype_create_teams({id: $scope.$currentUser.id}, $scope.team, function (team) {
      console.log(team)
    })
  }
}]);

