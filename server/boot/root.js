var path = require('path');
var upload = require('../../modules/upload').upload;
var bodyParser = require('body-parser');
var crypto = require("crypto");
var wechat = require('wechat-oauth');
//var doc2html = require('../../modules/upload').docx2html;
module.exports = function(server) {
	server.use(bodyParser.urlencoded({
	  extended: true
	}));
	server.use(bodyParser.json());
  server.use('/ue/uploads', upload(server));
  server.use('/wechatUrl', function (req, res) {
    var client = new wechat(server.get('wechat').appID, server.get('wechat').appsecret);
    var scope = 'snsapi_userinfo';
    var isWechat = req.query.iswechat;
    server.models.Aouth.create({
      created: new Date(),
      url: req.query.url,
      iswechat: isWechat
    },function (err, ins) {
      if (err)
        res.error(err);
      else {
        var url = client.getAuthorizeURL(server.get('wechat').redrect, ins.id.toString(), scope);
        res.send({
          url: url,
          token: ins.id
        });
      }
    });
  })
  server.get(/^\/w\/*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
  });

  server.get(/^\/u\/*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
  });

  server.get(/^\/MS\/*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/management_system/index.html'));
  });
};
