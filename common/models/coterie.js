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
		var date = ctx.req.query.last;
		var where = {};
		if (date) {
			where = {created: {lt: date}};
		}
		ctx.instance.articles({
			include: ["comments", "likeUser"],
			where: where,
			order: 'id DESC',
			limit: 20
		}, function (err, articleInstances) {
			var articles = [];
			articleInstances.forEach(function (article) {
				var a = article.toJSON();
				a.commentCount = a.comments.length;
				a.likeCount = a.likeUser.length;
				a.likeUser = undefined;
				a.comments = undefined;
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
		promise(ins.readers.count, 'insFind', {})
		.then(function (count) {
			article.readerCount = count;
			return promise(ins.likeUser.count, 'insFind', {});
		})
		.then(function (count) {
			article.likeCount = count;
			if (ctx.req.accessToken) {
				promise(ins.likeUser.count, 'insFind', { userId: ctx.req.accessToken.userId})
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
	});
  Coterie.remoteMethod('search', {
		accepts: {
			arg: 'keyword',
			type: 'string',
			required: true
		},
		returns: {
			arg: 'coteries', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
	Coterie.search = function (keyword,cb){
    keyword = keyword.replace(' ','.+');
    Coterie.find({
      where:
      {
          or:[{name:{like:keyword}}]
      },
      fields:['name','logoUrl','id']
    }, function(err, coteries){
			if(err) {
				cb(err);
			}
			cb(null, coteries);
    });
	};
};
