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
	Activity.getMySchoolActiveties = function (school, last, cb) {
		if (last) {
			var dateFilter = {
				school: school, 
				created: { lt: last}
			};
		}	else {
			var dateFilter = {
				school: school
			};
		}
		Activity.find({
			where: dateFilter,
			order: "id DESC",
			limit: 30
		}, function (err, activties) {
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
	Activity.search = function (keyword,cb) {
    var query = [];
		keywords = keyword.split(' ');
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
    	where:{ or: query },
      fields:['title','authorName','id','authorId','keyword','imgUrl','created','status']
    },function(err,activities){
        if(err) {
        	return cb(err);
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
	//
	Activity.getHotActiveties = function (school,cb) {
    Activity.find({
      where: {"school": school},
      order: 'readers DESC',
      limit: 5,
      fields: ['id','title','imgUrl']
    },function(err, activities){
      if(err) 
      	return next(err);
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
      ctx.res.send(seckill);
    });
  });
};
