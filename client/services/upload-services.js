(function (angular) {
	/**
	*  Module
	*
	* Description
	*/
	var module = angular.module('ng.upload', []);
	module.factory('uploadFile', ['$http',function($http){
	return {
		file: function uploadFile (file, type, id) {
			var Fd = new FormData();
			var path = '/ue/uploads?dir=' + type + '&id=' + id + '&action=uploadfile';
			Fd.append('file', file);
			return $http({
				url: path,
				data: Fd,
				method: 'POST',
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity
			});
		},
		text: function uploadText (text, type, id) {
			return $http({
        url: '/ue/uploads?dir=' + type+ '&id=' + id + '&action=uploadtext',
        method: "post",
        data: {
          'content': text
        }
      });
		},
		img: function uploadFile (file, type, id) {
			var Fd = new FormData();
			var path = '/ue/uploads?dir=' + type + '&id=' + id + '&action=uploadimage';
			Fd.append('file', file);
			return $http({
				url: path,
				data: Fd,
				method: 'POST',
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity
			});
		},
	};
}]);
})(window.angular);