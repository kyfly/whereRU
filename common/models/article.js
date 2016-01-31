var q = require('q');
function commentFn(comment) {
	var defer = q.defer();
	comment.replys.count(function (err, count) {
		if (err) {
			defer.reject(err);
		}
		comment = comment.toJSON();
		comment.replyCount = count;
		defer.resolve(comment);
	});
	return defer.promise;
}
module.exports = function(Article) {
	Article.afterRemote('prototype.__get__comments', function (ctx, ins, next) {
		var comments = [];
		var commentFns = [];
		ins.forEach(function(comment) {
			commentFns.push(commentFn(comment));
		});
		q.all(commentFns)
		.then(function (comments) {
			ctx.res.send(comments);
		}, function (err) {
			ctx.res.send(err);
		});
	})
};
