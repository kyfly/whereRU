var q = require('q');
function articleFn(article, userId, a) {
	var defer = q.defer();
	article.likeUser.count(
	{
		userId: userId
	}, function (err, count) {
		if (err) {
			defer.reject(err);
		}
		a.islike = count > 0;
		defer.resolve(a);
	});
	return defer.promise;
}
module.exports = function(Coterie) {
	Coterie.beforeRemote('prototype.__get__articles', function (ctx, ins, next) {
		ctx.instance.articles({
			include: ["comments", "user", "likeUser"]
		}, function (err, articleInstances) {
			var articles = [];
			articleInstances.forEach(function (article) {
				var a = article.toJSON();
				var user = a.user;
				a.commentCount = a.comments.length;
				a.likeCount = a.likeUser.length;
				a.likeUser = undefined;
				a.comments = undefined;
				a.user = {};
				a.user = {
					id: user.id,
					name: user.name,
					sign: user.sign,
					headImgUrl: user.headImgUrl
				}
				if (ctx.req.accessToken) {
					articles.push(articleFn(article, ctx.req.accessToken.userId, a)); 
				} else {
					a.islike = false;
					articles.push(a);
				}
			});
			if (ctx.req.accessToken) {
				q.all(articles).done(function (a) {
					ctx.res.send(a);
				}, function (err) {

				})
			} else {
				ctx.res.send(articles);
			}
		});
	});
};
