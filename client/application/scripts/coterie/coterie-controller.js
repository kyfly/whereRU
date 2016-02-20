app.controller('CoteriesController', 
  ['$scope', 'User','Coterie', '$location', function ($scope, User, Coterie, $location) {
  $scope.more = false;
  $scope.moreOrBack = $scope.more ? '返回' : '发现';
  function getCoteries() {
    User.prototype_get_coteries({
      id: $scope.$currentUser.id
    }, function (coteries) {
      $scope.coteries = coteries;
      $location.path('/w/coteries/' + $scope.coteries[0].id);
    });
  }
  //getCoteries();
  $scope.moreCoteries = function () {
    $scope.more = !$scope.more;
    if ($scope.more) {
       Coterie.find(function (coteries) {
        $scope.coteries = coteries;
      });
    }
    else {
      getCoteries();
    }
    $scope.moreOrBack = $scope.more ? '返回' : '发现';
  };
  if ($scope.$currentUser) {
    getCoteries();
  } 
}]);

app.controller('CoterieController', 
  ['$scope', '$stateParams', 'User','Coterie', 'Article', 'Comment',
  function ($scope, $stateParams, User, Coterie, Article, Comment) {
  Coterie.findById({
    id: $stateParams.id
  }, function (coterie) {
    $scope.coterie = coterie;
  });
  Coterie.prototype_count_fans({
    id: $stateParams.id
  }, function (fans) {
    $scope.fansCount = fans.count;
  });
  Coterie.prototype_get_articles({
    id: $stateParams.id
  }, function (articles) {
    $scope.articles = articles;
  }, function () {
  });
  if (!$scope.more && $scope.$currentUser) {
    User.prototype_link_coteries({
      id: $scope.$currentUser.id,
      fk: $stateParams.id
    }, {}, function (res) {
      
    }, function (err) {
      console.log(err);
    });
  }
  $scope.attention = function () {
    User.prototype_link_coteries({
        id: $scope.$currentUser.id,
        fk: $stateParams.id
      }, {}, function (res) {
        $scope.coterie.isAttentioned = true;
        Materialize.toast('关注成功！', 2000);
      }, function (err) {
        console.log(err);
        Materialize.toast('关注失败！', 2000);
      }
    );
  };

  $scope.loadComment = function () {
    var article = this.article;
    this.article.commentTextarea = true;
    if (article.showCommentBox) {
      article.showCommentBox = false;
      return;
    }
    Article.prototype_get_comments({
      id: article.id
    }, function (comments) {
      article.comments = comments;
    });
    article.showCommentBox = true;
  }
  $scope.createComment = function () {
    var article = this.article;
    if (!article.writingCommentContent) {
      Materialize.toast('请先输入评论内容', 4000);
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
      article.comments.push(comment);
      article.writingCommentContent = null;
      Materialize.toast('评论成功', 4000);
    });
  };
  $scope.loadReply = function () {
    var comment = this.comment;
    this.article.commentTextarea = false;
    if (comment.showReplyBox) {
      comment.showReplyBox = false;
      return;
    }
    Comment.prototype_get_replys({
      id: this.comment.id
    }, function (replys) {
      console.log(replys);
      comment.replys = replys;
    });
    comment.showReplyBox = true;
  };
  $scope.createReply = function () {
    var comment = this.comment;
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
      comment.replys.push(reply);
      comment.writingReplyContent = null;
      Materialize.toast('回复成功', 4000);
    });
  }
  $scope.addLike = function () {
    var article = this.article;
    User.prototype_create_likeUsers({
      id: $scope.$currentUser.id
    }, {
      articleId: article.id,
      created: new Date()
    }, function (res) {

      if (res.status === 1) {
        article.likeCount ++;
        article.islike = true;
        Materialize.toast('文章标记为喜欢', 4000);
      } else {
        Materialize.toast('文章已经被标记为喜欢', 4000);
      }
    });
  };
}]);
app.controller('ArticlesController', 
  ['$scope', '$stateParams', 'User','Coterie' , 'Ueditor', '$http', '$location',
  function ($scope, $stateParams, User, Coterie, Ueditor, $http, $location) {
  Coterie.findById({
    id: $stateParams.id
  }, function (coterie) {
    $scope.coterie = coterie;
  });
  $scope.editorConfig = Ueditor.config;
  $scope.article = {};
  $scope.createArticle = function () {
    var content = $scope.articleEditorContent;
    var title = $scope.article.title;

    if (!content || !title) {
      Materialize.toast('文章标题和内容都不能为空', 4000);
      return;
    }
    $http({
      url: '/ue/uploads?dir=user&id=' + $scope.$currentUser.id + '&action=uploadtext',
      method: "post",
      data: {
        'content': $scope.articleEditorContent
      }
    }).success(function (res) {
      $scope.article.contentUrl = 'http://oss.etuan.org/' + res.url;
      $scope.article.created = new Date();
      $scope.article.coterieId = $stateParams.id;
      User.prototype_create_articles({
        id: $scope.$currentUser.id
      }, $scope.article, function (article) {
        console.log(article);
        Materialize.toast('文章发布成功', 4000);
        $location.path('/w/coteries/' + $stateParams.id);
      });
    })
  };

}]);

app.controller('ArticleController', 
  ['$scope', '$stateParams', 'User','Coterie', 'Article', 'Comment',
  function ($scope, $stateParams, User, Coterie, Article, Comment) {
  if (!$scope.$currentUser) {
    $scope.$currentUser = {};
    $scope.$currentUser.id = 0;
  }
  Coterie.prototype_findById_articles({
    id: $stateParams.id,
    fk: $stateParams.fk
  }, function (article) {
    $scope.article = article;
  });
  Article.prototype_get_comments({
    id: $stateParams.fk
  }, function (comments) {
    $scope.comments = comments;
  });
  Article.prototype_create_readers({
    id: $stateParams.fk
  }, {
    userId: $scope.$currentUser.id,
    form: 'pc'//带修改
  });
  $scope.createComment = function () {
    if (!$scope.article.writingCommentContent) {
      Materialize.toast('请先输入评论内容', 4000);
      return;
    }
    User.prototype_create_comments({
      id: $scope.$currentUser.id
    }, {
      articleId: $scope.article.id,
      created: new Date(),
      content: $scope.article.writingCommentContent
    }, function (comment) {
      comment.user = {
        headImgUrl: $scope.$currentUser.headImgUrl,
        id: $scope.$currentUser.id,
        name: $scope.$currentUser.name
      };
      $scope.comments.push(comment);
      $scope.article.writingCommentContent = null;
      Materialize.toast('评论成功', 4000);
    });
  };
  $scope.loadReply = function () {
    var comment = this.comment;
    this.article.commentTextarea = false;
    if (comment.showReplyBox) {
      comment.showReplyBox = false;
      return;
    }
    Comment.prototype_get_replys({
      id: this.comment.id
    }, function (replys) {
      console.log(replys);
      comment.replys = replys;
    });
    comment.showReplyBox = true;
  };
  $scope.createReply = function () {
    var comment = this.comment;
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
      comment.replys.push(reply);
      comment.writingReplyContent = null;
      Materialize.toast('回复成功', 4000);
    });
  }
  $scope.addLike = function () {
    var article = this.article;
    User.prototype_create_likeUsers({
      id: $scope.$currentUser.id
    }, {
      articleId: article.id,
      created: new Date()
    }, function (res) {

      if (res.status === 1) {
        article.likeCount ++;
        article.islike = true;
        Materialize.toast('文章标记为喜欢', 4000);
      } else {
        Materialize.toast('文章已经被标记为喜欢', 4000);
      }
    });
  };
}]);


