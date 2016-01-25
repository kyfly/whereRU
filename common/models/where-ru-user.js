module.exports = function(User) {
	User.beforeRemote('create', function (ctx, ins, next) {
		ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
		ctx.req.body.created = new Date();
		next();
	});
	User.beforeRemote('login', function (ctx, ins, next) {
		ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
		next();
	});
	User.afterRemote('create', function (ctx, ins, next) {
		ins.createAccessToken(1209600, function (err, token) {
			ctx.res.send(token);
		});
	})
	User.remoteMethod('confirmSchool', {
		accepts: [{
			arg: 'id', type: 'string',
		},{
			arg: 'studentId', type: 'string',
		},{
			arg: 'password', type: 'string',
		}],
		returns: {
			arg: 'status', type: 'number'
		},
		http: {
			path: '/:id/confirmSchool', verb: 'post'
		}
	});
	User.confirmSchool = function (id,studentId ,password,cb) {
		console.log(id,studentId ,password);
		cb(null, 12);
	}
	User.remoteMethod('search', {
		accepts: {
			arg: 'keyword', type: 'string',
		},
		returns: {
			arg: 'users', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
	User.search = function () {}
	User.remoteMethod('getMyTeams', {
		accepts: {
			arg: 'id', type: 'string',
		},
		returns: {
			arg: 'teams', type: "array"
		},
		http: {
			path: '/:id/myTeams', verb: 'get'
		}
	});
	User.getMyTeams = function (id, cb) {
		this.app.models.Member.find({
			where: {userId: id},
			include:{
				relation: 'team',
				scope: {
					fields: ['id', 'name', 'logoUrl']
				}
			}
		}, function (err, team) {
			cb(err, team);
		});
	}
	User.remoteMethod('getInfo', {
		accepts: {
			arg: 'from', type: 'string',
		},
		returns: {
			arg: 'user', type: "array"
		},
		http: {
			path: '/info', verb: 'get'
		}
	});
	User.getInfo = function () {}
	User.remoteMethod('getRaceHistories', {
		accepts: {
			arg: 'id', type: 'string',
		},
		returns: {
			arg: 'races', type: "array"
		},
		http: {
			path: '/:id/raceHistories', verb: 'get'
		}
	});
	User.getRaceHistories = function () {}
	User.remoteMethod('getActivitiesHistories', {
		accepts: {
			arg: 'id', type: 'string',
		},
		returns: {
			arg: 'activities', type: "array"
		},
		http: {
			path: '/:id/activitiesHistories', verb: 'get'
		}
	});
	User.getRaceHistories = function () {}

	User.beforeRemote('prototype.__updateAttributes', function () {});
	User.afterRemote('prototype.__updateAttributes', function () {});
	User.beforeRemote('prototype.__findById__formResults', function () {})
	User.beforeRemote('prototype.__findById__voteResults', function () {})
	User.beforeRemote('prototype.__findById__seckillResults', function () {})
	User.afterRemote('prototype.__updateById__teams', function() {});
};
