/**
 * [description]
 * @param  {[type]} ){	}] [description]
 * @return {[type]}         [description]
 */
app.controller('EventExplainController', ['$scope', '$stateParams', function($scope, $stateParams){
	$scope.eventId = $stateParams.id;
}]);
/**
 * [description]
 * @param  {[type]} ){	}] [description]
 * @return {[type]}         [description]
 */
app.controller('EventMessageController', ['$scope', '$stateParams',function($scope, $stateParams){
	$scope.eventId = $stateParams.id;
	
}]);
/**
 * [description]
 * @param  {[type]} ){	}] [description]
 * @return {[type]}         [description]
 */
app.controller('EventTeamsController', ['$scope', '$stateParams',function($scope, $stateParams){
	$scope.eventId = $stateParams.id;
	
}]);