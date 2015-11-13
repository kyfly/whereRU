app.factory('Ueditor', function () {
	return {
		config: {
      serverUrl: "/ue/uploads",
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
})