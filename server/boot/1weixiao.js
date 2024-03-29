'use strict';

const crypto = require('crypto');
const _ = require('lodash');
const getRawBody = require('raw-body');
const path = require('path');
const loopback = require('loopback');

function gen_token(media_id) {
  let secret = 'ETUANSTUDIO'; //自己定义SECRET值
  let string = media_id.length + media_id;
  const b = 64;
  secret = _.padEnd(secret, b, '\0');
  const ipad = _.padEnd('', b, '6');
  const opad = _.padEnd('', b, '\\');
  const k_ipad = secret ^ ipad;
  const k_opad = secret ^ opad;
  return md5(k_opad + md5(k_ipad + string));
}

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

function _cal_sign(param_array) {
  let keys = Object.keys(param_array).sort();
  let items = [];
  keys.forEach(function (key) {
    items.push(key + '=' + param_array[key]);
  });
  const api_secret = '71962700FE45352CF0C2A2833F8E6FA2'; //微校时提交给微校，32位字符串
  const str = items.join('&') + '&key=' + api_secret;
  return md5(str).toUpperCase();
}

function open(app, req, res) {
  let body = req.body;
  const sign = body.sign;
  const timestamp = body.timestamp;
  delete (body['sign']);
  // 验证签名不通过
  if (sign != _cal_sign(body)) {
    let err = {
      errcode: 5004,
      errmsg: '签名错误'
    }
    return res.send(err);
  }
  const now = Date.parse(new Date()) / 1000;
  // 时间验证不通过
  const interval = now - timestamp;
  if (Math.abs(interval) > 10) {
    let err = {
      errcode: 5003,
      errmsg: '请求接口失败'
    }
    return res.send(err);
  }
  let result = {
    errcode: 0,
    errmsg: 'ok',
    token: '',
    is_config: 1,
  }
  return res.send(result);
}

function close(app, req, res) {
  let body = req.body;
  const sign = body.sign;
  const timestamp = body.timestamp;

  delete (body['sign']);
  // 验证签名不通过
  if (sign != _cal_sign(body)) {
    let err = {
      errcode: 5004,
      errmsg: '签名错误'
    }
    return res.send(err);
  }

  const now = Date.parse(new Date()) / 1000;
  // 时间验证不通过
  const interval = now - timestamp;
  if (Math.abs(interval) > 10) {
    let err = {
      errcode: 5003,
      errmsg: '请求接口失败'
    }
    return res.send(err);
  }

  app.models.wechatmp.findOne({
    where: {
      media_id: body.media_id
    }
  }, function (err, ins) {
    if (err) {
      let error = {
        errcode: 5003,
        errmsg: '请求接口失败'
      }
      return res.send(error);
    }

    ins.isEnabled = false;
    ins.save();

    let result = {
      errcode: 0,
      errmsg: 'OK'
    }
    return res.send(result);
  });
}

function monitor(app, req, res) {
  res.send(req.query.echostr);
}

function config(app, req, res) {
  const media_id = req.query.media_id;
  const sign = req.query.sign;
  const timestamp = req.query.timestamp;
  let body = req.query;
  delete (body['sign']);
  delete (body['type']);
  // 验证签名不通过
  if (sign != _cal_sign(body)) {
    let err = {
      errcode: 5004,
      errmsg: '签名错误'
    }
    return res.send(err);
  }
  const now = Date.parse(new Date()) / 1000;
  // 时间验证不通过
  const interval = now - timestamp;
  if (Math.abs(interval) > 10) {
    let err = {
      errcode: 5003,
      errmsg: '请求接口失败'
    }
    return res.send(err);
  }
  const token = gen_token(media_id);
  app.models.weixiaoToken.findOrCreate({ token: token, media_id: media_id }, (err, result) => {
    if (err) return res.send({ errcode: 5003, errmsg: '请求接口失败' });
    res.redirect('/weixiao?type=configGet&token=' + token + '&media_id=' + media_id);
  });
}
function configGet(app, req, res) {
  const configPage = path.join(__dirname, '../../client/transfer/jump.html');
  res.sendFile(configPage);
}

function configSave(app, req, res) {
  const body = req.body;
  console.log(body)
  const media_id = body.media_id;
  const teamId = body.teamId;
  const token = body.token;
  app.models.weixiaoToken.findOne({ token: token, media_id: media_id }, (err, tokenRecord) => {
    if (err || !tokenRecord) return res.send({ errcode: 5003, errmsg: '令牌错误' });
    app.models.Team.findById(teamId, (err, team) => {
      if (err || !team) return res.send({ errcode: 5003, errmsg: '找不到该团队' });
      team.media_id = media_id;
      team.save();
      res.send({ errcode: 0, msg: '成功' });
    });
  });
}

module.exports = function (app) {
  app.post('/weixiao', function (req, res, cb) {
    console.log(req.url)
    getRawBody(req, (err, str) => {
      if (err) return cb(err);
      req.body = JSON.parse(str.toString());
      const type = req.query.type;
      switch (type) {
        case 'open': return open(app, req, res);
        case 'close': return close(app, req, res);
        case 'trigger': break;// return trigger();
        //case 'configSave': return configSave(app, req, res);
      }
    });
  });

  app.get('/weixiao', function (req, res) {
    console.log(req.url)
    const type = req.query.type;
    switch (type) {
      case 'config': return config(app, req, res);
      case 'monitor': return monitor(app, req, res);
      case 'configGet': return configGet(app, req, res);
    }
  });

  app.post('/weixiao/config', function (req, res) {
    const body = req.body;
    console.log(body)
    const media_id = body.media_id;
    const teamId = body.teamId;
    const token = body.token;
    app.models.weixiaoToken.findOne({ token: token, media_id: media_id }, (err, tokenRecord) => {
      if (err || !tokenRecord) return res.send({ errcode: 5003, errmsg: '令牌错误' });
      app.models.Team.findById(teamId, (err, team) => {
        if (err || !team) return res.send({ errcode: 5003, errmsg: '找不到该团队' });
        team.media_id = media_id;
        team.save();
        res.send({ errcode: 0, errmsg: '成功' });
      });
    });
  });

  app.use('/weixiao', loopback.static(path.resolve(__dirname, '../../client/transfer')));

};