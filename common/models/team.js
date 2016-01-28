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
        if(keyword) keyword = keyword.replace(' ','.+');
        Team.find({
            where:
            {
                or:[{name:{like:keyword}},
                    {desc:{like:keyword}},
                    {school:{like:keyword}},
                    {type:{like:keyword}}]
            },
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
			arg: 'limit', type: 'number',
		},{
			arg: 'offset', type: 'number',
		}],
		returns: {
			arg: 'races', type: 'array'
		},
		http: {path: '/mySchoolTeams', verb: 'get'}
	});
	Team.getMySchoolTeams = function (){}
	Team.remoteMethod('getActivitiesData', {
		returns: {
			arg: 'activities', type: 'array'
		},
		http: {path: '/:id/activitiesData', verb: 'get'}
	});
	Team.getActivitiesData = function (){}
	
	//Team.beforeRemote('prototype.__create__members',function () {});
};
