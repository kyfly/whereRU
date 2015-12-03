module.exports = function(Message) {
	Message.beforeRemote('find', function (ctx, ins, next) {
		Message.find({
			//include: ['contests'],
			
		}, function (err, data) {
			ctx.res.send(data);
		});
	});
};
