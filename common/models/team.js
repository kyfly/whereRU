var promise = require(__dirname + '/../../modules/model-promise.js');
module.exports = function(Team) {
	Team.remoteMethod('search', {
		accepts: {
			arg: 'keyword', type: 'string',
		},
		returns: {
			arg: 'teams', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
  Team.search = function(keyword,cb){
    var query = [];
    if(keyword) {
      key = keyword.replace(' ', '.+');
      keywords = keyword.split(' ');
      keywords.push(key);
    }
    keywords.forEach(function (keyword) {
      query.push({
        name:{like:keyword}
      });
      query.push({
        desc:{like:keyword}
      });
      query.push({
        school:{like:keyword}
      });
      query.push({
        type:{like:keyword}
      });
    });
    Team.find({
        where: { or: query },
        fields:['id','userId','name','logoUrl','desc']
    },function(err,teams){
        if(err) return cb(err);
        cb(null,teams);
    });
	};
	/**
	 * 创建活动时，保存部分团队信息到活动信息中
	 * @param  {[type]} ctx   [description]
	 * @param  {[type]} ins   [description]
	 * @param  {[type]} next) {		ctx.req.body.school [description]
	 * @return {[type]}       [description]
	 */
	Team.beforeRemote('prototype.__create__activities', function (ctx, ins, next) {
		ctx.req.body.school = ctx.instance.school;
		ctx.req.body.authorName = ctx.instance.name;
		ctx.req.body.authorId = ctx.instance.id;
		ctx.req.body.created = new Date();
		next();
	});
	/**
	 * 竞赛创建前保存团队信息到竞赛信息
	 * @param  {[type]} ctx   [description]
	 * @param  {[type]} ins   [description]
	 * @param  {[type]} next) {		ctx.req.body.school [description]
	 * @return {[type]}       [description]
	 */
	Team.beforeRemote('prototype.__create__races', function (ctx, ins, next) {
		ctx.req.body.school = ctx.instance.school;
		ctx.req.body.authorName = ctx.instance.name;
		ctx.req.body.authorId = ctx.instance.id;
		ctx.req.body.created = new Date();
		next();
	});
	/**
	 * 校园活动列表接口
	 * @type {Array}
	 */
	Team.remoteMethod('getMySchoolTeams', {
		accepts: [{
			arg: 'school', type: 'string',
		},{
			arg: 'last', type: 'date',
		}],
		returns: {
			arg: 'teams', type: 'array'
		},
		http: {path: '/mySchoolTeams', verb: 'get'}
	});
	/**
	 * 校园活动列表
	 * @param  {[type]}   school [description]
	 * @param  {[type]}   last   [description]
	 * @param  {Function} cb     [description]
	 * @return {[type]}          [description]
	 */
	Team.getMySchoolTeams = function (school,last,cb){
    Team.find({
      where:{school:school,created:{lt:last}},
      limit:20,
      order:"id desc",
      fields:['id','userId','name','logoUrl','desc','status']
    },function(err,teams){
      if(err) return cb(err);
      cb(null,teams);
    });
  };
	Team.remoteMethod('getActivitiesData', {
		accepts: {
			arg: 'id', type: 'string'
		},
		returns: {
			arg: 'activities', type: 'array'
		},
		http: {path: '/:id/activitiesData', verb: 'get'}
	});
	Team.getActivitiesData = function (id, cb){
		var activityFn = [];
		var activitiesFn = [];
		Team.findById(id, function (err, team) {
			team.activities({}, function (err, activities) {
				activities.forEach(function (activity) {
					var actType = activity.actType;
					var actModel = actType + 's';
					var actResult = actType + 'Results';
					console.log(activity[actModel][actResult])
					['app', 'wechat', 'pc', 'QQ', 'else'].forEach(function (from) {
						activityFn.push(promise(activity.readers, 'count', {query: {form: from}}));
						if (actType === 'form') {
							activityFn.push(promise(activity.forms.formResults, 'count', {}));
						}
						
						promise.all(activityFn).then(function (data) {
							console.log(data);
						})
					})
				});
			})
		})
	};
	//Team.beforeRemote('prototype.__create__members',function () {});
};
