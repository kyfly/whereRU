/**
 * [description]
 * @param  {[type]} ){	}] [description]
 * @return {[type]}         [description]
 */
app.controller('EventExplainController', ['$scope', '$http', '$sce', '$stateParams', 'Contest', function($scope, $http, $sce, $stateParams, Contest){
	$scope.eventId = $stateParams.id;
	Contest.findById({
		id: $stateParams.id
	}, function (res) {
		$scope.contest = res;
		$http.get('/docx2html?path=' + res.explainUrl)
		.success(function (html){
			$scope.explain = $sce.trustAsHtml(html);
		});
		$http.get('/docx2html?path=' + res.processUrl)
		.success(function (html){
			$scope.process = $sce.trustAsHtml(html);
		});
		$http.get('/docx2html?path=' + res.ruleUrl)
		.success(function (html){
			$scope.rule = $sce.trustAsHtml(html);
		});
	})
	//需要获取竞赛组织公开的文件
}]);
/**
 * [description]
 * @param  {[type]} ){	}] [description]
 * @return {[type]}         [description]
 */
app.controller('EventMessageController', ['$scope', '$stateParams', 'Contest', function($scope, $stateParams, Contest){
	$scope.eventId = $stateParams.id;
	Contest.findById({
		id: $stateParams.id
	}, function (res) {
		$scope.contest = res;
	})
}]);
/**
 * [description]
 * @param  {[type]} ){	}] [description]
 * @return {[type]}         [description]
 */
app.controller('EventTeamsController', ['$scope', '$stateParams', 'Contest', function($scope, $stateParams, Contest){
	$scope.eventId = $stateParams.id;
	Contest.findById({
		id: $stateParams.id
	}, function (res) {
		$scope.contest = res;
	})
}]);