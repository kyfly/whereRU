var q = require('q');
var promise = require(__dirname + '/../../modules/model-promise.js');
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
	});
	Article.afterRemote('findById', function (ctx, ins, next) {
		var article = ins.toJSON();
		promise(ins.readers, 'count', {})
		.then(function (count) {
			article.readerCount = count;
			return promise(ins.likeUser, 'count', {});
		})
		.then(function (count) {
			article.likeCount = count;
			if (ctx.req.accessToken) {
				promise(ins.likeUser, 'count', { userId: ctx.req.accessToken.userId})
				.then(function (count) {
					article.islike = count > 0;
					ctx.res.send(article);
				});
			} else {
				article.islike = false;
				ctx.res.send(article);
			}
		}, function (err) {
			if (err) {
				ctx.res.send(err);
			}
		});
	})
};
