/**
 * 错误代码注释区
 * 1000 该手机号已经被注册
 * 1001 获取圈子列表失败
 * 1002 用户搜索失败
 * 1004 用户信息获取失败
 * 1005 团队列表获取失败
 */
var q = require('q');
var promise = require(__dirname + '/../../modules/model-promise.js');
module.exports = function(User) {
  /**
   * 用户注册，给用户添加默认头像
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {               ctx.req.body.email [description]
   * @return {[type]}       [description]
   */
  User.beforeRemote('create', function (ctx, ins, next) {
    ctx.req.body.headImgUrl = "http://oss.etuan.org/whereru/headImgUrl/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg"
    ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
    ctx.req.body.created = new Date();
    User.count({ phone: ctx.req.body.phone }, function (err, count) {
      if (count > 0) {
        next({"status": 1000, "message": "该手机号已经被注册"})
      } else {
        next();
      }
    });
  });
  /**
   * 用户注册，完成后登录用户
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {               ins.createAccessToken(7200, function (err, token) {      var token [description]
   * @return {[type]}       [description]
   */
  User.afterRemote('create', function (ctx, ins, next) {
    ins.createAccessToken(7200, function (err, token) {
      var token = token.toJSON();
      token.user = {
        "name": ins.name,
        "school": ins.school,
        "phone": ins.phone,
        "sign": ins.sign,
        "headImgUrl": ins.headImgUrl
      };
      ctx.res.send(token);
    });
  });
  //用户登录，并返回用户信息
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
        "sign": user.sign,
        "headImgUrl": ins.headImgUrl
      };
      ctx.res.send(token);
    });
  });
  /**
   * 关注圈子，以及访问圈子更新最后访问时间
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {Date}   next) {               ins.lastView [description]
   * @return {[type]}       [description]
   */
  User.beforeRemote('prototype.__create__coteries', function (ctx, ins, next) {
    ctx.instance.coteries.count({
      coterieId: ctx.req.body.coterieId,
      userId: ctx.instance.toJSON().id
    }, function (err, count) {
      if (err) {
        next(err);
      } else if (count) {
        next({"status": 1006, "message": "已经关注"});
      } else {
        next();
      }
    });
  });
  User.beforeRemote('prototype.__updateById__coteries', function (ctx, ins, next) {
    ctx.instance.coteries.findOne({
      where: {
        userId: ctx.req.params.id,
        coterieId: ctx.req.params.fk
      }
    }, function (err, userCoterie) {
      if (err) {
        next(err);
      } else {
        userCoterie.lastView = new Date();
        userCoterie.save(function (err, userCoterie) {
          ctx.res.send(200);
        });
      }
    })
  })
  /**
   * 用户所拥有的圈子列表
   * @param  {[type]} ctx      [description]
   * @param  {[type]} ins      [description]
   * @param  {Array}  next)    {                       var coteriesFn [description]
   * @param  {[type]} function (err,         count) {                                                               if (err) {          defer.reject(err);        } else {          coterie [description]
   * @param  {[type]} function (err)         {                                      ctx.res.send(err [description]
   * @return {[type]}          [description]
   */
  User.beforeRemote('prototype.__get__coteries', function (ctx, ins, next) {
    ctx.req.query.filter = {
      include: 'coterie'
    };
    next();
  });
  User.afterRemote('prototype.__get__coteries', function (ctx, ins, next) {
    var coteriesFn = [];
    function coterieFn(userCoterie) {
      var defer = q.defer();
      var lastView = userCoterie.lastView;
      userCoterie.coterie({
        coterieId: userCoterie.coterieId,
        include: {
          relation: 'articles',
          scope: {
            where: {
              created: {gt: lastView}
            }
          }
        }
      }, function (err, coterie) {
        if (err) {
          defer.reject(err);
        } else {
          coterie = coterie.toJSON();
          coterie.msgCount = coterie.articles.length;
          defer.resolve(coterie);
        }
      })
      return defer.promise;
    }

    ins.forEach(function (coterie) {
      coteriesFn.push(coterieFn(coterie));
    });
    q.all(coteriesFn).then(function (data) {
      ctx.res.send(data);
    }, function (err) {
      next({"status": 1001, "message": "获取圈子列表失败"});
    });
  });
  /**
   * 用户学号验证
   * @type {Array}
   */
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
    //TODO 根据用户ID验证用户是否属于该学校
  }
  /**
   * 用户搜索
   * @type {Object}
   */
  User.remoteMethod('search', {
    accepts: {
      arg: 'keyword',
      type: 'string',
      required: true
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
    var keywords = keyword.split(' ');
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
      if (err)
        return cb({"status": 1002, "message": "用户搜索失败"});
      cb(null, User);
    });
  };
  /**
   * 用户所有团队接口
   * @type {Object}
   */
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
  /**
   * 获取用户所有团队列表，如果用户为所有者则设置owner为true，否者为false
   * @param  {[type]}   id [description]
   * @param  {Function} cb [description]
   * @return {[type]}      [description]
   */
  User.getMyTeams = function (id, cb) {
    User.app.models.Member.find({
      where: {userId: id,verified: true},
      include: {
        relation: 'team',
        scope: {
          fields: ['id', 'name', 'logoUrl', "userId"]
        }
      }
    }, function (err, teamsIns) {
      var teams = [];
      //TODO 待真实测试
      teamsIns.forEach(function (tepMember) {
        var team = tepMember.toJSON().team;
        var member = tepMember.toJSON();
        tepMember = {};
        tepMember.team = team;
        tepMember.owner = id == team.userId;
        tepMember.role = member.department;
        teams.push(tepMember);
      });
      cb(null, teams);
    });
  };
  /**
   * 获取当前登录用户信息接口
   * @type {Object}
   */
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
	User.getInfo = function () {}
  /**
   * 获取当前登录用户信息，该接口待修改
   * @param  {[type]} ctx      [description]
   * @param  {[type]} ins      [description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}          [description]
   */
	User.beforeRemote('getInfo', function (ctx, ins, next) {
		var userId = ctx.req.accessToken.userId;
		User.findById(userId, {
			include : 'data'
		}, function (err, data) {
			if (err) {
				next({"status": 1004, "message": "用户信息获取失败"});
			} else {
				ctx.res.send(data);
			}

		});
	})
  /**
   * 获取用户参赛历史接口
   * @type {Object}
   */
	User.remoteMethod('getRaceHistories', {
		accepts: {
			arg: 'id', type: 'string',
		},
		returns: {
			arg: 'races', type: "array"
		},
		http: {
			path: '/:id/raceHistories', verb: 'get'
		}
	});
  /**
   * 获取用户参赛历史
   * @return {[type]} [description]
   */
	User.getRaceHistories = function (id, cb) {
    //TODO 通过用户所在团队参与的竞赛，查询竞赛信息
    //数据太乱，待真实数据测试
    User.app.models.Member.find({
      where: { userId: id },
      include: {
        relation: 'team',
        scope: {
          include: {
            relation: 'partakedRaces'
          }
        }
      }
    }, function (err, users) {
      var races = [];
      users.forEach(function (user) {
        user = user.toJSON();
        if (user.team && user.team.partakedRaces) {
          races.push.apply(races, user.team.partakedRaces)
        }
      });
      cb(null, races);
    });
  };
  /**
   * 获取用户活动历史接口
   * @type {Object}
   */
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
  /**
   * 获取用户参与活动历史
   * @return {[type]}         [description]
   */
  User.getActivitiesHistories = function (id, cb) {
    User.findById(id, {
      include: [{
        formResults:{form: 'activity'}
      },{
        voteResults:{vote: 'activity'}
      },{
        seckillResults: {seckill: 'activity'}
      }]
    }, function (err, user) {
      var activities = [];
      user = user.toJSON();
      user.formResults.forEach(function (results) {
        var activity = results.form.activity;
        pushActivity (activity, results);
      });
      user.voteResults.forEach(function (results) {
        var activity = results.vote.activity;
        pushActivity (activity, results);
      });
      user.seckillResults.forEach(function (results) {
        var activity = results.seckill.activity;
        pushActivity (activity, results);
      });
      function pushActivity (activity, results) {
        activities.push({
          authorId: activity.authorId,
          authorName: activity.authorName,
          id: activity.id,
          imgUrl: activity.imgUrl,
          title: activity.title,
          actType: activity.actType,
          created: results.created,
          resultId: results.id
        });
      }
      cb(err, activities);
    });
  };
  User.remoteMethod('getLikeArticles', {
    accepts: {
      arg: 'id', type: 'string',
    },
    returns: {
      arg: 'articles', type: "array"
    },
    http: {
      path: '/:id/likeArticles', verb: 'get'
    }
  });
  User.getLikeArticles = function (id, cb) {
    User.findById(id, function (err, user) {
      user.likeUsers({
        where: {
          userId: id
        },
        include: 'article'
      }, function (err, articles) {
        cb(err, articles);
      });
    });
  };
  /**
   * 获取用户所拥有的团队列表
   * @param  {[type]} ctx     [description]
   * @param  {[type]} ins     [description]
   * @param  {Array}  next){                 var result [description]
   * @return {object}         成功返回团队列表，失败返回错误信息
   */
  User.beforeRemote('prototype.__get__teams', function (ctx, ins, next){
    ctx.instance.teams({
      fields: ["id", "name", "logoUrl", 'desc']
    }, function (err, teams) {
      if (err) {
        throw {"status": 1005, "message": "团队列表获取失败"}
      } else {
        ctx.res.send(teams);
      }
    })
  });
  User.beforeRemote('prototype.__create__teams', function (ctx, ins, next){
    var user = ctx.instance.toJSON();
    ctx.req.body.school = user.school;
    ctx.instance.teams.create(ctx.req.body, function (err, data) {
      var userInfo = {
        "phone": user.phone,
        "name": user.name,
        "school": user.school,
        "verified": true,
        "userId": user.id,
        "department": "负责人",
        "created": new Date()
      };
    console.log(user)
      data.members.create(userInfo);
      ctx.res.send(data)
    })
  });

  /**
   * 用户信息跟新处理，保存用户修改记录
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {             } [description]
   * @return {[type]}       [description]
   */
  User.beforeRemote('prototype.updateAttributes', function (ctx, ins, next) {
    var updateData = ctx.req.body;
    console.log(updateData);
    if (ctx.req.body.phone) {
      ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
    }
    ctx.instance.histories.create({
      created: new Date(),
      updateData: updateData
    }, function (err, histories) {
      if (err)  throw err;
    });
    next();
  });
  /**
   * 用户信息更新处理
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {             } [description]
   * @return {[type]}       [description]
   */
  User.afterRemote('prototype.__updateAttributes', function (ctx, ins, next) {
    //TODO 暂时不需任何操作
    next();
  });
   /**
   * 更新团队信息
   * @param  {[type]} ) {             } [description]
   * @return {[type]}   [description]
   */
  User.afterRemote('prototype.__updateById__teams', function () {
    //TODO 需要把更新的内容存到团队历史
  });
  /**
   * 用户标识喜欢的文章
   * @param  {[type]} ctx      [description]
   * @param  {[type]} ins      [description]
   * @param  {[type]} next)    {                          var articleId [description]
   * @param  {[type]} function (err,         likeuser) {                               if (likeuser) {        ctx.res.send({          created: likeuser.created,          articleId: likeuser.articleId,          userId: userId,          status: 0        });      }      else {        next();      }    });  } [description]
   * @return {[type]}          [description]
   */
  User.beforeRemote('prototype.__create__likeUsers', function (ctx, ins, next) {
    var articleId = ctx.req.body.articleId;
    var userId = ctx.req.params.id;
    User.app.models.LikeUser.findOne({
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
  /**
   * [description]
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {               ctx.res.send({      created: ins.created,      articleId: ins.articleId,      userId: ins.userId,      status: 1    });  } [description]
   * @return {[type]}       [description]
   */
  User.afterRemote('prototype.__create__likeUsers', function (ctx, ins, next) {
    ctx.res.send({
      created: ins.created,
      articleId: ins.articleId,
      userId: ins.userId,
      status: 1
    });
  });
  /**
   * 用户获取参与表单活动所填写内容以及对应表单项
   * @param  {[type]} ) {             } [description]
   * @return {[type]}   [description]
   */
  User.afterRemote('prototype.__findById__formResults', function (ctx,ins,next) {
    var result = ins.toJSON();
    ins.form({
      include: {
        relation: 'activity',
        scope: {
          fields: ['title', 'authorName', 'authorId', 'id']
        }
      }
    }, function (err, form) {
      if (err)
        return next(err);
      var form = form.toJSON();
      var activityResult = [];
      for(var i =0; i<form._formItems[i].length; i++) {
        activityResult.push({
          q: form._formItems[i].name,
          w: result.result[i].name,
          url:result.result[i].url
        });
      }
      ctx.res.send({
        activity: form.activity,
        result: activityResult
      });
    })
    // var result=[];
    // User.app.models.FormResult.findById(formResultsId,
    //   {fields:['verifyId','created','id','formId','userId','result']},
    //   function(err,formResults){
    //   User.app.models.Form.findById(formResults.formId.toJSON(),function(err,form){
    //     for(var i =0;i<form._formItems.length;i++) {
    //       var record = {
    //         q: form._formItems[i].name,
    //         w: formResults.result[i].name,
    //         url:formResults.result[i].url
    //       };
    //       result.push(record);
    //     }
    //     formResults.result = result;
    //     ctx.res.send(formResults);
    //   });
    // });
  });
  /**
   * 用户获取参与投票活动所投项
   * @param  {[type]} ) {             } [description]
   * @return {[type]}   [description]
   */
  User.beforeRemote('prototype.__findById__voteResults', function (ctx,ins,next) {
    var userId = ctx.req.params.id;
    var voteResultsId = ctx.req.params.fk;
    User.app.models.VoteResult.findById(voteResultsId,{fields:['verifyId','created','id','voteId','userId','result']},function(err,voteResults){
      //User.app.models.Vote.findById(voteResults.voteId.toJSON(),function(err,vote){
        Vote.voteItems(function(results){
          for(var i =0;i<results.length;i++) {
            results[i].choice = voteResults.result[i] ? true : false;
          }
          voteResults.result = result;
          ctx.res.send(voteResults);
        });
      //});
    });
  })
  /**
   * 用户获取参与抢票活动所得抢票结果
   * @param  {[type]} ) {             } [description]
   * @return {[type]}   [description]
   */
  User.beforeRemote('prototype.__findById__seckillResults', function () {
    //TODO  查询某个活动结果，可以通过活动结果获取抢票信息，
  })
  /**
   * 处理用户投票信息，投票后需要吧投票项数量加一
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {               var voteId [description]
   * @return {[type]}       [description]
   */
  User.beforeRemote('prototype.__create__voteResults', function (ctx, ins, next) {
    var voteId = ctx.req.body.voteId;
    var voteItem = ctx.req.body.result;
    var Vote = User.app.models.Vote;
    //TODO 判断用户是否投票过，并过来周期时间，可考虑hook
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
  User.beforeRemote('prototype.__get__articles', function (ctx, ins, next) {
    User.app.models.Coterie.__get__articles(ctx, ins, next);
  })
  /**
   * 处理用户抢票信息，检查用户是否参与过抢票并得票参与过且得票直接提示并退出，
   * 参与过但是没得票则可继续抢票，根据用户选择的抢票项，查看对应的票项是否有
   * 余量，有则余量减一，总票数余量减一，GET字段设置为true，没有则保存用户信
   * 息，GET字段设为false。可考虑用hook
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {               var Seckill [description]
   * @return {[type]}       [description]
   */
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
    User.app.models.SeckillResult.count({
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
