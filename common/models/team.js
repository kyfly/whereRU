module.exports = function(Team) {
	Team.beforeRemote('prototype.__create__activities', function (ctx, ins, next) {
		var active = ctx.req.body.active;
		var type = ctx.req.body.actType;
		ctx.req.body.school = ctx.instance.school;
		ctx.req.body.active = undefined;
		ctx.req.body.actType = undefined;
		ctx.instance.activities.create(ctx.req.body, function (err, act) {
			if (type === 'form') {
				act.forms.create(active, function (err, forms) {
					console.log(err, forms);
				});
			}
			else if (type === 'vote') {
				act.votes.create(active, function (err, votes) {
					console.log(err, votes);
				});
			} else if (type === 'seckill') {
				act.seckills.create(active, function (err, seckills) {
					console.log(err, seckills);
				});
			} 
		});
		ctx.res.send('success');
	});
	Team.beforeRemote('prototype.__create__races', function (ctx, ins, next) {
		ctx.req.body.school = ctx.instance.school;
		next();
	});
};
