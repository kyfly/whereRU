var xlsx = require('node-xlsx');
var streamifier = require('streamifier');
module.exports = function(Seckill) {
  Seckill.remoteMethod(
    'excel',
    {
      accepts: {arg:'id', type:'string'},
      http: {path:'/:id/excel',verb:'get'}
    }
  );
  Seckill.excel = function() {};
  Seckill.beforeRemote('excel',function(ctx,instance,next){
    Seckill.findById(ctx.req.params.id, {
      include: {
        relation: 'seckillResults',
        scope: {
          where: {
            get: true
          },
          fields: ['verifyId', 'itemId']
        }
      }
    }, function (err, seckill) {
      if (err) {
        next(err);
      } else {
        try {
          ctx.res.setHeader('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6');
          ctx.res.setHeader("Pragma", "No-cache");  
          ctx.res.setHeader("Cache-Control", "No-cache");  
          ctx.res.setHeader("Expires", 0);
          ctx.res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(seckill.title) + '.xlsx;filename*=utf-8');
          var seckill = seckill.toJSON();
          var seckillResult = seckill.seckillResults;
          var excelTitle = ['验证信息', '票名'], 
              result = [], 
              seckillData = [];
      
          seckillData.push(excelTitle);
          seckillResult.forEach(function(results){
            seckill._seckillItems.forEach(function (item) {
              if (results.itemId === item.id) {
                result.push(results.verifyId);
                result.push(item.name);
              }
            });
            seckillData.push(result);
            result = [];
          });
          var buffer = xlsx.build([{name: "抢票结果", data: seckillData}]);
          streamifier.createReadStream(buffer).pipe(ctx.res);
        } catch (e) {
          next(e);
        }
      }
    });
  });
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
