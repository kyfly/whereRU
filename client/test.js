module.factory(
  "RUser",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/user/:id",
      { 'id': '@id' },
      {
        "prototype$__findById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/accessTokens/:fk",
          method: "GET"
        },

        "prototype$__destroyById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/accessTokens/:fk",
          method: "DELETE"
        },
        "prototype$__updateById__accessTokens": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/accessTokens/:fk",
          method: "PUT"
        },

        // INTERNAL. Use RUser.teams.findById() instead.
        "prototype$__findById__teams": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/teams/:fk",
          method: "GET"
        },

        // INTERNAL. Use RUser.teams.destroyById() instead.
        "prototype$__destroyById__teams": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/teams/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use RUser.teams.updateById() instead.
        "prototype$__updateById__teams": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/teams/:fk",
          method: "PUT"
        },

        // INTERNAL. Use RUser.messages.findById() instead.
        "prototype$__findById__messages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/messages/:fk",
          method: "GET"
        },

        // INTERNAL. Use RUser.messages.destroyById() instead.
        "prototype$__destroyById__messages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/messages/:fk",
          method: "DELETE"
        },

        // INTERNAL. Use RUser.messages.updateById() instead.
        "prototype$__updateById__messages": {
          params: {
          'fk': '@fk'
          },
          url: urlBase + "/user/:id/messages/:fk",
          method: "PUT"
        },

        "prototype$__get__accessTokens": {
          isArray: true,
          url: urlBase + "/user/:id/accessTokens",
          method: "GET"
        },

        "prototype$__create__accessTokens": {
          url: urlBase + "/user/:id/accessTokens",
          method: "POST"
        },

         
        "prototype$__delete__accessTokens": {
          url: urlBase + "/user/:id/accessTokens",
          method: "DELETE"
        },

         
        "prototype$__count__accessTokens": {
          url: urlBase + "/user/:id/accessTokens/count",
          method: "GET"
        },

        // INTERNAL. Use RUser.teams() instead.
        "prototype$__get__teams": {
          isArray: true,
          url: urlBase + "/user/:id/teams",
          method: "GET"
        },

        // INTERNAL. Use RUser.teams.create() instead.
        "prototype$__create__teams": {
          url: urlBase + "/user/:id/teams",
          method: "POST"
        },

        // INTERNAL. Use RUser.teams.destroyAll() instead.
        "prototype$__delete__teams": {
          url: urlBase + "/user/:id/teams",
          method: "DELETE"
        },

        // INTERNAL. Use RUser.teams.count() instead.
        "prototype$__count__teams": {
          url: urlBase + "/user/:id/teams/count",
          method: "GET"
        },

        // INTERNAL. Use RUser.messages() instead.
        "prototype$__get__messages": {
          isArray: true,
          url: urlBase + "/user/:id/messages",
          method: "GET"
        },

        // INTERNAL. Use RUser.messages.create() instead.
        "prototype$__create__messages": {
          url: urlBase + "/user/:id/messages",
          method: "POST"
        },

        // INTERNAL. Use RUser.messages.destroyAll() instead.
        "prototype$__delete__messages": {
          url: urlBase + "/user/:id/messages",
          method: "DELETE"
        },

        // INTERNAL. Use RUser.messages.count() instead.
        "prototype$__count__messages": {
          url: urlBase + "/user/:id/messages/count",
          method: "GET"
        },

         
        "create": {
          url: urlBase + "/user",
          method: "POST"
        },

         
        "createMany": {
          isArray: true,
          url: urlBase + "/user",
          method: "POST"
        },

         
        "upsert": {
          url: urlBase + "/user",
          method: "PUT"
        },

         
        "exists": {
          url: urlBase + "/user/:id/exists",
          method: "GET"
        },

         
        "findById": {
          url: urlBase + "/user/:id",
          method: "GET"
        },

         
        "find": {
          isArray: true,
          url: urlBase + "/user",
          method: "GET"
        },

         
        "findOne": {
          url: urlBase + "/user/findOne",
          method: "GET"
        },

         
        "updateAll": {
          url: urlBase + "/user/update",
          method: "POST"
        },

         
        "deleteById": {
          url: urlBase + "/user/:id",
          method: "DELETE"
        },

         
        "count": {
          url: urlBase + "/user/count",
          method: "GET"
        },

         
        "prototype$updateAttributes": {
          url: urlBase + "/user/:id",
          method: "PUT"
        },

         
        "createChangeStream": {
          url: urlBase + "/user/change-stream",
          method: "POST"
        },

         
        "login": {
          params: {
            include: "user"
          },
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
              LoopBackAuth.save();
              return response.resource;
            }
          },
          url: urlBase + "/user/login",
          method: "POST"
        },

         
        "logout": {
          interceptor: {
            response: function(response) {
              LoopBackAuth.clearUser();
              LoopBackAuth.clearStorage();
              return response.resource;
            }
          },
          url: urlBase + "/user/logout",
          method: "POST"
        },

         
        "confirm": {
          url: urlBase + "/user/confirm",
          method: "GET"
        },

         
        "resetPassword": {
          url: urlBase + "/user/reset",
          method: "POST"
        },

         
        "getCurrent": {
           url: urlBase + "/user" + "/:id",
           method: "GET",
           params: {
             id: function() {
              var id = LoopBackAuth.currentUserId;
              if (id == null) id = '__anonymous__';
              return id;
            },
          },
          interceptor: {
            response: function(response) {
              LoopBackAuth.currentUserData = response.data;
              return response.resource;
            }
          },
          __isGetCurrentUser__ : true
        }
      }
    );
        R["updateOrCreate"] = R["upsert"];

        
        R["update"] = R["updateAll"];

         
        R["destroyById"] = R["deleteById"];

         
        R["removeById"] = R["deleteById"];

         
        R.getCachedCurrent = function() {
          var data = LoopBackAuth.currentUserData;
          return data ? new R(data) : null;
        };

         
        R.isAuthenticated = function() {
          return this.getCurrentId() != null;
        };

         
        R.getCurrentId = function() {
          return LoopBackAuth.currentUserId;
        };

     
    R.modelName = "RUser";

     


         
        R.teams = function() {
          var TargetResource = $injector.get("Team");
          var action = TargetResource["::get::RUser::teams"];
          return action.apply(R, arguments);
        };

         
        R.teams.count = function() {
          var TargetResource = $injector.get("Team");
          var action = TargetResource["::count::RUser::teams"];
          return action.apply(R, arguments);
        };

         
        R.teams.create = function() {
          var TargetResource = $injector.get("Team");
          var action = TargetResource["::create::RUser::teams"];
          return action.apply(R, arguments);
        };

         
        R.teams.createMany = function() {
          var TargetResource = $injector.get("Team");
          var action = TargetResource["::createMany::RUser::teams"];
          return action.apply(R, arguments);
        };

         
        R.teams.destroyAll = function() {
          var TargetResource = $injector.get("Team");
          var action = TargetResource["::delete::RUser::teams"];
          return action.apply(R, arguments);
        };

         
        R.teams.destroyById = function() {
          var TargetResource = $injector.get("Team");
          var action = TargetResource["::destroyById::RUser::teams"];
          return action.apply(R, arguments);
        };

         
        R.teams.findById = function() {
          var TargetResource = $injector.get("Team");
          var action = TargetResource["::findById::RUser::teams"];
          return action.apply(R, arguments);
        };

         


         
        R.messages = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::get::RUser::messages"];
          return action.apply(R, arguments);
        };

         
        R.messages.count = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::count::RUser::messages"];
          return action.apply(R, arguments);
        };

         
        R.messages.create = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::create::RUser::messages"];
          return action.apply(R, arguments);
        };

         
        R.messages.createMany = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::createMany::RUser::messages"];
          return action.apply(R, arguments);
        };

         
        R.messages.destroyAll = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::delete::RUser::messages"];
          return action.apply(R, arguments);
        };

         
        R.messages.destroyById = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::destroyById::RUser::messages"];
          return action.apply(R, arguments);
        };

         
        R.messages.findById = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::findById::RUser::messages"];
          return action.apply(R, arguments);
        };

         
        R.messages.updateById = function() {
          var TargetResource = $injector.get("UserMessage");
          var action = TargetResource["::updateById::RUser::messages"];
          return action.apply(R, arguments);
        };

    return R;
  }]);