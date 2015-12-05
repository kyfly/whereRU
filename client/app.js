var realtime;
var leancloudAppId = 'vClHC4mUTBMJmicYVCJ8zluw';
var leancloudAppKey = '4MY3lhMBVc5Q1wUqG42w6BLB';
var app = angular.module('WRU', ['ui.router', 'lbServices', 'ui.materialize'])
  //配置路由方式
.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.html5Mode({
  	enabled: true
   	//requireBase: false
  });
}])
.run(['$rootScope', function ($rootScope) {
	$rootScope.goback = function () {
		window.history.back();
	}
}])
.config(['$httpProvider', function($httpProvider) {
	var interceptor = function ($q, $rootScope, Auth) {
		return {
			'responseError': function(rejection) {
				// 错误处理
				switch(rejection.status) {
					case 401:
						$rootScope.$broadcast('auth:loginRequired');
						break;
					case 403:
						$rootScope.$broadcast('auth:forbidden');
						break;
					case 404:
						$rootScope.$broadcast('page:notFound');
						break;
					case 500:
						$rootScope.$broadcast('server:error');
						break;
				}
				return $q.reject(rejection);
			},
			'request': function (req) {
				req.params = req.params || {};
				req.params.accessToken = Auth.getToken();
				return req;
			}
		}
	};
	$httpProvider.interceptors.push(interceptor);
}]);
function createRealtimeObj(cb) {
	if (!realtime) {
	  var userId = JSON.parse(localStorage['IY9O2PG']).userId;
	  realtime = AV.realtime({
	    appId: leancloudAppId,
	    clientId: userId
	  });
	  realtime.open(function() {});
	  realtime.on('open', function () {
	    cb (realtime);
	  });
	} else {
		cb (realtime);
	}
}
function getRooms (cb) {
	createRealtimeObj(function (rt) {
    rt.query(function (rooms) {
      cb (rooms);
    });
  });
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
