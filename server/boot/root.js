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

  // server.get('/docx2html', function (req, res) {
  //   var options = {
  //     styleMap: [
  //         "u => em"
  //     ],
  //   };
  //   mammoth.convertToHtml({path: '../client' + req.query.path}, 
  //     options)
  //     .then(function(result){
  //       res.send(result.value);
  //   })
  // });

  server.get(/^\/w\/*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
  });
};
