var path = require('path');
var upload = require('../../modules/upload');
module.exports = function(server) {
  // Install a `/` route that returns server status
  // var router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  // server.use(router);
  server.use('/ue/uploads', upload({}));
  server.get('/eventManage*', function(req, res) {
	  res.sendFile(path.join(__dirname, '../../client/admin/index.html'));
	});
	server.get('/search|myTeam|home|signUp|login|teams|events', function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
	});
  server.get('/events*|chats*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
  });
};
