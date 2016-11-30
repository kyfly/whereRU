var EventEmitter = require('events').EventEmitter;   
var e = new EventEmitter();
module.exports = function(Aouth) {
	Aouth.afterRemote('findById', function (ctx, ins, next) {
		if (ins.toJSON().userId) {
			var User = Aouth.app.models.whereRUUser;
			User.findById(ins.userId, function (err, user) {
				if (err) {
					next(err);
				} else {
					user.createAccessToken(43200, function (err, token) {
			      var token = token.toJSON();
			      token.user = {
			        "name": user.name,
			        "school": user.school,
			        "phone": user.phone,
			        "sign": user.sign,
			        "headImgUrl": user.headImgUrl,
			        "studentId": user.studentId
			      };
			      ctx.res.send({token: token, aouth: ins});
			      ins.destroy();
			    });
				}
			});
		} else {
			next();
		}
	});
};
