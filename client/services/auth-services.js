app.factory('$cookieStore', function(){
	return {
		get: function (key) {
			var data = localStorage[key];
			if (data) {
				return data = JSON.parse(data);
			} else {
				return {id:null, userId: null};
			}
		},
		put: function (key, data) {
			localStorage[key] = JSON.stringify(data);
		}
	}
})
.factory('Auth', ['$cookieStore', function($cookieStore){
	var _user = $cookieStore.get('IY9O2PG');
	return {
		isAuthorized: function () {
			return _user;
		},
		setUser: function (token) {
			$cookieStore.put('IY9O2PG', token);
		},
		getUser: function () {
			return _user;
		},
		getId: function () {
			return _user.userId;
		},
		getToken: function () {
			return _user.id;
		},
		logout: function () {
			$cookieStore.remove('IY9O2PG');
			_user = null;
		}
	}
}]);