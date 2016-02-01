var q = require('q');
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
      where:{school:school,created:{lt:last},hidden:false,deleted:undefined},
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
		function relationModelFn(model, query) {
			var defer = q.defer();
			model.count(query, function (err, count) {
				if (err) {
					defer.reject(err);
				}
				defer.resolve(count);
			});
			return defer.promise;
		}
		Team.findById(id, function (err, team) {
			var activityData = [];
			var activitiesFn = [];
			team.activities({}, function (err, activities) {
				activities.forEach(function (activity) {
					var actType = activity.actType;
					var actModel = actType + 's';
					var actResult = actType + 'Results';
					var activityFn = [];
					['app', 'wechat', 'pc', 'QQ', 'else'].forEach(function (from) {
						activityFn.push(relationModelFn(activity.readers, {form: from}));
					});
					activityFn.push(relationModelFn(activity.readers, {}));
					activitiesFn.push(promise());
					function promise() {
						var defer = q.defer();
						q.all(activityFn).then(function (data) {
							activity = activity.toJSON();
							activity.readerFrom = {
								"app": data[0],
	              "wechat": data[1],
	              "PC": data[2],
	              "QQ": data[3],
	              "else": data[4]
							}
							activity.readerNum = data[5];
							defer.resolve(activity);
						}, function (err) {
							defer.reject(err);
						})
						return defer.promise;
					}
				});
				q.all(activitiesFn).then(function (data) {
					cb(null, data);
				});
			})
		})
	};
	//Team.beforeRemote('prototype.__create__members',function () {});

	Team.beforeRemote('prototype.__create__members',function (ctx,ins,next) {
    var userId = ctx.req.accessToken.userId;
    ctx.instance.members.count({
      userId : userId
    },function(err,result){
      if(err) return next(err);
      if (result>0){
        return ctx.res.send({
          error:{
            "status":1002,
            "message":"用户已加入该团队。"
          }
        });
      }else{
        Team.app.models.user.findById(userId,function(err,user){
          if(err) return next(err);
          ctx.req.body.userId = userId;
          ctx.req.body.school = user.school;
          ctx.req.body.phone = user.phone;
          ctx.req.body.name = user.name;
          ctx.req.body.created = user.created;
          ctx.req.body.academy = user.academy;
          ctx.req.body.verified = false;
          next();
        });
      }
    });
  });
  Team.afterRemote('prototype.__create__members',function (ctx,ins,next) {
    ctx.res.send({"status":200});
  });
};
