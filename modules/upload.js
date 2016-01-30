var fs = require('fs');
var os = require('os');
var path = require('path');
var Busboy = require('busboy');
var AliYun = require('./AliYun.js');
var fse = require('fs-extra');
var guid = 1000;
var config = {
    configFile: '../client/lib/ueditor/config.json',
    mode: 'local',
    dynamicPath: 'upload',
    staticPath: path.join(__dirname, '../client/lib/temporary')
};
var setConfig = function(c) {
  for (var i in c) {
      config[i] = c[i];
  }
}
function upload(c) {
	setConfig(c);
  AliYun = new AliYun({
    accessKeyId: c.accessKeyId,
    secretAccessKey: c.secretAccessKey,
    endpoint: c.endpoint,
    bucket: c.bucket,
    allowOrigin: c.allowOrigin
  });
	return function (req, res, next) {
    var query = req.query;
    if ((!query.dir || !query.id) && req.query.action !== 'config') {
      throw {
        "status": "500",
        "msg":"dir & id 是必须的参数"
      };
      return;
    }
		switch (req.query.action) {
	    case 'config':
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(path.join(__dirname, config.configFile));
        break;
	    case 'uploadimage':
        uploadfile(req, res);
        break;
      case 'uploadtext':
        uploadText(req, res);
        break;
	    case 'listimage':
        listfile(req, res, '.jpg,.jpeg,.png,.gif,.ico,.bmp');
        break;
	    case 'uploadscrawl':
        uploadscrawl(req, res);
        break;
	    case 'uploadfile':
        uploadfile(req, res);
        break;
	    case 'uploadvideo':
        uploadfile(req, res);
        break;
	    case 'listfile':
        listfile(req, res, [".png", ".jpg", ".jpeg", ".gif", ".bmp",
            ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
            ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
            ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
            ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"].join(','));
        break;
    }
	}
}
var uploadText = function (req, res) {
  var content = req.body.content;
  var query = req.query;
  if (!req.body.content) {
    throw {
      "status": "500",
      "msg":"content is not defined"
    };
    return;
  }
  var file = 'whereru/' + query.dir + '/' + query.id + '/html' + '/' +getFileName('.html');
  AliYun.putObject({
    fileName: file,
    data: req.body.content,
    contentType: 'text/html'
  }, function (err, data) {
    if (err) {
      throw err;
    } else {
      res.send({
        'url': file,
        'title': '',
        'original': file,
        'state': 'SUCCESS'
      });
    }
  });
}
var uploadfile = function (req, res) {
  var busboy = new Busboy({headers: req.headers});
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var isReturn = false;
    save(file, filename, mimetype, req, function (err, url) {
      //防止多次res.end()
      if (isReturn) return;
      isReturn = true;
      var r = {
        'url': url,
        'title': req.body.pictitle,
        'original': filename,
      }
      if (err) {
        r.state = 'ERROR';
      } else 
        r.state = 'SUCCESS';
      res.json(r);
    });
  });
  return req.pipe(busboy);
}
var save = function (file, filename, mimetype, req, callback) {
  var realName = getFileName(path.extname(filename));
  var saveTo = path.join(os.tmpDir(), realName);
  var query = req.query;
  file.pipe(fs.createWriteStream(saveTo));
  file.on('end', function() {
    fs.readFile(saveTo,function(err,data){
      var file = 'whereru/' + query.dir + '/' + query.id + '/image' + '/' + realName;
      AliYun.putObject({
        fileName: file,
        data: data,
        contentType: mimetype
      }, function (err, data) {
        callback(err, file)
      });
    });
  });
}
var getFileName = function(extname) {
    var d = new Date();
    var name = [ d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(),
                 d.getMinutes(), d.getSeconds(), d.getMilliseconds(), guid++ ]
                .join('_') + extname;
    return name;
}
var getRealDynamicPath = function (req) {
    var dPath = config.dynamicPath;
    if (typeof dPath == 'function')
        dPath = dPath(req);
    return dPath;
}
// var listfile = function (req, res, fileType) {
//   var dPath = util.getRealDynamicPath(req);
//   var urlRoot = dPath;
//   var callback = function (err, files) {
//     var r = {};
//     if (err) {
//       r.state = 'ERROR';
//       res.status(500);
//     } else r.state = 'SUCCESS';
//     //var fileType = '.jpg,.jpeg,.png,.gif,.ico,.bmp';
//     var data = [];
//     for (var i = 0; i < files.length; i++) {
//       var file = files[i];
//       var extname = path.extname(file);
//       //console.log(file);
//       if (fileType.indexOf(extname.toLowerCase()) >= 0) {
//         data.push({
//             'url': urlRoot + '/' + file
//         });
//       }
//     }
//     r.list = data;
//     r.start = 1;
//     r.total = data ? data.length : 0;
//     res.json(r);
//   };
//   if (config.mode == 'ali') {
      
//   } else {
//     fs.readdir(path.join(config.staticPath, dPath), callback);
//   }
// }
// var uploadscrawl = function (req, res) {
//   var realName = getFileName('.png');
//   var saveTo = path.join(os.tmpDir(), realName);
//   console.log(saveTo);
//   util.base64Decode(req.body.upfile, saveTo);
//   var dPath = util.getRealDynamicPath(req);
//   var readPath = path.join(config.staticPath, dPath, realName);
//   fse.move(saveTo, readPath, function(err) {
//     var r = {
//         'url': dPath + '/' + realName,
//         'original': realName,
//     }
//     if (err) {
//         r.state = 'ERROR';
//     } else r.state = 'SUCCESS';
//     res.json(r);
//   });
// }
exports.upload = upload;