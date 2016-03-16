module.exports = function (app) {
	var Role = app.models.Role;
	Role.registerResolver('teamMember', function (role, context, cb) {
		if(context.modelName !== 'Team') {
			return reject();
		}
		var userId = context.accessToken.userId;
		if (!userId) {
			return reject();
		}
		if (!context.modelId) {
			return reject();
		}
		context.model.findById(context.modelId, function (err, team) {
			if (err) {
				return reject();
			}
			team.members.count({'userId': userId}, function (err, count) {
				cb(err, count > 0);
			})
		});
    function reject (err) {
      if (err) {
        return cb(err);
      }
      cb(null, false);
    }
	});
	Role.registerResolver('teamOwner', function (role, context, cb) {
		var userId = context.accessToken.userId;
		if (!userId) {
			return reject();
		}
		app.models[context.modelName].findOne({
			where: {
				id: context.modelId
			}
		}, function (err, ins) {
			if (err || !ins) {
				return reject();
			}
			app.models.Team.findOne({
				where: {
					id: ins.teamId,
					userId: userId
				},
				fields: ['userId']
			}, function (err, team) {
				cb(err, team);
			});
		});
		function reject (err) {
      if (err) {
        return cb(err);
      }
      cb(null, false);
    }
	});

};
