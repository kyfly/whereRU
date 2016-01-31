module.exports = function(Team) {
	Team.remoteMethod('search', {
		accepts: {
			arg: 'keyword', type: 'string',
		},
		returns: {
			arg: 'teams', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
  Team.search = function(keyword,cb){
    var query = [];
    if(keyword) {
      key = keyword.replace(' ', '.+');
      keywords = keyword.split(' ');
      keywords.push(key);
    }
    keywords.forEach(function (keyword) {
      query.push({
        name:{like:keyword}
      });
      query.push({
        desc:{like:keyword}
      });
      query.push({
        school:{like:keyword}
      });
      query.push({
        type:{like:keyword}
      });
    });
    Team.find({
        where: { or: query },
        fields:['id','userId','name','logoUrl','desc']
    },function(err,teams){
        if(err) return cb(err);
        cb(null,teams);
    });
};
// 	Team.afterRemote('prototype.__link__joinRaces', function (ctx, ins, next) {
// 		 ins.c = 'aaa';
// 		 ins.save(function (err, r) {
// console.log(err, r);
// 		 });
// 		 next();
// 	});
	Team.beforeRemote('prototype.__create__activities', function (ctx, ins, next) {
		var active = ctx.req.body.active;
		var type = ctx.req.body.actType;
		ctx.req.body.school = ctx.instance.school;
		ctx.req.body.active = undefined;
		ctx.req.body.actType = undefined;
		ctx.instance.activities.create(ctx.req.body, function (err, act) {
			if (type === 'form') {
				act.forms.create(active, function (err, forms) {
					console.log(err, forms);
				});
			}
			else if (type === 'vote') {
				act.votes.create(active, function (err, votes) {
					console.log(err, votes);
				});
			} else if (type === 'seckill') {
				act.seckills.create(active, function (err, seckills) {
					console.log(err, seckills);
				});
			}
		});
		ctx.res.send('success');
	});
	Team.beforeRemote('prototype.__create__races', function (ctx, ins, next) {
		ctx.req.body.school = ctx.instance.school;
		next();
	});
	Team.remoteMethod('getMySchoolTeams', {
		accepts: [{
			arg: 'school', type: 'string',
		},{
			arg: 'last', type: 'date',
		}],
		returns: {
			arg: 'teams', type: 'array'
		},
		http: {path: '/mySchoolTeams', verb: 'get'}
	});
	Team.getMySchoolTeams = function (school,last,cb){
    Team.find({
      where:{school:school,created:{lt:last},hidden:false,deleted:undefined},
      limit:20,
      order:"id desc",
      fields:['id','userId','name','logoUrl','desc','status']
    },function(err,teams){
      if(err) return cb(err);
      cb(null,teams);
    });
  };
	Team.remoteMethod('getActivitiesData', {
		returns: {
			arg: 'activities', type: 'array'
		},
		http: {path: '/:id/activitiesData', verb: 'get'}
	});
	Team.getActivitiesData = function (){};
	//Team.beforeRemote('prototype.__create__members',function () {});
};
