module.exports = function(FormResult) {
	FormResult.beforeCreate = function (next, instance) {
		instance.form({
			include: 'activity'
		}, function (err, form) {
			if (err || !form.toJSON().activity) {
    		return next(err);
    	}
			if (new Date() < new Date(form.toJSON().activity.started))
			{
				return next('还没开始呢');
			} else if (new Date() > new Date(form.toJSON().activity.ended)) {
				return next('活动已经结束了');
			} else {
				next();
			}
		});
	}
};
