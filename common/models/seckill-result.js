module.exports = function(SeckillResult) {
	SeckillResult.observe('before save', function (ctx, next) {
    ctx.instance.seckill(function (err, seckill) {
	  	if (new Date(ctx.instance.created) < new Date(seckill.started))
	  	{
	  		return next('还没开始呢');
	  	} else {
				seckill.seckillItems.findById(ctx.instance.itemId, function (err, item) {
					if (item.margin > 0) {
						item.margin --;
						item.save();
						ctx.instance.get = true;
					}
					else {
						ctx.instance.get = false;
					}
					next();
				});
			}
    });
  });
};
