module.exports = function(Race) {
	//
	Race.beforeRemote('prototype.__create__notices', function (ctx, ins, next) {
		var form = ctx.req.body.active;
		ctx.req.body.active = undefined;
		ctx.instance.notices.create(ctx.req.body, function (err, notice) {
			if (active)
				notice.form.create(form, function (err, form) {
					ctx.res.send(notice);
				});
			else
				ctx.res.send(notice);
		})
	});
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
	Race.search = function (){}
	Race.remoteMethod('getMySchoolRaces', {
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
		http: {path: '/mySchoolRaces', verb: 'get'}
	});
	Race.getMySchoolRaces = function (){}
};
