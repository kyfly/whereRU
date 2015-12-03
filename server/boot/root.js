var path = require('path');
var upload = require('../../modules/upload').upload;
var mammoth = require("mammoth");
//var doc2html = require('../../modules/upload').docx2html;
module.exports = function(server) {
  // Install a `/` route that returns server status
  // var router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  // server.use(router);
  server.use('/ue/uploads', upload({}));

  server.get('/docx2html', function (req, res) {
    var options = {
      // convertImage: mammoth.images.inline(function(element) {
      //     return element.read("base64").then(function(imageBuffer) {
      //         return {
      //             src: "data:" + element.contentType + ";base64," + imageBuffer
      //         };
      //     });
      // }),
      styleMap: [
          "u => em"
      ],
    };
    console.log('../client' + req.query.path);
    mammoth.convertToHtml({path: '../client' + req.query.path}, 
      options)
      .then(function(result){
        res.send(result.value);
    })
  });

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
