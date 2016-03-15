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
		console.log(context.modelId);
		context.model.findById(context.modelId, function (err, team) {

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
	//Role.registerResolver('teamOwner', function (role, context, cb) {
	//	var userId = context.accessToken.userId;
	//	if (!userId) {
	//		return reject();
	//	}
	//	//todo...
	//});

};
