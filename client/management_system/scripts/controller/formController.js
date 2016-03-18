app.controller('FormListCtrl', ['$scope', 'Team', '$rootScope', function ($scope, Team, $rootScope) {
  $rootScope.pageTitle = '表单列表';
  $scope.showType = 0;
  Team.prototype_get_forms({
    id: localStorage.$LoopBack$currentTeamId,
    filter: {
      order: 'updated DESC'
    }
  }, function (res) {
    $scope.formItems = res;
    $scope.isActivity = function (index) {
      if ($scope.showType === 0) {
        return $scope.formItems[index].activityId || $scope.formItems[index].noticeId
      } else {
        return !($scope.formItems[index].activityId || $scope.formItems[index].noticeId)
      }
    };
  }, function () {
    Materialize.toast('获取表单列表失败！', 6000);
  });

  $scope.deleteForm = function () {
    var thisElement = this;
    Team.prototype_destroyById_forms({
        id: localStorage.$LoopBack$currentTeamId,
        fk: thisElement.formItem.id
      }, function () {
        Materialize.toast('删除成功！', 2000);
        var id = thisElement.formItem.id;
        for (var x in $scope.formItems) if ($scope.formItems[x].id === id) {
          $scope.formItems.splice(x, 1);
        }
      },
      function () {
        Materialize.toast('删除失败！', 2000);
      });
  };

}]);

app.controller('FormEditCtrl', ['$scope', '$location', 'Team', '$rootScope', '$stateParams', function ($scope, $location, Team, $rootScope, $stateParams) {
  $rootScope.pageTitle = '';
  $scope.isEdit = false;
  if ($stateParams.id !== '') {
    $scope.isEdit = true;
    Team.prototype_findById_forms({
      id: localStorage.$LoopBack$currentTeamId,
      fk: $stateParams.id
    }, function (res) {
      $scope.uploadData = res;
      $scope.forms = res._formItems;
    });
  } else {
    $scope.forms = [];
    $scope.uploadData = {
      teamId: localStorage.$LoopBack$currentTeamId
    };
  }


  //$scope.formType = ['简答题', '陈述题', '选择题', '判断题'];
  $scope.formType = function (type) {
    switch (type) {
      case 'text':
        return '简答题';
        break;
      case 'select':
        return '选择题';
        break;
      case 'textarea':
        return '陈述题';
        break;
      case 'radio':
        return '判断题';
        break;

    }
  };
  $scope.addForm = {
    choice: function () {
      $scope.forms.push({
        type: 'select',
        name: '',
        options: ['A-', 'B-', 'C-', 'D-']
      });
    },
    simple: function () {
      $scope.forms.push({
        type: 'text',
        name: '',
        options: []
      });
    },
    complex: function () {
      $scope.forms.push({
        type: 'textarea',
        name: '',
        options: []
      });
    },
    judge: function () {
      $scope.forms.push({
        type: 'radio',
        name: ''
      });
    },
    file: function () {
      $scope.forms.push({
        type: 'file',
        name: '',
        options: []
      });
    },
    name: function () {
      $scope.forms.push({
        type: 'text',
        name: '姓名',
        len: 5,
        options: []
      });
    },
    sex: function () {
      $scope.forms.push({
        type: 'select',
        name: '性别',
        options: ['男', '女']
      });
    },
    personalID: function () {
      $scope.forms.push({
        type: 'text',
        name: '身份证号',
        len: 18,
        options: []
      });
    },
    hometown: function () {
      $scope.forms.push({
        type: 'text',
        name: '籍贯',
        len: 10,
        options: []
      });
    },
    studentID: function () {
      $scope.forms.push({
        type: 'text',
        name: '学号',
        len: 8,
        options: []
      });
    },
    school: function () {
      $scope.forms.push({
        type: 'select',
        name: '学院',
        options: [
          '机械工程学院', '电子信息学院', '通信工程学院', '自动化学院', '计算机学院',
          '生命信息与仪器工程学院', '材料与环境工程学院', '软件工程学院', '理学院',
          '经济学院', '管理学院', '会计学院', '外国语学院', '数字媒体与艺术设计学院',
          '人文与法学院', '马克思主义学院', '卓越学院', '信息工程学院', '国际教育学院', '继续教育学院'
        ]
      });
    },
    major: function () {
      $scope.forms.push({
        type: 'text',
        name: '专业',
        len: 20,
        options: []
      });
    },
    email: function () {
      $scope.forms.push({
        type: 'text',
        name: '电子邮箱',
        len: 30,
        options: []
      });
    },
    qqNumber: function () {
      $scope.forms.push({
        type: 'text',
        name: 'QQ号',
        len: 15,
        options: []
      });
    },
    longCellphoneNumber: function () {
      $scope.forms.push({
        type: 'text',
        name: '手机长号',
        len: 11,
        options: []
      });
    },
    shortCellphoneNumber: function () {
      $scope.forms.push({
        type: 'text',
        name: '移动短号',
        len: 6,
        options: []
      });
    },
    introduction: function () {
      $scope.forms.push({
        type: 'textarea',
        name: '个人简介',
        len: 200,
        options: []
      });
    },
    specials: function () {
      $scope.forms.push({
        type: 'textarea',
        name: '特长',
        len: 100,
        options: []
      });
    }
  };

  $scope.removeForm = function (index) {
    $scope.forms.splice(index, 1);
  };
  $scope.moveUpForm = function () {
    if (this.$index > 0) {
      $scope.forms.splice(this.$index - 1, 0, $scope.forms.splice(this.$index, 1)[0]);
    }
  };
  $scope.moveDownForm = function () {
    if (this.$index < $scope.forms.length) {
      $scope.forms.splice(this.$index + 1, 0, $scope.forms.splice(this.$index, 1)[0]);
    }
  };
  $scope.appendContent = function () {
    $scope.forms[this.$parent.$parent.$index].options.push('');
  };
  $scope.removeContent = function () {
    $scope.forms[this.$parent.$parent.$parent.$index].options.splice(this.$index, 1);
  };
  $scope.previewForm = function () {

  };


  $scope.uploadForm = function () {
    for (x in $scope.forms) {
      $scope.forms[x].id = parseInt(x);
    }
    $scope.uploadData.updated = new Date();
    $scope.uploadData._formItems = $scope.forms;
    if ($scope.forms.length === 0) {
      Materialize.toast('请至少添加一个表单项！', 1000);
    } else if (!$scope.uploadData.title) {
      Materialize.toast('请填写表单名称！', 1000);
    } else {
      if ($scope.isEdit) {
        Team.prototype_updateById_forms({
          id: localStorage.$LoopBack$currentTeamId,
          fk: $stateParams.id
        }, $scope.uploadData, function () {
          Materialize.toast('修改成功！请在表单模板里查看', 2000);
          $location.path('/MS/form/list');
        }, function () {
          Materialize.toast('修改失败！', 2000);
        });
      } else {
        Team.prototype_create_forms({
          id: localStorage.$LoopBack$currentTeamId
        }, $scope.uploadData, function () {
          Materialize.toast('创建成功！请在表单模板里查看', 2000);
          $location.path('/MS/form/list');
        }, function () {
          Materialize.toast('创建失败！', 2000);
        });
      }
    }

  };


}]);


app.controller('FormResultCtrl', ['$scope', '$rootScope', '$stateParams', 'Form', 'Team',
  function ($scope, $rootScope, $stateParams, Form, Team) {
    Team.prototype_findById_forms({
      id: localStorage.$LoopBack$currentTeamId,
      fk: $stateParams.id
    }, function (res) {
      $rootScope.pageTitle = '表单[' + res.title + ']结果';
      $scope.form = res;
    });
    Form.prototype_get_formResults({
      id: $stateParams.id
    }, function (results) {
      $scope.results = results;
    });
    var active = 'active';
    $scope.pageViewActive = active;
    $scope.pageView = function () {
      $scope.pageViewActive = active;
      $scope.allViewActive = false;
    }
    $scope.allViewActive = false;
    $scope.allView = function () {
      $scope.pageViewActive = false;
      $scope.allViewActive = active;
    }
  }]);
