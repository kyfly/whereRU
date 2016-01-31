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
	Seckill.margin = function (id, cb) {
    Seckill.findById(id, function(err, seckill){
      if(err) cb(err);
      if (!seckill.toJSON()._seckillItems.length) {
        seckill.seckillResults.count({get: true}, function (err, count) {
          if(err) return cb(err);
          var total = seckill.total;
          var result = total - count;
          cb(null,result);
  });
      } else {
        var result = [];
        seckill.seckillItems(function (err, items) {
          if(err) return cb(err);
          items.forEach(function (item) {
            var item = item.toJSON();
            result.push({
              id:item.id,
              margin:item.margin
            });
          });
          cb(null,result);
        });
      }
    });
  };
	Seckill.beforeRemote('prototype.__get__seckillResults', function(){});
};
