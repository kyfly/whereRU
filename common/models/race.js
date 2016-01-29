module.exports = function(Race) {
	//不需要了
	// Race.beforeRemote('prototype.__create__notices', function (ctx, ins, next) {
	// 	var form = ctx.req.body.active;
	// 	ctx.req.body.active = undefined;
	// 	ctx.instance.notices.create(ctx.req.body, function (err, notice) {
	// 		if (active)
	// 			notice.form.create(form, function (err, form) {
	// 				ctx.res.send(notice);
	// 			});
	// 		else
	// 			ctx.res.send(notice);
	// 	})
	// });
	Race.beforeRemote('prototype.__link__raceTeams', function(){});
	Race.remoteMethod('search', {
		accepts: {
			arg: 'keyword', type: 'string',
		},
		returns: {
			arg: 'races', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
	Race.search = function (keyword,cb){
        if(keyword) keyword = keyword.replace(' ','.+');
        Race.find({
            where:
            {
                or:[{name:{like:keyword}},
                    {authorName:{like:keyword}}]
            },
            fields:['name','imgUrl','started','id','authorName','authorId','ended','created']
        },function(err,races){
            if(err) cb(err);
            cb(null,races);
        });
    };
	Race.remoteMethod('getMySchoolRaces', {
		accepts: [{
			arg: 'school', type: 'string',
		},{
			arg: 'lastTime', type: 'date',
		}],
		returns: {
			arg: 'races', type: 'array'
		},
		http: {path: '/mySchoolRaces', verb: 'get'}
	});
	Race.getMySchoolRaces = function (school,lastTime,cb){
    Race.find({
      where:{"school":school,"started":{lt:lastTime}},
      order:'id DESC',
      limit: 20,
      fields: ['name','imgUrl','started','id','authorName','authorId','ended','created']
    },function(err,races){
      if(err) return cb(err);
      cb(null,races);
    });
  };
  Race.beforeRemote("prototype.__get__raceTeams", function (ctx,ins,next) {
    ctx.req.query.filter = {
      fields: ["name", "id", "logoUrl"]
    };
    next();
  });
  Race.afterRemote('prototype.__get__raceTeams',function(ctx,ins,next){
    var result = [];
    ins.forEach(function(team){
      var record = {
        name:team.name,
        logoUrl:team.logoUrl,
        id:team.id,
        status:team.status
      };
      result.push(record);
    });
    ctx.res.send(result);
  });
};
