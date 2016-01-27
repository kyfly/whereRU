/**
 * LOOPBACK restful接口，使用resource封装
 * @param  {[type]} window    [description]
 * @param  {[type]} angular   [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 * 使用方法：应用中引入模块'lbServices',控制器中引入相应的服务名称
 * model.method([queryObject, postObject], successFn, errorFn)
 * model       服务名称
 * method      resource参数
 * queryObject 参数对象       根据restful接口匹配，不匹配的参数作为query参数,无参数可省略
 * postObject  发送数据对象   PUT，POST需要发送的数据，GET方法无该参数
 * successFn   成功回调
 * errorFn     失败回调
 * 示例：
 * User.login({
 *   phone: 12345678901,
 *   password: 123
 * }, function (token) {
 *   alert('success');
 * }, function (err) {
 *   alert('error');
 * })
 */
(function(window, angular, undefined) {
  'use strict';

  var urlBase = "/api";
  var authHeader = 'authorization';

  var module = angular.module("lbServices", ['ngResource']);

module.factory(
  'User',
  ['LoopBackResource', 'LoopBackAuth', '$injector',
  function(Resource, LoopBackAuth, $injector){
    var R = Resource(
    urlBase + '/WUsers/:id',
    { 'id': '@id' },
    {
      /**
       * 描述：新用户注册接口，未登录
       * 使用场景：APP，PC注册
       */
      "create": {
        url: urlBase + '/WUsers',
        method: 'POST'
      },
      /**
       * 描述：学生学校验证，已登录用户
       * 使用场景：用户在APP,PC验证学号
       */
      "confirmSchool": {
        url: urlBase + '/WUsers/:id/confirmSchool',
        method: 'POST'
      },
      /**
       * 描述：用户参与校园表单活动，已登录用户
       * 使用场景：用户参与表单活动
       */
      "prototype_create_formResults": {
        url: urlBase + '/WUsers/:id/formResults',
        method: 'POST'
      },
      /**
       * 描述：用户参与表单活动所填入的数据，已登录用户
       * 使用场景：用户查看参与活动历史，点击单个表单活动
       */
      "prototype_findById_formResults": {
        url: urlBase + '/WUsers/:id/formResults/fk',
        params: { 'fk': '@fk'},
        method: 'GET'
      },
      /**
       * 描述：用户参与校园投票活动，已登录用户
       * 使用场景：用户参与投票活动
       */
      "prototype_create_voteResults": {
        url: urlBase + '/WUsers/:id/voteResults',
        method: 'POST'
      },
      /**
       * 描述：用户参与投票活动所填入的数据，已登录用户
       * 使用场景：用户查看参与活动历史，点击单个投票活动
       */
      "prototype_findById_voteResults": {
        url: urlBase + '/WUsers/:id/voteResults/fk',
        params: { 'fk': '@fk'},
        method: 'GET'
      },
      /**
       * 描述：用户参与校园抢票活动，已登录用户
       * 使用场景：用户参与抢票活动
       */
      "prototype_create_seckillResults": {
        url: urlBase + '/WUsers/:id/seckillResults',
        method: 'POST'
      },
      /**
       * 描述：用户参与投票活动所填入的数据，已登录用户
       * 使用场景：用户查看参与活动历史，点击单个抢票活动
       */
      "prototype_findById_seckillResults": {
        url: urlBase + '/WUsers/:id/seckillResults/fk',
        params: { 'fk': '@fk'},
        method: 'GET'
      },
      /**
       * 描述：获取用户所在团队和所拥有的团队，已登录用户
       * 使用场景：1、选择参与竞赛的团队。2、用户团队列表
       */
      "getMyTeams": {
        url: urlBase + '/WUsers/:id/myTeams',
        method: 'GET',
        isArray: true
      },
      /**
       * 描述：获取用户信息，已登录用户
       * 使用场景：1、用户申请加入团队，2、用户个人信息
       */
      "getInfo": {
        url: urlBase + '/WUsers/info',
        method: 'GET'
      },
      /**
       * 描述：获取参与活动历史，已登录用户
       * 使用场景：个人中心，活动历史列表
       */
      "getActivitiesHistories": {
        url: urlBase + '/WUsers/:id/activitiesHistories',
        method: 'GET'
      },
      /**
       * 描述：获取参与竞赛历史，已登录用户
       * 使用场景：个人中心，竞赛历史列表
       */
      "getRaceHistories": {
        url: urlBase + '/WUsers/:id/raceHistories',
        method: 'GET'
      },
      /**
       * 描述：更新用户信息，已登录用户
       * 使用场景：个人中心修改用户信息
       */
      "prototype_updateAttributes": {
        url: urlBase + '/WUsers/:id',
        method: 'PUT'
      },
      /**
       * 描述：创建团队，已登录用户
       * 使用场景：创建团队
       */
      "prototype_create_teams": {
        url: urlBase + '/WUsers/:id/teams',
        method: 'POST'
      },
      /**
       * 描述：修改团队信息，已登录用户
       * 使用场景：修改团队信息
       */
      "prototype_updateById_teams": {
        url: urlBase + '/WUsers/:id/teams/:fk',
        params: { 'fk': '@fk'},
        method: 'PUT'
      },
      /**
       * 描述：用户登录
       * 使用场景：用户登录
       */
      "login": {
        url: urlBase + '/WUsers/login',
        method: 'POST',
        params: {
          include: "user"
        },
        interceptor: {
          response: function (response) {
            var accessToken = response.data;
            LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
            LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
            LoopBackAuth.save();
            return response.resource;
          }
        }
      }
    });
    return R;
}])
.factory(
  'Team',
  ['LoopBackResource', 'LoopBackAuth', '$injector',
  function(Resource, LoopBackAuth, $injector){
    var R = Resource(
      urlBase + '/Teams/:id',
      { 'id': '@id' },
      {
        /**
         * 描述：团队参与竞赛，已登录用户
         * 使用场景：团队拥有者选择参与竞赛
         */
        "prototype_link_partakedRaces": {
          url: urlBase + '/Teams/:id/partakedRaces/rel/:fk',
          params: { 'fk': '@fk'},
          method: 'PUT'
        },
        /**
         * 描述：用户所在学校团队列表，所有用户
         * 使用场景：校园团队列表
         */
        "getMySchoolTeams": {
          url: urlBase + '/Teams/mySchoolTeams',
          method: 'GET'
        },
        /**
         * 描述：团队详情，所有用户
         */
        "findById": {
          url: urlBase + '/Teams/:id',
          method: 'GET'
        },
        /**
         * 描述：团队发布过的活动列表，所有用户
         */
        "prototype_get_activities": {
          url: urlBase + '/Teams/:id/activities',
          method: 'GET'
        },
        /**
         * 描述：申请加入团队，已登录用户
         */
        "prototype_create_members": {
          url: urlBase + '/Teams/:id/members',
          method: 'POST'
        },
        /**
         * 描述：团队成员列表，已登录用户
         */
        "prototype_get_members": {
          url: urlBase + '/Teams/:id/members',
          method: 'GET',
          isArray: true
        },
        /**
         * 描述：成员详细信息，已登录用户
         */
        "prototype_findById_members": {
          url: urlBase + '/Teams/:id/members/:fk',
          params: { 'fk': '@fk'},
          method: 'GET'
        },
        /**
         * 描述：删除成员，已登录用户
         */
        "prototype_destroyById_members": {
          url: urlBase + '/Teams/:id/members/:fk',
          params: { 'fk': '@fk'},
          method: 'DELETE'
        },
        /**
         * 描述：更新成员信息，已登录用户
         */
        "prototype_updateById_members": {
          url: urlBase + '/Teams/:id/members/:fk',
          params: { 'fk': '@fk'},
          method: 'PUT'
        },
        /**
         * 描述：创建团队部门，已登录用户
         */
        "prototype_create_departments": {
          url: urlBase + '/Teams/:id/departments',
          method: 'POST'
        },
        /**
         * 描述：部门详情，已登录用户
         */
        "prototype_findById_departments": {
          url: urlBase + '/Teams/:id/departments/:fk',
          params: { 'fk': '@fk'},
          method: 'GET'
        },
        /**
         * 描述：更新部门信息，已登录用户
         */
        "prototype_updateById_departments": {
          url: urlBase + '/Teams/:id/departments/:fk',
          params: { 'fk': '@fk'},
          method: 'PUT'
        },
        /**
         * 描述：删除部门，已登录用户
         */
        "prototype_destroyById_departments": {
          url: urlBase + '/Teams/:id/departments/:fk',
          params: { 'fk': '@fk'},
          method: 'DELETE'
        },
        /**
         * 描述：获取活动信息，已登录用户
         * 使用场景：活动管理列表
         */
        "getActivitiesData": {
          url: urlBase + '/Teams/:id/activitiesData',
          method: 'GET'
        },
        "prototype_get_races": {
          url: urlBase + '/Teams/:id/races',
          method: 'GET',
          isArray: true
        },
        "prototype_create_races": {
          url: urlBase + '/Teams/:id/races',
          method: 'POST'
        }
      }
    );
    return R;
}])
.factory(
  'Activity',
  ['LoopBackResource', 'LoopBackAuth', '$injector',
  function(Resource, LoopBackAuth, $injector){
    var R = resource(
    urlBase + '/Activities/:id',
    { 'id': '@id' },
    {
      /**
       * 描述：用户所在学校热门活动列表
       */
      "getHotActiveties": {
        url: urlBase + '/Activities/hotActiveties',
        method: 'GET',
        isArray: true
      },
      /**
       * 描述：用户所在学校活动列表
       */
      "getMySchoolActiveties": {
        url: urlBase + '/Activities/mySchoolActiveties',
        method: 'GET',
        isArray: true
      },
      /**
       * 描述：活动搜索
       */
      "search": {
        url: urlBase + '/Activities/search',
        method: 'GET',
        isArray: true
      },
      /**
       * 描述：活动浏览量+1
       */
      "prototype_create_readers": {
        url: urlBase + '/Activities/:id/readers',
        method: 'POST'
      },
      /**
       * 描述：活动详情，所有用户
       */
      "findById": {
        url: urlBase + '/Activities/:id',
        method: 'GET'
      }

    });
    return R;
  }])
.factory(
  'Seckill',
  ['LoopBackResource', 'LoopBackAuth', '$injector',
  function(Resource, LoopBackAuth, $injector){
    var R = resource(
      urlBase + '/Seckills/:id',
      { 'id': "@id"},
      {
        /**
         * 描述：获取剩余票量，所有用户
         * 使用场景：参与抢票活动
         */
        "margin": {
          url: urlBase + '/Seckills/:id/margin',
          method: 'GET'
        },
        /**
         * 描述：获取抢票结果，已登录用户
         * 使用场景：抢票管理
         */
        "prototype_get_seckillResults": {
          url: urlBase + '/Forms/:id/seckillResults',
          method: 'GET'
        }
      }
    );
    return R;
  }])
.factory(
  'Form',
  ['LoopBackResource', 'LoopBackAuth', '$injector',
  function(Resource, LoopBackAuth, $injector){
    var R = resource(
      urlBase + '/Forms/:id',
      { 'id': "@id"},
      {
        /**
         * 描述：获取表单结果，已登录用户
         * 使用场景：表单管理
         */
        "prototype_get_formResults": {
          url: urlBase + '/Forms/:id/formResults',
          method: 'GET'
        }
      }
    );
    return R;
  }])
.factory(
  'Vote',
  ['LoopBackResource', 'LoopBackAuth', '$injector',
  function(Resource, LoopBackAuth, $injector){
    var R = resource(
      urlBase + '/Votes/:id',
      { 'id': "@id"},
      {
        /**
         * 描述：获取投票结果，已登录用户
         * 使用场景：投票管理
         */
        "prototype_get_voteResults": {
          url: urlBase + '/Forms/:id/voteResults',
          method: 'GET'
        }
      }
    );
    return R;
  }])
.factory(
  'Race',
  ['LoopBackResource', 'LoopBackAuth', '$injector',
  function(Resource, LoopBackAuth, $injector){
    var R = resource(
      urlBase + '/Races/:id',
      { 'id': "@id"},
      {
        /**
         * 描述：用户所在学校竞赛列表，所有用户
         */
        "getMySchoolRaces": {
          url: urlBase + '/Races/mySchoolRaces',
          method: 'GET',
          isArray: true
        },
        /**
         * 描述：竞赛详情，所有用户
         * 使用场景：使用场景：1、用户查看竞赛详情，2、竞赛发布方查看竞赛
         */
        "findById": {
          url: urlBase + '/Races/:id',
          method: 'GET'
        },
        /**
         * 描述：竞赛通知列表，所有用户
         * 使用场景：1、用户查看竞赛详情-竞赛通知，2、竞赛发布方查看通知列表
         */
        "prototype_get_notices": {
          url: urlBase + '/Races/:id/notices',
          method: 'GET'
        },
        /**
         * 描述：获取参赛团队，所有用户
         * 使用场景：1、用户查看竞赛详情-参赛团队，2、竞赛发布方查看参赛团队
         */
        "prototype_get_raceTeams": {
          url: urlBase + '/Races/:id/raceTeams?filter[fields][name]=true&filter[fields][logoUrl]=true&filter[fields][id]=true',
          method: 'GET'
        },


      }
    );
    return R;
  }])
.factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.rememberMe = undefined;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      var key = propsPrefix + name;
      if (value == null) value = '';
      storage[key] = value;
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out non urlBase requests
          if (config.url.substr(0, urlBase.length) !== urlBase) {
            return config;
          }
          if (LoopBackAuth.accessTokenId) {
            config.params = config.params || {};
            config.params.access_token = LoopBackAuth.accessTokenId;
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      };
    }])
.provider('LoopBackResource', function LoopBackResourceProvider() {

    this.setAuthHeader = function(header) {
      authHeader = header;
    };
    this.setUrlBase = function(url) {
      urlBase = url;
    };
    this.getUrlBase = function() {
      return urlBase;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        console.log(url);
        var resource = $resource(url, params, actions);
        resource.prototype.$save = function(success, error) {
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });
})(window, window.angular);
