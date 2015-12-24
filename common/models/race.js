module.exports = function(Race) {
	//
	Race.beforeRemote('prototype.__create__notices', function (ctx, ins, next) {
		var form = ctx.req.body.active;
		ctx.req.body.active = undefined;
		ctx.instance.notices.create(ctx.req.body, function (err, notice) {
			if (active)
				notice.form.create(form, function (err, form) {
					ctx.res.send(notice);
				});
			else
				ctx.res.send(notice);
		})
	});
};
