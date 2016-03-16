module.exports = function(Seckill) {
  Seckill.observe('before save', function (ctx, next) {
    if (ctx.instance.started < new Date()) {
      next('活动期间不能修改活动信息');
    } else {
      ctx.instance._seckillItems.forEach(function(item){
        item.margin = item.count; //票项余量初始化
      });
      next();
    }
  });
	//Seckill.beforeRemote('prototype.__get__seckillResults', function(){});
};
