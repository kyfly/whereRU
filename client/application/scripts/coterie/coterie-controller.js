app.controller('CoteriesController',
  ['$scope', 'User', 'Coterie', '$location', function ($scope, User, Coterie, $location) {
    $scope.more = false;
    $scope.moreOrBack = $scope.more ? '返回' : '发现';
    function getCoteries() {
      User.prototype_get_coteries({
        id: $scope.$currentUser.id
      }, function (coteries) {
        $scope.coteries = coteries;
        if (coteries.length && !$location.path().match(/\/w\/coteries\/.+/))
          $location.path('/w/coteries/' + $scope.coteries[0].id);
      });
    }

    $scope.goLogin = function () {
      if (!$scope.$currentUser) {
        return $scope.$emit('auth:loginRequired');
      }
    };
    $scope.moreCoteries = function () {
      $scope.more = !$scope.more;
      if ($scope.more) {
        Coterie.find(function (coteries) {
          $scope.coteries = coteries;
        });
      }
      else {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        getCoteries();
      }
      $scope.moreOrBack = $scope.more ? '返回' : '发现';
    };
    if ($scope.$currentUser) {
      getCoteries();
    }
  }]);
app.controller('CoterieController',
  ['$scope', '$stateParams', 'Coterie', 'User', 'Ueditor', '$http', '$location',
    function ($scope, $stateParams, Coterie, User, Ueditor, $http, $location) {
      Coterie.findById({
        id: $stateParams.id
      }, function (coterie) {
        $scope.coterie = coterie;
        $scope.$emit('shareContentArrive', {
          bdText: coterie.name,
          bdPic: coterie.logoUrl
        });
        if (coterie.isAttentioned) {
          User.prototype_updateById_coteries({
            id: $scope.$currentUser.id,
            fk: $stateParams.id
          }, {
            lastView: new Date()
          }, function (res) {

          }, function (err) {
            console.log(err);
          });
        }
      });
      Coterie.prototype_get_articles({
        id: $stateParams.id
      }, function (articles) {
        $scope.articles = articles;
      }, function () {
      });

      $scope.editorConfig = Ueditor.config;
      $scope.article = {};
      $scope.createArticle = function () {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        var content = $scope.articleEditorContent;
        var title = $scope.article.title;

        if (!content || !title) {
          Materialize.toast('文章标题和内容都不能为空', 2000);
          return;
        }
        $http({
          url: '/ue/uploads?dir=user&id=' + $scope.$currentUser.id + '&action=uploadtext',
          method: "post",
          data: {
            'content': $scope.articleEditorContent
          }
        }).success(function (res) {
          $scope.article.contentUrl = res.url;
          $scope.article.created = new Date();
          $scope.article.coterieId = $stateParams.id;
          User.prototype_create_articles({
            id: $scope.$currentUser.id
          }, $scope.article, function (article) {
            console.log(article);
            Materialize.toast('文章发布成功', 2000);
            $location.path('/w/coteries/' + $stateParams.id);
          });
        })
      };
      $scope.attention = function () {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        User.prototype_create_coteries({
            id: $scope.$currentUser.id
          }, {
            lastView: new Date(),
            coterieId: $stateParams.id
          }, function (res) {
            $scope.coterie.isAttentioned = true;
            Materialize.toast('关注成功！', 2000);
          }, function (err) {
            console.log(err);
            Materialize.toast('关注失败！', 2000);
          }
        );
      };
      $scope.addLike = function () {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        var article = this.article;
        User.prototype_create_likeUsers({
          id: $scope.$currentUser.id
        }, {
          articleId: article.id,
          created: new Date()
        }, function (res) {
          if (res.status === 1) {
            article.likeCount++;
            article.islike = true;
            Materialize.toast('文章收藏成功', 2000);
          }
        });
      };
    }]);
app.controller('ArticlesController',
  ['$scope', 'Article', 'User', function ($scope, Article, User) {
    $scope.addLike = function () {
      if (!$scope.$currentUser) {
        return $scope.$emit('auth:loginRequired');
      }
      var article = this.article;
      User.prototype_create_likeUsers({
        id: $scope.$currentUser.id
      }, {
        articleId: article.id,
        created: new Date()
      }, function (res) {
        if (res.status === 1) {
          article.likeCount++;
          article.islike = true;
          Materialize.toast('文章收藏成功', 2000);
        }
      });
    };
    $scope.deleteLike = function () {
      var article = this.article;
      User.prototype_get_likeUsers({
        id: $scope.$currentUser.id,
        filter: {
          where: {
            articleId: this.article.id
          }
        }
      }, function (res) {
        User.prototype_destroyById_likeUsers({
          id: $scope.$currentUser.id,
          fk: res[0].id
        }, function () {
            article.likeCount--;
            article.islike = false;
            Materialize.toast('文章取消收藏成功', 2000);

        })
      });
    };
    $scope.loadComment = function () {
      var article = this.article;
      this.article.commentTextarea = true;
      if (article.showCommentBox) {
        article.showCommentBox = false;
        return;
      }
      Article.prototype_get_comments({
        id: article.id,
        filter: {
          order: 'created DESC'
        }
      }, function (comments) {
        article.comments = comments;
      });
      article.showCommentBox = true;
    };
  }]);
app.controller('CommentsController',
  ['$scope', 'Comment', 'User', 'Article', '$interval', function ($scope, Comment, User, Article, $interval) {
    $scope.createComment = function () {
      var article = this.article;
      if (!$scope.$currentUser) {
        return $scope.$emit('auth:loginRequired');
      }
      if (!article.writingCommentContent) {
        Materialize.toast('请先输入评论内容', 2000);
        return;
      }
      User.prototype_create_comments({
        id: $scope.$currentUser.id
      }, {
        articleId: article.id,
        created: new Date(),
        content: article.writingCommentContent
      }, function (comment) {
        comment.user = {
          headImgUrl: $scope.$currentUser.headImgUrl,
          id: $scope.$currentUser.id,
          name: $scope.$currentUser.name
        };
        article.commentCount++;
        comment.replyCount = 0;
        article.comments.splice(0, 0, comment);
        article.writingCommentContent = null;
        Materialize.toast('评论成功', 2000);
      });
    };
    $scope.reload = function () {
      Article.prototype_get_comments({
        id: this.article.id,
        filter: {
          order: 'created DESC'
        }
      }, function (comments) {
        $scope.article.comments = comments;
      });
    };
    $scope.loadReply = function () {
      var comment = this.comment;
      Comment.prototype_get_replys({
        id: this.comment.id
      }, function (replys) {
        comment.replys = replys;
      });
    };
    $scope.createReply = function () {
      var comment = this.comment;
      if (!$scope.$currentUser) {
        return $scope.$emit('auth:loginRequired');
      }
      if (!comment.writingReplyContent) {
        Materialize.toast('请先输入回复内容', 2000);
        return;
      }
      User.prototype_create_replys({
        id: $scope.$currentUser.id
      }, {
        commentId: comment.id,
        created: new Date(),
        content: comment.writingReplyContent
      }, function (reply) {
        reply.user = {
          id: $scope.$currentUser.id,
          name: $scope.$currentUser.name
        };
        comment.replyCount++;
        comment.replys.push(reply);
        comment.writingReplyContent = null;
        Materialize.toast('回复成功', 2000);
      });
    }
  }]);
app.controller('ArticleController',
  ['$scope', '$stateParams', 'User', 'Coterie', 'Article', 'Comment',
    function ($scope, $stateParams, User, Coterie, Article, Comment) {
      if (!$scope.$currentUser) {
        $scope.$currentUser = {};
        $scope.$currentUser.id = 0;
      }
      Article.findById({
        id: $stateParams.id
      }, function (article) {
        $scope.article = article;
        $scope.$emit('shareContentArrive', {
          bdText: article.title
        });
        Article.prototype_get_comments({
          id: $stateParams.id
        }, function (comments) {
          $scope.article.comments = comments;
        });
        $scope.article.showCommentBox = true;
      });

      Article.prototype_create_readers({
        id: $stateParams.id
      }, {
        userId: $scope.$currentUser.id,
        form: 'pc'//带修改
      });
      $scope.addLike = function () {
        if (!$scope.$currentUser) {
          return $scope.$emit('auth:loginRequired');
        }
        var article = this.article;
        User.prototype_create_likeUsers({
          id: $scope.$currentUser.id
        }, {
          articleId: article.id,
          created: new Date()
        }, function (res) {
          if (res.status === 1) {
            article.likeCount++;
            article.islike = true;
            Materialize.toast('文章收藏成功', 2000);
          }
        });
      };
      $scope.deleteLike = function () {
        var article = this.article;
        User.prototype_get_likeUsers({
          id: $scope.$currentUser.id,
          filter: {
            where: {
              articleId: this.article.id
            }
          }
        }, function (res) {
          User.prototype_destroyById_likeUsers({
            id: $scope.$currentUser.id,
            fk: res[0].id
          }, function () {
            article.likeCount--;
            article.islike = false;
            Materialize.toast('文章取消收藏成功', 2000);

          })
        });
      };

    }]);

