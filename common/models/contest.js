var promise = require('../../modules/model-promise.js');
var Q = require('q');
module.exports = function(Contest) {
	Contest.beforeRemote('prototype.__create__messages', function (ctx, ins, next) {
		var active = ctx.req.body.active;
		ctx.req.body.active = undefined;
		ctx.instance.messages.create(ctx.req.body, function (err, message) {
			message.active.create(active, function (err, active) {
				message.updateAttributes({actId: active.id});
				ctx.res.send(active);
			})
		});
		//promise(Contest, 'findById', {id: })
	});
	Contest.remoteMethod('getMessages', {
		'accepts': [{
			arg: 'id', type: 'string',
		}],
		'returns': {
			arg: 'contest', type: 'object'
		},
		'http': {
			path: '/getMessages/:id',
			verb: 'get'
		}
	});
	Contest.getMessages = function (id, cb) {
		var contestObj = {};
		var messagesObj = [];
		promise(Contest, 'findById', {
			id: id,
			query: {
				include: {
					relation: 'messages',
					scope: {
						include: ['active']
					}
				}
			}
		})
		.then(function (contest) {
			cb(null, contest);
		})
		.done(function (err) {
			if (err)
			cb(err);
		})
	}
	Contest.remoteMethod('getMySchoolEvents', {
		'accepts': [{
			arg: 'school', type: 'string',
		}],
		'returns': {
			arg: 'events', type: 'array'
		},
		'http': {
			path: '/getMySchoolEvents',
			verb: 'get'
		}
	});
	Contest.getMySchoolEvents = function (school, cb) {
		Contest.find({
			include: {
				relation: 'contestOrg',
				scope: {
					where: {
						school: school
					}
				}
			}
		}, function (err, ins) {
			var contests = [];
			ins.forEach(function (contest) {
				var p = contest.toJSON();
	  		if (p.contestOrg) {
	  			contests.push(p);
	  		}
			});
			cb(err, contests);
		});
	}
};
