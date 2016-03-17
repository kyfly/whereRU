module.exports = function(Vote) {
	Vote.beforeUpdate = function (next, vote) {
    if (vote.activityId) {
			Vote.app.models.Activity.findById(vote.activityId, {
				fields: ['started', 'ended']
			}, function (err, activity) {
				if (err) {
					return next(err);
				}
				if (activity.started < new Date()) {
					next('活动期间不可修改');
				} else if (activity.ended < new Date()) {
					next('活动已结束');
				} else {
					next();
				}
			});
    } else {
    	next();
    }
  };
};
