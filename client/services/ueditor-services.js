app.factory('Ueditor', ['$rootScope', function ($rootScope) {
  if ($rootScope.teamInfo) {
    var dir = 'team';
    var id = $rootScope.teamInfo.id;
  } else if ($rootScope.$currentUser) {
    var dir = 'user';
    var id = $rootScope.$currentUser.id;
  } else {
    return;
  }
  var url = "/ue/uploads?dir=" + dir + "&id=" + id;
  return {
    config: {
      serverUrl: url,
      toolbars: [[
        'fullscreen', 'source', '|', 'undo', 'redo', '|',
        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
        'simpleupload', 'insertimage','attachment','insertvideo', 'music'
      ]],
      initialFrameHeight: 300,
      //关闭字数统计
      wordCount: false,
      //关闭elementPath
      elementPathEnabled: false,
      //关闭右键菜单功能
      enableContextMenu: false
    }
  }
}]);
