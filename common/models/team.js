module.exports = function(Team) {
	Team.afterRemote('create', function (ctx, instance, next) {
		//创建团队后需要添加信息到团队历史和团队成员
		instance.histories.create();
		instance.members.create();
		next();
	});
};
