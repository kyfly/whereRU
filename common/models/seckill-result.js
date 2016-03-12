module.exports = function(SeckillResult) {
	SeckillResult.observe('before save', function (ctx, next) {
    ctx.instance.seckill({
    	include: 'activity'
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
				seckill.seckillItems.forEach(function (item) {
					if (item.id === ctx.instance.itemId)
					{
						if (item.margin > 0) {
							item.margin --;
							seckill.save();
							ctx.instance.get = true;
						}
						else {
							ctx.instance.get = false;
						}
						next();
					}
				});
			}
    });
  });
};
