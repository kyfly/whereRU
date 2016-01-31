var q = require('q');
var promise = require(__dirname + '/../../modules/model-promise.js');
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
  User.afterRemote('login', function (ctx, ins, next) {
    User.findById(ins.userId, function (err, user) {
      var token = ins.toJSON();
      token.user = {
        "name" : user.name,
        "school" : user.school,
        "phone" : user.phone,
        "sign": user.sign
      };
      ctx.res.send(token);
    });
	});
	User.afterRemote('create', function (ctx, ins, next) {
		ins.createAccessToken(7200, function (err, token) {
      var token = token.toJSON();
      token.user = {
        "name" : ins.name,
        "school" : ins.school,
        "phone" : ins.phone,
        "sign": user.sign
      };
			ctx.res.send(token);
		});
	});
	User.afterRemote('prototype.__link__coteries', function (ctx, ins, next) {
		ins.lastView = new Date();
		ins.save();
		next();
	});
	User.afterRemote('prototype.__get__coteries', function (ctx, ins, next) {
		var coteriesFn = [];
		function coterieFn(coterie) {
			var defer = q.defer();
			var lastView = coterie.lastView;
			coterie.articles.count({created: {gt: lastView}}, function (err, count) {
				if (err) {
					defer.reject(err);
				} else {
					coterie = coterie.toJSON();
					coterie.msgCount = count;
					defer.resolve(coterie);
				}
			});
			return defer.promise;
		}
		ins.forEach(function (coterie) {
			coteriesFn.push(coterieFn(coterie));
		});
		q.all(coteriesFn).then(function (data) {
			ctx.res.send(data);
		}, function (err) {
			ctx.res.send(err);
		});
	});
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
	User.search = function (keyword,cb) {
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
        sign:{like:keyword}
      });
    });
    User.find({
        where: { or: query },
        fields:['id','name','sign','headImgUrl']
    }, function(err,User){
        if(err) return cb(err);
        cb(null,User);
    });
  };
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
  User.afterRemote('prototype.__get__teams', function (ctx,ins,next){
    var result = [];
    ins.forEach(function(team){
      var record = {
        name:team.name,
        logoUrl:team.logoUrl,
        id:team.id
      };
      result.push(record);
    });
    ctx.res.send(result);
  });
	User.getRaceHistories = function () {};
	User.beforeRemote('prototype.__updateAttributes', function () {});
	User.afterRemote('prototype.__updateAttributes', function () {});
	User.beforeRemote('prototype.__findById__formResults', function () {})
	User.beforeRemote('prototype.__findById__voteResults', function () {})
	User.beforeRemote('prototype.__findById__seckillResults', function () {})
	User.beforeRemote('prototype.__create__voteResults', function (ctx, ins, next) {
		var voteId = ctx.req.body.voteId;
		var voteItem = ctx.req.body.result;
		var Vote = User.app.models.Vote;
		Vote.findById(voteId, function (err, vote) {
			for (var index in voteItem)
			{
				console.log(index);
				vote.voteItems.findById(voteItem[index], function (err, item) {
					item.count = item.toJSON().count + 1;
					item.save();
				})
			}
		});
		next();
	});
	User.afterRemote('prototype.__updateById__teams', function() {});
};
