module.exports = function(RUser) {
	RUser.beforeRemote('create', function (ctx, instance, next) {
		if (!ctx.req.body.phone) {
			next("phone is null");
			return;
		}
		ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
		next();
	});
	RUser.afterRemote('create', function (ctx, instance, next) {
		RUser.login(ctx.req.body, function (err, token) {
			ctx.res.send({err, token});
		})
	});
	RUser.beforeRemote('login', function (ctx, instance, next) {
		if (!ctx.req.body.phone) {
			next("phone is null");
			return;
		}
		ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
		next();
	});
};
