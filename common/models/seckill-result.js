module.exports = function(SeckillResult) {
	SeckillResult.observe('before save', function (ctx, next) {
    ctx.instance.seckill({
    	include: ['activity', 'seckillResults']
    }, function (err, seckill) {
    	if (err) {
    		return next(err);
    	}
			if (new Date(ctx.instance.created) < new Date(seckill.started))
			{
				return next('还没开始呢');
			} else if (new Date(ctx.instance.created) > new Date(seckill.activity.ended)) {
				return next('活动已经结束了');
			} else {
				seckill.seckillResults.count({
					itemId: ctx.instance.itemId
				}, function (err, count) {
					if (err) {
		    		return next(err);
		    	}
		    	for (var i = seckill.toJSON()._seckillItems.length - 1; i >= 0; i--) 
		    		if (seckill.toJSON()._seckillItems[i].id == ctx.instance.itemId) {
		    			if ((seckill.toJSON()._seckillItems[i].count - count) > 0) {
								ctx.instance.get = true;
							}
							else {
								ctx.instance.get = false;
							}
							return next();
		    		}
		    	next('数据有错误');	
				});
			}
    });
  });
};
