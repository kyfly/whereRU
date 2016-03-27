var q = require('q');
var promise = require(__dirname + '/../../modules/model-promise.js');
var hdu = require(__dirname + '/../../modules/hdu.js');
var http = require('http');
var wechat = require('wechat-oauth');
module.exports = function(User) {
  /**
   * 用户注册，给用户添加默认头像
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {               ctx.req.body.email [description]
   * @return {[type]}       [description]
   */
  User.beforeRemote('create', function (ctx, ins, next) {
    ctx.req.body.headImgUrl = User.app.get('default').headImg;
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
        "headImgUrl": ins.headImgUrl,
        "studentId": ins.studentId
      };
      ctx.res.send(token);
    });
  });
  User.beforeRemote("resetPassword", function (ctx, ins, next) {
    if (!ctx.req.accessToken) {
      return next('不允许的操作');
    }
    User.findById(ctx.req.accessToken.userId, function (err, user) {
      if (err)
        return next(err);
      user.hasPassword(ctx.req.body.lastPwd).then(function (data) {
        if (data) {
          user.password = ctx.req.body.newPwd;
          user.save(function (err, user) {
            if (err)
              return next(err);
            else {
              ctx.res.send(200)
            }
          });
        } else {
          next('密码错误');
        }
      })
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
        "headImgUrl": user.headImgUrl,
        "studentId": user.studentId
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
    },{
      arg: 'studentId', type: 'string',
    },{
      arg: 'password', type: 'string',
    },{
      arg: 'academy', type: 'string',
    }],
    returns: {
      arg: 'status', type: 'number',
    },
    http: {
      path: '/:id/confirmSchool', verb: 'post'
    }
  });
  User.confirmSchool = function (id, studentId, password, academy, cb) {
    hdu.ihdu(studentId, password, function (name) {
      if (name) {
        User.findById(id, function (err, user) {
          if (err)
              return cb(err);
          user.name = name;
          user.studentId = studentId;
          user.academy = academy;
          user.save(function (err, user) {
            if (err)
              return cb(err);
            cb(null, 200);
          });
        });
      } else {
        cb("验证失败");
      }
    });
  };
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
          where: {deleted: false},
          fields: ['id', 'name', 'logoUrl', "userId"]
        }
      }
    }, function (err, teamsIns) {
      var teams = [];
      //TODO 待真实测试
      teamsIns.forEach(function (tepMember) {
        var team = tepMember.toJSON().team;
        var member = tepMember.toJSON();
        if (team) {
          tepMember = {};
          tepMember.team = team;
          tepMember.owner = id == team.userId;
          tepMember.role = member.department;
          teams.push(tepMember);
        }
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
        if (!results.form) {
          return;
        }
        var activity = results.form.activity;
        if (activity) {
          pushActivity (activity, results);
        }
      });
      user.voteResults.forEach(function (results) {
        if (!results.vote) {
          return;
        }
        var activity = results.vote.activity;
        pushActivity (activity, results);
      });
      user.seckillResults.forEach(function (results) {
        if (!results.seckill) {
          return;
        }
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
    ctx.req.body.created = new Date();
    function createMember(team, user) {
      var userInfo = {
        "phone": user.phone,
        "name": user.name,
        "school": user.school,
        "verified": true,
        "userId": user.id,
        "department": "负责人",
        "created": new Date(),
        "teamId": team.id
      };
      team.members.create(userInfo);
    }
    function createCoterie(team) {
      User.app.models.Coterie.create({
        name: team.name,
        logoUrl: team.logoUrl,
        created: new Date(),
        teamId:  team.id,
        id: team.id,
        school: team.school,
        type: team.type,
        desc: team.desc
      });
    }
    ctx.instance.teams.create(ctx.req.body, function (err, team) {
      if (err) {
        return next(err);
      }
      createCoterie(team);
      createMember(team, ctx.instance);
      ctx.res.send(team)
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
    if (ctx.req.body.password && !updateData.isVerify) {
      updateData.isVerify = true;
    } else if (ctx.req.body.password) {
      next('非允许操作');
      return;
    }
    if (ctx.req.body.phone) {
      ctx.req.body.email = ctx.req.body.phone + '@etuan.org';
      User.findOne({
        where: {
          phone: ctx.req.body.phone
        }
      }, function (err, user) {
        if (err) {
          return next(err);
        }
        if (user && user.id != ctx.req.body.id) {
          next('手机号被注册了,如果是你自己注册的请登录后,绑定微信号');
        } else {
          ctx.instance.histories.create({
            created: new Date(),
            updateData: updateData
          }, function (err, histories) {
            if (err)  throw err;
          });
          next();
        }
      })
    }
  });
  /**
   * 用户信息更新处理
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {             } [description]
   * @return {[type]}       [description]
   */
  User.afterRemote('prototype.__updateAttributes', function (ctx, ins, next) {
    ins.teams.updateAll({
        userId: ins.id
    }, {school: ins.school}, function() {});
    User.app.models.Member.updateAll({
        userId: ins.id
    }, {
      "phone": ins.phone,
      "name": ins.name,
      "school": ins.school,
      "academy": ins.academy
    }, function () {});
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

      for(var i =0; i<form._formItems.length; i++) {
        activityResult.push({
          q: form._formItems[i].name,
          w: result.result[i].name,
          url:result.result[i].url
        });
      }
      result.result = activityResult;
      ctx.res.send({
        activity: form.activity,
        results: result
      });
    });
  });
  /**
   * 用户获取参与投票活动所投项
   * @param  {[type]} ) {             } [description]
   * @return {[type]}   [description]
   */
  User.afterRemote('prototype.__findById__voteResults', function (ctx,ins,next) {
    var results = ins.toJSON();
    ins.vote({
      include: {
        relation: 'activity',
        scope: {
          fields: ['title', 'authorName', 'authorId', 'id']
        }
      }
    }, function (err, vote) {
      if (err)
      {
        return next(err);
      }
      voteItems = vote.toJSON()._voteItems;
      voteItems.forEach(function (item) {
        for (id in results.result) if (item.id === results.result[id]){
          item.chioce = true;
        } else {
          item.chioce = false;
        }
      });
      results.result = voteItems;
      ctx.res.send({
        activity: vote.toJSON().activity,
        results: results
      });
    });
  })
  /**
   * 用户获取参与抢票活动所得抢票结果
   * @param  {[type]} ) {             } [description]
   * @return {[type]}   [description]
   */
  User.afterRemote('prototype.__findById__seckillResults', function (ctx, ins, next) {
    var results = ins.toJSON();
    ins.seckill({
      include: {
        relation: 'activity',
        scope: {
          fields: ['title', 'authorName', 'authorId', 'id', 'imgUrl', 'ended']
        }
      }
    }, function (err, seckill) {
      seckill.toJSON()._seckillItems.forEach(function (item) {
        if (item.id === results.itemId) {
          results.itemId = item.name;
          return;
        }
      });
      
      ctx.res.send({
        activity: seckill.toJSON().activity,
        results: results
      });
    });
  })
  User.beforeRemote('prototype.__create__formResults', function (ctx, ins, next) {
    ctx.instance.formResults.count({
      formId: ctx.req.body.formId,
      userId: ctx.req.params.id
    }, function (err, count) {
      if (count) {
        ctx.res.send({
          "status": 1000,
          "message": "您已经参与过了"
        });
      } else {
        next();
      }
    })
  });
  /**
   * 处理用户投票信息，投票后需要吧投票项数量加一
   * @param  {[type]} ctx   [description]
   * @param  {[type]} ins   [description]
   * @param  {[type]} next) {               var voteId [description]
   * @return {[type]}       [description]
   */
  User.beforeRemote('prototype.__create__voteResults', function (ctx, ins, next) {
    ctx.instance.voteResults.count({
      voteId: ctx.req.body.voteId,
      userId: ctx.req.params.id
    }, function (err, count) {
      if (count > 0) {
        ctx.res.send({
          "status": 1000,
          "message": "您已经投过了"
        });
      } else {
        next()
      }
    });
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
    User.app.models.SeckillResult.count({
        userId: ctx.req.params.id,
        seckillId: ctx.req.body.seckillId,
        get: true
    }, function (err, count) {
      if (count > 0) {
        ctx.res.send({
          "status": 1000,
          "message": "您已经抢过了"
        });
      } else {
        next();
      }
    })
  });
  User.afterRemote('prototype.__create__seckillResults', function (ctx, ins, next) {
    if (!ins.get)
      ctx.res.send({
        status: 1000,
        message: "对不起,被抢光了"
      });
    else
      next();
  });
  User.remoteMethod('auth2wechat', {
    accepts: [{
          "type": "string",
          "arg": "code",
          required: true
        },{
          "type": "string",
          "arg": "state",
          required: true
        },{
          "type": "string",
          "arg": "action",
          required: true
        }],
    results: {
      "type": "object",
      "arg": "data"
    },
    http: {
      path: '/auth2wechat', verb: 'get'
    }
  });
  User.beforeRemote('auth2wechat', function (ctx, ins, next) {
    var code = ctx.req.query.code;
    var state = ctx.req.query.state;
    var action = ctx.req.query.action;

    var client = new wechat(User.app.get('wechat').appID, User.app.get('wechat').appsecret);
    function getUser (callback) {
      client.getAccessToken(code, function (err, result) {
        if (err) {
          callback(err);
        } else {
          client.getUser(result.data.openid, function (err, userDate) {
            callback(err, userDate);
          });
        }
      });
    }
    function loginUser(userInstance, aouthInstance) {
      userInstance.createAccessToken(7200, function (err, token) {
        if (err) {
          return next(err);
        }
        var token = token.toJSON();
        token.user = {
          "name": userInstance.name,
          "school": userInstance.school,
          "phone": userInstance.phone,
          "sign": userInstance.sign,
          "headImgUrl": userInstance.headImgUrl,
          "studentId": userInstance.studentId
        };
        ctx.res.send({token: token, aouth: aouthInstance});
      });
    }
    if (action === 'bind') {
      User.findById(state, function (err, user) {
        if (err || !user) {
          next('该连接不存在');
          return;
        }
        getUser(function (err, userDate) {
          if (err) {
            next('获取用户信息失败');
          } else {
            user.openid = userDate.openid;
            user.headImgUrl = userDate.headimgurl;
            User.findOne({
              where: {
                openid: userDate.openid
              }
            }, function (err, weUser) {
              if (err) {
                next('服务器错误');
              } else if (weUser) {
                if (weUser.phone) {
                  next('该微信号已经和账户绑定');
                  return;
                }
                var models = ['Article', 'Comment', 'CoteriewhereRUUser', 'FormResult', 'Member', 'Reply', 'SeckillResult', 'Team', 'VoteResult'];
                if (weUser.id)
                  models.forEach(function (model) {
                    User.app.models[model].updateAll({
                      userId: weUser.id
                    }, {
                      userId: user.id
                    }, function () {});
                  });
                weUser.destroy();
              }
              user.save(function (err, user) {
                loginUser(user, undefined);
              });
            });
           
          }
        });
      });
    } else if (action === 'login') {
      User.app.models.Aouth.findById(state, function (err, aouth) {
        if (err||!aouth) {
          next('该连接不存在');
          return;
        }
        getUser(function (err, userDate) {
          if (err) {
            next('获取用户信息失败');
          } else {
            User.findOne({where: {openid: userDate.openid}}, function (err, user) {
              if (err) {
                next(err);
              } else if (user) {
                  aouth.openid = user.toJSON().openid;
                  aouth.userId = user.toJSON().id;
                  aouth.save(function (err, ins) {
                    if (err) {
                      next(err);
                    } else {
                      loginUser(user, ins);
                    }
                  });
              } else {
                User.create({
                  name: userDate.nickname,
                  sex: userDate.sex === 1? "男": "女",
                  headImgUrl: userDate.headimgurl,
                  openid: userDate.openid,
                  school: "未知",
                  email: userDate.openid + "@etuan.org",
                  password: userDate.openid,
                  isVerify: false
                }, function (err, newUser) {
                  if (err) {
                    next(err);
                    return;
                  }
                  aouth.openid = newUser.openid;
                  aouth.userId = newUser.toJSON().id;
                  aouth.save(function (err, ins) {
                    if (err) {
                      next(err);
                    } else {
                      loginUser(newUser, ins);
                    }
                  });
                });
              }
            });
          }
        });
      });
    }
  });
  User.auth2wechat= function (code, state, action, cb) {
  };
  User.remoteMethod('checkPhone', {
    accepts: [{
      "type": "string",
      "arg": "id"
    },{
      "type": "string",
      "arg": "phone"
    }],
    results: {
      "type": "boolean",
      "arg": "aouth"
    },
    http: {
      path: '/:id/checkPhone', verb: 'get'
    }
  });
  User.checkPhone = function (id, phone, cb) {
    User.findOne({
      where:
      {
        phone: phone
      }
    }, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (user.id == id) {
        cb(null, true);
      } else {
        cb('手机号被注册了,如果是你自己注册的,请登录后绑定微信号')
      }
    });
  }
};
