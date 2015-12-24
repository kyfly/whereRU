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
			arg: 'activties', type: 'object'
		},
		http: {path: '/getMySchoolActiveties', verb: 'get'}
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
	}
};
