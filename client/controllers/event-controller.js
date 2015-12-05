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
app.controller('EventMessageController', ['$scope', '$stateParams', 'Contest', 'Auth', 'Active', function($scope, $stateParams, Contest, Auth, Active){
	$scope.eventId = $stateParams.id;
	$scope.disabled = false;
	Contest.getMessages({
		id: $stateParams.id
	}, function (res) {
		$scope.contest = res.contest;
	});
	$scope.upLoad = function () {
		var id = this.message.active.id + '_' + this.$index;
		var files = document.getElementById(id).files;
		var that = this;
		Active.findOne({
			filter: {
				where: {
					'result.homeUrl': '/users/' + Auth.getId()
				},
				fields: ['id', 'secret']
			}
		}, function (res) {
			if (res.id) {
				that.form[that.message.active.id]['disabled'] = true;
				that.c = "你已经参与过了";
			}
			//已经参与了
			if (!res.id)
				uploadFile(files, function (res) {
					$scope.$apply(function () {
						if(res.state === "ERROR"){
							that.c = "上传失败";
							return;
						}
						that.form[that.message.active.id][that.$index] = {};
						that.form[that.message.active.id][that.$index] = {
							url: res[0].url,
							name: res[0].original
						};
					});
		    });
				
		});
		
	}
	$scope.submit = function () {
		var form = this.form[this.message.active.id];
		var data = {
			$push: {
				result: {
					name: Auth.getUserName(),
					homeUrl: '/users/' + Auth.getId(),
					answer: form
				}
			}
		};
		Active.updateAll({
			where:{
				id: this.message.active.id
			}
		}, data, function (res) {
			//success
			console.log(res);
		});
	}
}]);
/**
 * [description]
 * @param  {[type]} ){	}] [description]
 * @return {[type]}         [description]
 */
app.controller('EventTeamsController', ['$scope', '$stateParams', 'Contest', function($scope, $stateParams, Contest){
	$scope.eventId = $stateParams.id;
	Contest.findById({
		id: $stateParams.id,
	}, function (res) {
		$scope.contest = res;
	});
}]);