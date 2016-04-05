module.exports = function(VoteResult) {
	VoteResult.beforeCreate = function (next, instance) {
		instance.vote({
			include: 'activity'
		}, function (err, vote) {
			if (err) {
    		return next(err);
    	}
			if (new Date() < new Date(vote.toJSON().activity.started))
			{
				return next('还没开始呢');
			} else if (new Date() > new Date(vote.toJSON().activity.ended)) {
				return next('活动已经结束了');
			} else {
				vote._voteItems.forEach(function (voteItem) {
					for (var i = 0; i < instance.result.length; i++) 
						if (instance.result[i] === voteItem.id) {
						 	voteItem.count ++
						};
				});
				vote.save(function(err, vote){
				});
				next();
			}
		});
	}
};
