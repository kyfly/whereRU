var q = require('q');
var promise = require(__dirname + '/../../modules/model-promise.js');
var app = require('../../server/server');
module.exports = function(User) {
  User.beforeRemote('create', function (ctx, ins, next) {
    ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
    ctx.req.body.created = new Date();
    next();
  });
  User.beforeRemote('login', function (ctx, ins, next) {
    ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
    next();
  });
  User.afterRemote('login', function (ctx, ins, next) {
    User.findById(ins.userId, function (err, user) {
      var token = ins.toJSON();
      token.user = {
        "name": user.name,
        "school": user.school,
        "phone": user.phone,
        "sign": user.sign
      };
      ctx.res.send(token);
    });
  });
  User.afterRemote('create', function (ctx, ins, next) {
    ins.createAccessToken(7200, function (err, token) {
      var token = token.toJSON();
      token.user = {
        "name": ins.name,
        "school": ins.school,
        "phone": ins.phone,
        "sign": ins.sign
      };
      ctx.res.send(token);
    });
  });
  User.afterRemote('prototype.__link__coteries', function (ctx, ins, next) {
    ins.lastView = new Date();
    ins.save();
    next();
  });
  User.afterRemote('prototype.__get__coteries', function (ctx, ins, next) {
    var coteriesFn = [];

    function coterieFn(coterie) {
      var defer = q.defer();
      var lastView = coterie.lastView;
      coterie.articles.count({created: {gt: lastView}}, function (err, count) {
        if (err) {
          defer.reject(err);
        } else {
          coterie = coterie.toJSON();
          coterie.msgCount = count;
          defer.resolve(coterie);
        }
      });
      return defer.promise;
    }

    ins.forEach(function (coterie) {
      coteriesFn.push(coterieFn(coterie));
    });
    q.all(coteriesFn).then(function (data) {
      ctx.res.send(data);
    }, function (err) {
      ctx.res.send(err);
    });
  });
  User.remoteMethod('confirmSchool', {
    accepts: [{
      arg: 'id', type: 'string',
    }, {
      arg: 'studentId', type: 'string',
    }, {
      arg: 'password', type: 'string',
    }],
    returns: {
      arg: 'status', type: 'number'
    },
    http: {
      path: '/:id/confirmSchool', verb: 'post'
    }
  });
  User.confirmSchool = function (id, studentId, password, cb) {
    console.log(id, studentId, password);
    cb(null, 12);
  }
  User.remoteMethod('search', {
    accepts: {
      arg: 'keyword', type: 'string',
    },
    returns: {
      arg: 'users', type: "array"
    },
    http: {
      path: '/search', verb: 'get'
    }
  });
  User.search = function (keyword, cb) {
    var query = [];
    if (keyword) {
      var key = [];// = keyword.replace(' ', '.+');
      var keywords = keyword.split(' ');
      keywords.push(key);
    }
    keywords.forEach(function (keyword) {
      query.push({
        name: {like: keyword}
      });
      query.push({
        sign: {like: keyword}
      });
    });
    User.find({
      where: {or: query},
      fields: ['id', 'name', 'sign', 'headImgUrl']
    }, function (err, User) {
      if (err) return cb(err);
      cb(null, User);
    });
  };
  User.remoteMethod('getMyTeams', {
    accepts: {
      arg: 'id', type: 'string'
    },
    returns: {
      arg: 'teams', type: "array"
    },
    http: {
      path: '/:id/myTeams', verb: 'get'
    }
  });
  User.getMyTeams = function (id, cb) {
    app.models.Member.find({
      where: {userId: id},
      include: {
        relation: 'team',
        scope: {
          fields: ['id', 'name', 'logoUrl']
        }
      }
    }, function (err, team) {
      cb(err, team);
    });
  };
  User.remoteMethod('getInfo', {
    accepts: {
      arg: 'from', type: 'string',
    },
    returns: {
      arg: 'user', type: "array"
    },
    http: {
      path: '/info', verb: 'get'
    }
  });
  User.getInfo = function (from,cb) {
    User.findById(from,{
      fields:['id','phone','name','sign','email','school','sex','academy','studentId','headImgUrl','created','userData']
    },function(err,user){
      if(err) return cb(err);
      cb(null,user);
    });
  };
  User.remoteMethod('getRaceHistories', {
    accepts: {
      arg: 'id', type: 'string'
    },
    returns: {
      arg: 'races', type: 'array'
    },
    http: {
      path: '/:id/raceHistories', verb: 'get'
    }
  });
  User.getRaceHistories = function (id,cb) {
    User.app.models.members.find({
      where:{
        userId:id
      },
      include:{
        relation:'team',
        scope:{
          include:{
            relation:'race',
            scope:{
              fields:['name','imgUrl','started','id','authorName','authorId','ended','created']
            }
          }
        }
      }
    },function(err,members){
      if(err) cb(err);
      var races=[];
      members.forEach(function(member){
        races.push(member.team.race);
      });
      cb(null,races);
    });
  };
  User.remoteMethod('getActivitiesHistories', {
    accepts: {
      arg: 'id', type: 'string',
    },
    returns: {
      arg: 'activities', type: "array"
    },
    http: {
      path: '/:id/activitiesHistories', verb: 'get'
    }
  });
  User.afterRemote('prototype.__get__teams', function (ctx, ins, next) {
    var result = [];
    ins.forEach(function (team) {
      var record = {
        name: team.name,
        logoUrl: team.logoUrl,
        id: team.id
      };
      result.push(record);
    });
    ctx.res.send(result);
  });
  User.getActivitiesHistories = function (id,cb) {
    User.app.models.FormResult.count({userId:id},function(err,count){});
  };
  User.beforeRemote('prototype.__updateAttributes', function () {
  });
  User.afterRemote('prototype.__updateAttributes', function () {
  });
  User.beforeRemote('prototype.__findById__formResults', function () {
  })
  User.beforeRemote('prototype.__findById__voteResults', function () {
  })
  User.beforeRemote('prototype.__findById__seckillResults', function () {
  })
  User.beforeRemote('prototype.__create__voteResults', function (ctx, ins, next) {
    var voteId = ctx.req.body.voteId;
    var voteItem = ctx.req.body.result;
    var Vote = User.app.models.Vote;
    Vote.findById(voteId, function (err, vote) {
      for (var index in voteItem) {
        console.log(index);
        vote.voteItems.findById(voteItem[index], function (err, item) {
          item.count = item.toJSON().count + 1;
          item.save();
        })
      }
    });
    next();
  });
  User.afterRemote('prototype.__updateById__teams', function () {
  });
  User.beforeRemote('prototype.__create__likeUsers', function (ctx, ins, next) {
    var articleId = ctx.req.body.articleId;
    var userId = ctx.req.params.id;
    app.models.likeUser.find({
      where: {
        articleId: articleId,
        userId: userId
      }
    }, function (err, likeuser) {
      if (likeuser) {
        ctx.res.send({
          created: likeuser.created,
          articleId: likeuser.articleId,
          userId: userId,
          status: 0
        });
      }
      else {
        next();
      }
    });
  });
  User.afterRemote('prototype.__create__likeUsers', function (ctx, ins, next) {
    ctx.res.send({
      created: ins.created,
      articleId: ins.articleId,
      userId: ins.userId,
      status: 1
    });
  });
  User.beforeRemote('prototype.__create__seckillResults', function (ctx, ins, next) {
    var Seckill = User.app.models.Seckill;
    /*promise(User.app.models.SeckillResult, 'count', {
      query: {
        userId: ctx.req.params.id,
        seckillId: ctx.req.body.seckillId,
        get: true
      }
    })
      .then(function (count) {
        if (count > 0) {
          return ctx.res.send({
            "error": {
              "status": 1000,
              "message": "您已经抢到了。"
            }
          });//抢过票了
        } else {
          return promise(Seckill, 'findById', {id: ctx.req.body.seckillId})
        }
      })
      .then(function (seckill) {

      })

    return;
    */
    app.models.SeckillResult.count({
      userId: ctx.req.params.id,
      seckillId: ctx.req.body.seckillId,
      get: true
    }, function (err, count) {
      if (err) return next(err);
      if (count > 0) {
        ctx.res.send({
          "error": {
            "status": 1000,
            "message": "您已经抢到了。"
          }
        });//抢过票了
      } else {
        Seckill.findById(ctx.req.body.seckillId, function (err, seckill) {
          if (!seckill.toJSON()._seckillItems.length > 0) {
            //无抢票项
            Seckill.margin(ctx.req.body.seckillId, function (err, result) {
              if(result>0){//有余票，就算抢到了
                ctx.instance.seckillResults.create({
                  created:new Date(),
                  get:true,
                  verifyId:ctx.req.body.verifyId
                },function(err,ins){
                  if(err) return next(err);
                  ctx.res.send(ins);
                });
              }else{
                ctx.instance.seckillResults.create({
                  created:new Date(),
                  get:false,
                  verifyId:ctx.req.body.verifyId
                },function(err,ins){
                  if(err) return next(err);
                  ctx.res.send({
                    "error": {
                      "status": 1001,
                      "message": "已被抢完。"
                    }
                  });//抢过票了
                });
              }
            });
          } else {
            seckill.seckillItems.findById(ctx.req.body.itemId, function (err, item) {
              if (item.toJSON().margin > 0) {
                //有余票额
                item.margin = item.toJSON().margin - 1;
                ctx.instance.seckillResults.create({
                  created:new Date(),
                  get:true,
                  verifyId:ctx.req.body.verifyId,
                  itemId:ctx.req.body.itemId
                },function(err,ins){
                  if(err) return next(err);
                  ctx.res.send(ins);
                });
              } else {
                ctx.instance.seckillResults.create({
                  created:new Date(),
                  get:false,
                  verifyId:ctx.req.body.verifyId,
                  itemId:ctx.req.body.itemId
                },function(err,ins){
                  if(err) return next(err);
                  ctx.res.send({
                    "error": {
                      "status": 1001,
                      "message": "已被抢完。"
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  });
};
