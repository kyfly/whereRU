module.exports = function (ContestOrg) {
  ContestOrg.beforeRemote('login', function (ctx, instance, next) {
    ContestOrg.findOne({
      where: {
        email: ctx.req.body.email
      }
    }, function (err, ins) {
      if (err || !ins) {
        ctx.res.send({err: err || '没注册的用户'});
        return;
      }
      ContestOrg.login(ctx.req.body, function (err, token) {
        token.name = ins.name;
        ctx.res.send({err: err, token: token});
      });
    });

  });
  ContestOrg.afterRemote('create', function (ctx, instance, next) {
    ContestOrg.login(ctx.req.body, function (err, token) {
      token.name = instance.name;
      ctx.res.send({err: err, token: token});
    });
  });
};
