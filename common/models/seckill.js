module.exports = function(Seckill) {
	Seckill.remoteMethod('margin', {
		accepts: {
			arg: 'id', type: 'string'
		},
		returns: {
			arg: 'margin', type: "object"
		},
		http: {
			path: '/:id/margin', verb: 'get'
		}
	});
	Seckill.margin = function () {}
	Seckill.beforeRemote('prototype.__get__seckillResults', function(){});
};
