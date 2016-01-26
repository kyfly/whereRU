var q = require('q');

function modelPromise (model, method, option) {
	var defer = q.defer();
	
	switch (method) {
		case 'find': 
			model.find(option.query, callback);
			return defer.promise;
		case 'findOne': 
			model.findOne(option.query, callback);
			return defer.promise;
		case 'findById': 
			model.findById(option.id, option.query,callback)
			return defer.promise;
		case 'insFind':
			model(option.query, callback);
			return defer.promise;
	}
	return defer.promise;

	function callback (err, data) {
		if (!err && data) {
			defer.resolve(data);
		} else {
			defer.reject(err);
		}
		return defer.promise;
	}
}
modelPromise.prototype.all = q.all;
module.exports = modelPromise;
