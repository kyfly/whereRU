module.exports = function(Activity) {
	//__updateById__forms
	//__updateById__votes
	//__updateById__seckills
	//__destroyById__forms
	//__destroyById__votes
	//__destroyById__seckills
	//这些方法需要检查当前用户使用有权限操作，
	//即这些活动是否为当前用户创建
	Activity.remoteMethod('getMySchoolActiveties', {
		accepts: [{
			arg: 'school', type: 'string',
		},{
			arg: 'limit', type: 'number',
		},{
			arg: 'offset', type: 'number',
		}],
		returns: {
			arg: 'activties', type: 'array'
		},
		http: {path: '/mySchoolActiveties', verb: 'get'}
	});
	Activity.getMySchoolActiveties = function (school, limit, offset, cb) {
		if (!(school && limit && (offset === 0 ? true: false)))
			cb('school, limit, offset must required');
		Activity.find({
			where: {school: school},
			limit: limit || 20,
			skip: offset
		} , function (err, activties) {
			cb(null, activties);
		});
	};
	Activity.remoteMethod('search', {
		accepts: {
			arg: 'keyword', type: 'string',
		},
		returns: {
			arg: 'activties', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
	Activity.search = function (keyword,cb) {
        if(keyword) keyword = keyword.replace(' ','.+');
        Activity.find({
            where:
            {
                or:[{title:{like:keyword}},
                    {authorName:{like:keyword}},
                    {keyword:{like:keyword}}]
            },
            fields:['title','authorName','id','authorId','keyword','imgUrl','created','status']
        },function(err,activities){
            if(err) return cb(err);
            cb(null,activities);
        });
    };
	Activity.remoteMethod('getHotActiveties', {
		accepts: {
			arg: 'school', type: 'string',
		},
		returns: {
			arg: 'hotActivities', type: 'array'
		},
		http: {path: '/hotActiveties', verb: 'get'}
	});
	//
	Activity.getHotActiveties = function (school,cb) {
      Activity.find({
        where:{"school":school},
        order:'readers DESC',
        limit: 5,
        fields: ['id','title','imgUrl']
      },function(err,activities){
        if(err) return next(err);
        cb(null,activities);
      });
    };
	//
	Activity.afterRemote('prototype.__create__readers', function (ctx,ins,next) {
    var readers = ctx.instance.toJSON().readers;
    ctx.instance.readers = readers + 1;
    ctx.instance.save(function(err,ins){
      if (err) {
        return next(err);
      }
      ctx.res.send({readerNum:ins.toJSON().readers});
    });
    });
  Activity.beforeRemote('prototype.__create__seckills', function (ctx,ins,next){
    ctx.req.body._seckillItems.forEach(function(item){
      item.margin = item.count;
    });
    console.log(ctx.req.body);
    ctx.instance.seckills.create(ctx.req.body, function (err, seckill) {
      console.log(seckill);
      ctx.res.send(seckill);
    });


  });
};
