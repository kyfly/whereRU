module.exports = function(ContestOrg) {
	ContestOrg.beforeRemote('login', function (ctx, instance, next) {
		ContestOrg.login(ctx.req.body, function (err, token) {
			ctx.res.send({err, token});
		});
	});
	ContestOrg.afterRemote('create', function (ctx, instance, next) {
		ContestOrg.login(ctx.req.body, function (err, token) {
			ctx.res.send({err, token});
		});
	});
	
};
