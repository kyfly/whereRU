module.exports = function(Form) {
	//__get__formResults检查用户权限
	Form.beforeRemote('prototype.__get__formResults', function(){});
};
