module.exports = function(Activity) {
	Activity.remoteMethod('getMySchoolActiveties', {
		accepts: [{
			arg: 'school',
			type: 'string',
			required: true
		},{
			arg: 'last', type: 'string',
		}],
		returns: {
			arg: 'activties', type: 'array'
		},
		http: {path: '/mySchoolActiveties', verb: 'get'}
	});
	/**
	 * 获取用户所在学校的活动列表
	 * @param  {string}   school 学校名称
	 * @param  {date}   	last   最后一条活动信息时间
	 * @param  {Function} cb     回调函数
	 * @return {object}          活动列表
	 */
	Activity.getMySchoolActiveties = function (school, last, cb) {
		if (last) { //判断是否有‘last’参数，last为上一次返回的最后一条的‘created’
			var dateFilter = {
				school: school, //学校过滤器，只查询该学校活动
				created: { lt: last},
				hidden: false,	//活动显示过滤器，只显示不隐藏的活动
      	deleted: false  //删除过滤器，只显示未被删除的学校
			};
		}	else {
			var dateFilter = {
				school: school,
				hidden: false,
      	deleted: false
			};
		}
		Activity.find({
			where: dateFilter,
			order: "id DESC",
			limit: 30
		}, function (err, activties) {
			if (err)
				cb({"status": 1201, "message": "活动列表获取失败"});
			else
				cb(null, activties);
		});
	};
	Activity.remoteMethod('search', {
		accepts: {
			arg: 'keyword',
			type: 'string',
			required: true
		},
		returns: {
			arg: 'activties', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
	/**
	 * 活动搜索
	 * @param  {string}   keyword 搜索的关键字
	 * @param  {Function} cb      [description]
	 * @return {[type]}           [description]
	 */
	Activity.search = function (keyword,cb) {
    var query = [];
		keywords = keyword.split(' ');
		/*
			关键字根据空格分割为数组，组合过滤器
		 */
    keywords.forEach(function (keyword) {
			query.push({
				title:{ like:keyword }
			});
			query.push({
				authorName:{ like:keyword }
			});
			query.push({
				keyword:{ like:keyword }
			});
    });
    Activity.find({
    	where:{
    	  or: query,
				hidden: false,
      	deleted: false 
      }
    },function(err,activities){
        if(err) {
        	return cb({"status": 1100, "message": "活动搜索失败"});
        }
        cb(null,activities);
    });
  };
	Activity.remoteMethod('getHotActiveties', {
		accepts: {
			arg: 'school',
			type: 'string',
			required: true
		},
		returns: {
			arg: 'hotActivities', type: 'array'
		},
		http: {path: '/hotActiveties', verb: 'get'}
	});
	/**
	 * 获取用户所在学校的最热活动，显示五条信息
	 * @param  {[type]}   school [description]
	 * @param  {Function} cb     [description]
	 * @return {[type]}          [description]
	 */
	Activity.getHotActiveties = function (school,cb) {
    Activity.find({
      where: {
      	"school": school,
				hidden: false,
      	deleted: false
      },
      order: 'readers DESC',
      limit: 5,
      fields: ['id','title','imgUrl']
    },function(err, activities){
      if(err) 
      	return next({"status": 1201, "message": "活动列表获取失败"});
      cb(null,activities);
    });
  };
	/**
	 * 活动访问量加一
	 * @param  {[type]} ctx   [description]
	 * @param  {[type]} ins   [description]
	 * @param  {[type]} next) {               var readers [description]
	 * @return {[type]}       [description]
	 */
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
  /**
   * 创建抢票时给抢票添加余票数量
   * @param  {[type]} ctx     [description]
   * @param  {[type]} ins     [description]
   * @param  {[type]}           
   * @return {[type]}         [description]
   */
  Activity.beforeRemote('prototype.__create__seckills', function (ctx, ins, next){
    ctx.req.body.margin = ctx.req.body.total;	//票余量初始化
    ctx.req.body._seckillItems.forEach(function(item){
      item.margin = item.count;	//票项余量初始化
    });
    //保存抢票信息
    ctx.instance.seckills.create(ctx.req.body, function (err, seckill) {
      ctx.res.send(seckill);
    });
  });
};
