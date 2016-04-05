var xlsx = require('node-xlsx');
var streamifier = require('streamifier');
module.exports = function(Form) {
  Form.remoteMethod(
    'excel',
    {
      accepts: {arg:'id', type:'string'},
      http: {path:'/:id/excel',verb:'get'}
    }
  );
  Form.excel = function() {};
  Form.beforeRemote('excel',function(ctx,instance,next){
    Form.findById(ctx.req.params.id, {include: 'formResults'}, function (err, form) {
      if (err) {
        next(err);
      } else {
        try {
          ctx.res.setHeader('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6');
          ctx.res.setHeader("Pragma", "No-cache");  
          ctx.res.setHeader("Cache-Control", "No-cache");  
          ctx.res.setHeader("Expires", 0);
          ctx.res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(form.title) + '.xlsx;filename*=utf-8');
          var form = form.toJSON();
          var formResult = form.formResults;
          var excelTitle = [], result = [], formData = [];
          form._formItems.forEach(function (item) {
            excelTitle.push(item.name);
          });
          formData.push(excelTitle);
          formResult.forEach(function(results){
            results.result.forEach(function (re) {
              result.push(re.name);
            });
            formData.push(result);
            result = [];
          });
          var buffer = xlsx.build([{name: "表单结果", data: formData}]);
          streamifier.createReadStream(buffer).pipe(ctx.res);
        } catch (e) {
          next(e);
        }
      }
    });
  });
	Form.beforeUpdate = function (next, form) {
    if (form.activityId) {
      Form.app.models.Activity.findById(form.activityId, {
        fields: ['started', 'ended']
      }, function (err, activity) {
        if (err) {
          return next(err);
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
