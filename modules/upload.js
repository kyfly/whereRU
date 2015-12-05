var fs = require('fs');
var os = require('os');
var path = require('path');
var Busboy = require('busboy');
var ALY = require('aliyun-sdk');
var fse = require('fs-extra');
var mammoth = require("mammoth");
var guid = 1000;
var config = {
    configFile: path.join(__dirname, '../client/lib/ueditor/config.json'),
    mode: 'local',
    AccessKey: '',
    SecrectKey: '',
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
	return function (req, res, next) {
		config.dynamicPath = req.query.dynamicPath;
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
  var fileName = getFileName('.html');
  fs.writeFile(path.join(__dirname, '../client/lib/temporary/html/', fileName), 
    req.body.content, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send({
          'url': path.join('/client/lib/html/', fileName),
          //'title': req.body.pictitle,
          'original': fileName,
          'state': "SUCCESS"
        });
      }
  });
}
var uploadfile = function (req, res) {
	var result = [];
	var fileConut = req.query.files || 1;
	var fileTip = 0;
  var busboy = new Busboy({headers: req.headers});
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var isReturn = false;
    save(file, filename, req, function (err, url) {
      fileTip ++;
    	
      //防止多次res.end()
      if (isReturn) return;
      isReturn = true;
      //console.log(req.body);
      var r = {
        'url': url,
        //'title': req.body.pictitle,
        'original': filename,
      }
      if (err) {
          r.state = 'ERROR';
      } else r.state = 'SUCCESS';
      result.push(r);
      if (fileTip == fileConut) {
      	res.json(result);
      }
    });
  });
  return req.pipe(busboy);
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
var save = function (file, filename, req, callback) {
  var realName = getFileName(path.extname(filename));
  var dPath = getRealDynamicPath(req);
  var saveTo = path.join(os.tmpDir(), realName);
  file.pipe(fs.createWriteStream(saveTo));
  file.on('end', function() {
    
    if (config.mode == 'ali') {
       
    } else {
      var readPath = path.join(config.staticPath, dPath, realName);
      
      fse.move(saveTo, readPath, function(err) {

        if (err) {
            callback(err);
        } else {
            callback(null, '/lib/temporary/' + dPath + '/' + realName);
        }
      });
    }
  });
}
function saveToFile (data, cb) {
  var fileName = getFileName('.html');
  fs.writeFile(path.join(__dirname, '../client/lib/temporary/html/', fileName), 
    data , function (err) {
      cb(err, path.join('/client/lib/temporary/html/', fileName));
  });
}
function docx2html (path, cb) {
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
  mammoth.convertToHtml({path: path}, options)
    .then(function(result){
      cb(result);
    })
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
exports.docx2html = docx2html;