module.exports = function(Form) {
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
