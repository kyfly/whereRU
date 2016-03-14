var ALY = require('aliyun-sdk');
function AliYun(c) {
  var oss = new ALY.OSS({
    "accessKeyId": c.accessKeyId,
    "secretAccessKey": c.secretAccessKey,
    // 杭州：http://oss-cn-hangzhou.aliyuncs.com
    // 注意：如果你是在 ECS 上连接 OSS，可以使用内网地址，速度快，没有带宽限制。
    // 杭州：http://oss-cn-hangzhou-internal.aliyuncs.com
    endpoint: c.endpoint,
    apiVersion: '2013-10-15'
  });
  this.config = c;
  this.oss = oss;
}

AliYun.prototype.putObject = function(option, cb) {
  this.oss.putObject({
    Bucket: this.config.bucket,
    Key: option.fileName,                 // 注意, Key 的值不能以 / 开头, 否则会返回错误.
    Body: option.data,
    AccessControlAllowOrigin: this.config.allowOrigin,
    ContentType: option.contentType,
    CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
    ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
    ContentEncoding: 'utf-8',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
    ServerSideEncryption: 'AES256',
    Expires: null                     // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
  },
  function (err, data) {
    cb(err, data);
  });
};
AliYun.prototype.getObject = function (option, cb) {
  this.oss.getObject({
    Bucket: this.config.bucket,
    Key: option.fileName       // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
  },
  function (err, data) {
    cb(err, data);
  });
}
module.exports = AliYun;