module.exports = function(WhereRuUser) {
	WhereRuUser.beforeRemote('create', function (ctx, ins, next) {
		ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
		ctx.req.body.created = new Date();
		next();
	});
	WhereRuUser.beforeRemote('login', function (ctx, ins, next) {
		ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
		next();
	});
	WhereRuUser.afterRemote('create', function (ctx, ins, next) {
		ins.createAccessToken(1209600, function (err, token) {
			ctx.res.send(token);
		});
	});

	//重写__get__teams方法，只能获取deleted不存在的信息
};
