var path = require('path');
var upload = require('../../modules/upload').upload;
var mammoth = require("mammoth");
//var doc2html = require('../../modules/upload').docx2html;
module.exports = function(server) {
  
  server.use('/ue/uploads', upload({}));

  server.get(/^\/w\/*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
  });

  server.get(/^\/MS\/*/, function(req, res) {
    res.sendFile(path.join(__dirname, '../../client/management_system/index.html'));
  });
};
