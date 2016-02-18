module.exports = function(Race) {
	Race.beforeRemote('prototype.__link__raceTeams', function(){});
	Race.remoteMethod('search', {
		accepts: {
			arg: 'keyword',
      type: 'string',
      required: true
		},
		returns: {
			arg: 'races', type: "array"
		},
		http: {
			path: '/search', verb: 'get'
		}
	});
	Race.search = function (keyword,cb){
    var query = [];
    keywords = keyword.split(' ');
    keywords.forEach(function (keyword) {
      query.push({
        name:{like:keyword}
      });
      query.push({
        authorName:{ like:keyword }
      });
    });
    Race.find({
        where: { or: query },
        fields:['name','imgUrl','started','id','authorName','authorId','ended','created']
    },function(err,races){
        if(err) {
          return cb(err);
        }
        cb(null,races);
    });
    };
	Race.remoteMethod('getMySchoolRaces', {
		accepts: [{
			arg: 'school',
      type: 'string',
      required: true
		},{
			arg: 'last', type: 'string',
		}],
		returns: {
			arg: 'races', type: 'array'
		},
		http: {path: '/mySchoolRaces', verb: 'get'}
	});
	Race.getMySchoolRaces = function (school, last, cb){
    if (last) {
      var dateFilter = {
        school: school, 
        created: { lt: last}
      };
    } else {
      var dateFilter = {
        school: school
      };
    }
    Race.find({
      where: dateFilter,
      order:'id DESC',
      limit: 30
    },function(err, races){
      if(err) {
        return cb(err);
      }
      cb(null,races);
    });
  };
  Race.beforeRemote("prototype.__get__raceTeams", function (ctx,ins,next) {
    ctx.req.query.filter = {
      fields: ["name", "id", "logoUrl", "desc", "status"]
    };
    next();
  });
};
