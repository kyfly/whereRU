module.exports = function(Seckill) {
  Seckill.beforeUpdate = function (next, seckill) {
    if (seckill.activityId) {
      Seckill.app.models.Activity.findById(seckill.activityId, {
        fields: ['started', 'ended']
      }, function (err, activity) {
        if (err) {
          return next(err);
        }
        if (seckill.started < activity.started) {
          return next('抢票开始时间不能低于活动开始时间');
        }
        if (activity.started < new Date()) {
          next('活动期间不可修改');
        } else if (activity.ended < new Date()) {
          next('活动已结束');
        } else {
          next();
        }
      });
    } else {
      next();
    }
  };
};
