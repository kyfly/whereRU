var promise = require('../../modules/model-promise.js');
var Q = require('q');
module.exports = function(Team) {
	Team.afterRemote('create', function (ctx, instance, next) {
		//创建团队后需要添加信息到团队历史和团队成员
		//instance.histories.create();
		
		Team.app.models.RUser.findById(instance.rUserId, function (err, ins) {
			instance.members.create({
				userId: ins.id,
				role: "管理员",
				phone: ins.phone,
				name: ins.username,
				academy: ins.academy
			}, function (err, ins) {
				next();
			});
		})
	});
	Team.afterRemote('prototype.__create__members', function (ctx, ins, next) {
		Team.update({id: ins.teamsId}, {'$push': {"userIds": ins.userId}}, function (err, count) {
			next();
		})
	});
	Team.beforeRemote('prototype.__create__messages', function (ctx, ins, next) {
		var active = ctx.req.body.active;
		ctx.req.body.active = undefined;
		ctx.instance.messages.create(ctx.req.body, function (err, message) {
			message.active.create(active, function (err, active) {
				ctx.res.send('success');
			});
		});
	});
	Team.remoteMethod('getMySchoolTeamsMessages', {
		'accepts': [{
			arg: 'school', type: 'string',
		}],
		'returns': {
			arg: 'message', type: 'array'
		},
		'http': {
			path: '/getMySchoolTeamsMessages',
			verb: 'get'
		}
	});
	Team.getMySchoolTeamsMessages = function (school, cb) {
		var T;
		promise(Team, 'find', {
			query: {
				where: {
					school: school
				},
				fields: ['id', 'name', 'logoUrl','dynamic', 'chatId']
			}
		})
		.then(function (teams) {
			var promiseObj = [];
			T = teams;
			teams.forEach(function (team) {
				promiseObj.push(promise(team.messages, 'findOne' , {
					query: {
						include: {
							relation: 'active'
						},
						order: 'created DESC'
					}
				}));
			});
			return Q.all(promiseObj);
		}).then(function (message) {
			var teams = [];
			T.forEach(function (team, index) {
				team = team.toJSON();
				team.message = message[index];
				teams.push(team);
			});
			cb(null, teams);
		});
	}
};
