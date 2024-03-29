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
	Coterie.afterRemote('findById', function (ctx, ins, next) {
		if (ctx.req.accessToken) {
			ins.fans.findOne({
				where: {
					userId: ctx.req.accessToken.userId
				}
			}, function (err, user) {
				if (err || !user) {
					next();
				} else {
					var coterie = ins.toJSON();
					coterie.isAttentioned = true;
					ctx.res.send(coterie);
				}
			})
		} else {
			next();
		}
	})
	Coterie.__get__articles = function (ctx, ins, cb) {
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
			//TODO 请在这里检查错误
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
	}
	/**
	 * 获取一个圈子内文章列表
	 * @param  {[type]} ctx   [description]
	 * @param  {[type]} ins   [description]
	 * @param  {[type]} next) {		var       date [description]
	 * @return {object}       文章列表，每个文章都带有评论数量，点赞量，以及当前用户是否点赞
	 */
	Coterie.beforeRemote('prototype.__get__articles', function (ctx, ins, next) {
		Coterie.__get__articles(ctx, ins, next);
	});

	Coterie.afterRemote('prototype.__findById__articles', function (ctx, ins, next) {
		
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
