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
};
