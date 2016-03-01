module.exports = function(VoteResult) {
	VoteResult.observe('after save', function (ctx, next) {
		ctx.instance.vote(function (err, vote) {
			vote._voteItems.forEach(function (voteItem) {
				for (var i = 0; i < ctx.instance.result.length; i++) 
					if (ctx.instance.result[i] === voteItem.id) {
					 	voteItem.count ++
					};
			});
			vote.save();
			next();
		});
	});
};
