module.exports = function(Race) {
	//Race.beforeRemote('prototype.__link__raceTeams', function(){});
	Race.remoteMethod('search', {
		accepts: {
			arg: 'keyword',
      type: 'string',
      required: true
		},
		returns: {
			arg: 'races', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
	Race.search = function (keyword,cb){
    var query = [];
    keywords = keyword.split(' ');
    keywords.forEach(function (keyword) {
      query.push({
        name:{like:keyword}
      });
      query.push({
        authorName:{ like:keyword }
      });
    });
    Race.find({
        where: { or: query },
        fields:['name','imgUrl','started','id','authorName','authorId','ended','created']
    },function(err,races){
        if(err) {
          return cb(err);
        }
        cb(null,races);
    });
    };
	Race.remoteMethod('getMySchoolRaces', {
		accepts: [{
			arg: 'school',
      type: 'string',
      required: true
		},{
			arg: 'page', type: 'number',
		}],
		returns: {
			arg: 'races', type: 'array'
		},
		http: {path: '/mySchoolRaces', verb: 'get'}
	});
	Race.getMySchoolRaces = function (school, page, cb){
    page = page || 0;
    Race.find({
      where: {
        school: school,
        deleted: false
      },
      order:'id DESC',
      skip: 16 * page,
      limit: 16
    },function(err, races){
      if(err) {
        return cb(err);
      }
      cb(null,races);
    });
  };
  
  Race.beforeRemote("prototype.__updateById__notices", function (ctx, ins, next) {
    ctx.instance.raceTeams.count({
      id: ctx.req.body.teamId
    }, function (err, count) {
      if (count)
        return next('你的团队不是竞赛团队，不能上传资料');
      else {
        ctx.instance.notices.findOne({
          where:{
            id: ctx.req.params.fk,
            'uploadFile.teamId': ctx.req.body.teamId
          }
        }, function (err, notice) {
          if (err)
            return next(err);
          else if (notice) {
            next('你的团队已经上传过了');
          } else {
            ctx.instance.notices.updateAll({
              id: ctx.req.params.fk
            }, {
              $push:{
                uploadFile: ctx.req.body
              }
            }, function (err, notice) {
              if (err)
                return next(err);
              ctx.res.send(notice);
            });
          }
        });
      }
    });
  });
  Race.beforeCreate = function(next, instance){
    instance.team(function (err, team) {
      Race.app.models.Coterie.findOne({
        where: {
          teamId: instance.teamId
        }
      }, function (err, coterie) {
        if (err || !coterie || !instance.explainUrl) {
          next();
        } else {
          coterie.articles.create({
            "title": instance.name,
            "contentUrl": instance.explainUrl,
            "created": new Date(),
            "coterieId": coterie.id,
            "userId": team.userId
          }, function (err, article) {
            next();
          });
        }
      })
    });
  };
  Race.beforeRemote('find', function (ctx, ins, next) {
    if(ctx.req.query.filter)
      var filter = JSON.parse(ctx.req.query.filter) || {};
    else
      var filter = {
        limit: 32
      };
    filter.limit = filter.limit > 32? 32 : filter.limit;
    filter.skip = 0;
    filter.order = filter.order || 'id DESC';
    Race.find(filter, function (err, races) {
      ctx.res.send(races);
    });
  });
};
