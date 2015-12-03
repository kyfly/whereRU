module.exports = function(Contest) {
	// Contest.beforeRemote('find', function (ctx, ins, next) {
	// 	Contest.find({
 //      include:[{
 //      	relation: 'contestOrg',
 //        scope: {
 //          where: {'phone': 17764592171}
 //        }
 //      },{
 //      	relation: 'messages',
 //      	scope: {
 //      		order: 'id DESC',
	// 				limit: 3
 //      	}
 //      }]
	//   }, function (err, ins) {
	//   	var contests = [];
	//   	ins.forEach(function (contest) {
	//   		var p = contest.toJSON();
	//   		if (p.contestOrg) {
	//   			contests.push(p);
	//   		}
	//   	});
	//   	ctx.res.send(contests);
	//   })
	// });
	Contest.remoteMethod('getMySchoolEvents', {
		'accepts': [{
			arg: 'school', type: 'string',
		}],
		'returns': {
			arg: 'events', type: 'array'
		},
		'http': {
			path: '/getMySchoolEvents',
			verb: 'get'
		}
	});
	Contest.getMySchoolEvents = function (school, cb) {
		Contest.find({
			include: {
				relation: 'contestOrg',
				scope: {
					where: {
						school: school
					}
				}
			}
		}, function (err, ins) {
			var contests = [];
			ins.forEach(function (contest) {
				var p = contest.toJSON();
	  		if (p.contestOrg) {
	  			contests.push(p);
	  		}
			});
			cb(err, contests);
		});
	}
};
