var q = require('q');
var promise = require(__dirname + '/../../modules/model-promise.js');
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

	Coterie.afterRemote('prototype.__findById__articles', function (ctx, ins, next) {
		var article = ins.toJSON();
		promise(ins.user, 'insFind', {query: {fields: ['id', 'name', 'sign', 'headImgUrl']}})
		.then(function (user) {
			article.user = user.toJSON();
			return promise(ins.comments, 'insFind', {
				query: {include: ['user', {'replys': 'user'}]}
			})
		})
		.then(function (comments) {
			var commentArray = [];
			comments.forEach (function (comment) {
				var c = comment.toJSON();
				var replys = [];
				c.user = {
					id: c.user.id,
					name: c.user.name,
					sign: c.user.sign,
					headImgUrl: c.user.headImgUrl
				};
				c.replys.forEach(function (reply) {
					reply.user = {
						id: reply.user.id,
						name: reply.user.name,
						sign: reply.user.sign,
						headImgUrl: reply.user.headImgUrl
					}
					replys.push(reply);
				});
				c.replys = replys;
				commentArray.push(c);
			});
			article.comments = commentArray;
			return promise(ins.likeUser.count, 'insFind', {});
		})
		.then(function (count) {
			var accessToken = ctx.req.accessToken;
			article.likeCount = count;
			if (accessToken) {
				return promise(ins.likeUser.count, 'insFind', {query: { userId: accessToken.userId }});
			} else {
				return 0;
			}
		})
		.then(function (n) {
			article.islike = n > 0;
			ctx.res.send(article);
		});
	});
};
