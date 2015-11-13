var path = require('path');
module.exports = function(server) {
  // Install a `/` route that returns server status
  // var router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  // server.use(router);
  server.use('/ue/uploads', function (req, res) {
  	var query = req.query;
  	switch (query.action) {
  		case 'config': 
  			res.sendFile(path.join(__dirname, '../../client/lib/ueditor/config.json'));
  	}
  });
  server.get('/contest*', function(req, res) {
	  res.sendFile(path.join(__dirname, '../client/admin/index.html'));
	});
	server.get('/search|myTeam|home', function(req, res) {
	  res.sendFile(path.join(__dirname, '../client/index.html'));
	});
};
