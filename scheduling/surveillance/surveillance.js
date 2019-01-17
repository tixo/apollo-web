define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      title: $.trim($('#title').val()),
      reason: $.trim($('#reason').val()),
      startTime: $.trim($('#startTime').val()),
      endTime: $.trim($('#endTime').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#surveillanceQuery').on('click', function () {
      search();
    });
  }

  //添加事件绑定
  function initAdd() {
    $('#add').on('click', function () {
      window.location.href = './form.html';
    });
  }

  //编辑事件绑定
  function initEdit() {
    $('#edit').on('click', function () {
      var tempData = [];
      var selects = table.getSelectionData();

      if (!$.isEmptyObject(selects)) {
        if (selects.length == 1) {
          $.goTo('./form.html?id=' + selects[0].id)
        } else {
          $.showErrorInfo('只能选择一条要编辑的布控信息');
        }
      } else {
        $.showErrorInfo('请选择要编辑的布控信息');
      }
    });
  }

  //布控事件绑定
  function initWork() {
    $('#work').on('click', function () {
      var tempData = [];
      var selects = table.getSelectionData();

      if (!$.isEmptyObject(selects)) {
        if (selects.length == 1) {
          
          seajs.use(['../app/common/ajax'], function (ajax) {
            ajax.post('surveillance/info/findByPrimaryKey/' + selects[0].id, {}, function (response) {
              var result = response.data;
              if (result.code <= 0) {
                $.showErrorInfo('布控任务信息不存在');
              } else {
                if (result.data.taskStatus == 1) {
                  $.showErrorInfo('不能重复布控');                 
                }else{

                  ajax.post('surveillance/info/assign/' + selects[0].id, {}, function (response) {
                    var result = response.data;
                    if (result.code <= 0) {
                      $.showErrorInfo(result.data.message);
                    } else {
                      $.showErrorInfo('布控成功');
                      search();
                    }
                  });
                }
              }
            });
          });          

        } else {
          $.showErrorInfo('只能选择一条布控信息');
        }
      } else {
        $.showErrorInfo('请选择布控任务信息');
      }
    });
  }

  //撤销事件绑定
  function initUndo() {
    $('#undo').on('click', function () {
      var tempData = [];
      var selects = table.getSelectionData();

      if (!$.isEmptyObject(selects)) {
        var params = [];
        $.each(selects, function (index, data) {
          params.push(data.id);
        });

        seajs.use(['../app/common/ajax'], function (ajax) {
          ajax.post('surveillance/info/reverse/', params, function (response) {
            var result = response.data;
            if (result.code <= 0) {
              $.showErrorInfo(result.message);
            } else {
              $.showErrorInfo('布控任务撤销成功'); 
              search();
            }
          });
        });  

      } else {
        $.showErrorInfo('请选择要撤销的布控信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if ($.isEmptyObject(selects) || selects.length == 0) {
        $.showErrorInfo('请选择要删除的布控信息');
      } else {
        $.showConfirmInfo('删除', '确定要删除选中记录?', function () {
          console.log(selects);
          var params = [];
          $.each(selects, function (index, data) {
            params.push(data.id);
          });
          ajax.post('surveillance/info/delete', params, function (response) {
            var result = response.data;
            if (result.code <= 0) {
              $.showErrorInfo(result.message);
            } else {
              search();
            }
          });
          return false;
        });
      }
    });
  }

  //批量导入绑定
  function initImport() {
    $('#import').on('click', function () {
      //弹出一个iframe层
      layer.open({
        type: 2,
        title: '布控任务批量导入',
        maxmin: false,
        shadeClose: false,
        area: ['800px', '260px'],
        content: './import.html'
      });
    });
  }
  initImport();

  //恢复默认查询
  function initRefresh() {
    $('#refresh').click(function () {
      $('#queryForm')[0].reset();
      table.reset({});
    });
  }

  /**
   * 时间控件初始化
   */
  function initLaydate(startTime, endTime, type, format) {
    var start = {
      elem: '#' + startTime,
      show: true,
      closeStop: '#' + startTime,
      type: type,
      format: format
    };
    var end = {
      elem: '#' + endTime,
      show: true,
      closeStop: '#' + endTime,
      type: type,
      format: format
    };
    lay('#' + startTime).on('click', function (e) {
      if ($('#' + endTime).val() != null && $('#' + endTime).val() != undefined && $('#' + endTime).val() != '') {
        start.max = $('#' + endTime).val();
      }
      laydate.render(start);
    });
    lay('#' + endTime).on('click', function (e) {
      if ($('#' + startTime).val() != null && $('#' + startTime).val() != undefined && $('#' + startTime).val() != '') {
        end.min = $('#' + startTime).val();
      }
      laydate.render(end);
    });
  }

  initLaydate('startTime', 'endTime', 'datetime', 'yyyy-MM-dd HH:mm:ss');


  function initActions() {
    initSearch();
    initAdd();
    initEdit();
    initDelete()
    initRefresh();
    initWork();
    initUndo();
  }

  var tableColumns = [{
    title: '任务编号',
    key: 'no',
    align: 'center',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '任务名称',
    key: 'title',
    align: 'center'
  }, {
    title: '布控目标',
    key: 'target',
    width: '290',
    align: 'center',
    render: (h, params) => {
      var target = params.row.target;
      var photo = "";
      var photos = [];
      for (var i = 0; i < target.length; i++) {
        if (!$.isEmptyObject(target[i].targetFilePath)) {
          if ("car" == target[i].targetType) {
            var path = target[i].targetFilePath;
            photo = h('span', {
              domProps: {
                style: 'margin-left:5px; width: 75px; height: 18px; text-align: center;font-weight: normal;font-style: normal;z-index: 9;opacity: 1;background: #3280fc; color: #ffffff',
                textContent: path.substring(path.lastIndexOf("/") + 1)
              }
            });
          }
          if ("face" == target[i].targetType) {
            photo = h('img', {
              domProps: {
                style: 'margin-left:5px;height:50px;width:30px;',
                src: target[i].targetFilePath
              }
            });
          }
          photos.push(photo);
        } else {
          photos = "未上传";
        }
      }
      return h('div', photos);
    }
  }, {
    title: '布控级别',
    key: 'levels',
    align: 'center',
    render: (h, params) => {
      var target = '';
      var levels = params.row.levels;
      if ('0' == levels) {
        target = '黄色';
      }
      if ('1' == levels) {
        target = '红色';
      }
      return target;
    }
  }, {
    title: '布控时间',
    key: 'beginTime',
    width: '290',
    align: 'center',
    render: (h, params) => {
      var beginTime = params.row.beginTime;
      var endTime = params.row.endTime;
      return beginTime + "——" + endTime;
    }
  }, {
    title: '创建时间',
    width: '150',
    align: 'center',
    key: 'createTime',
  }, {
    title: '任务状态',
    key: 'taskStatus',
    align: 'center',
    render: (h, params) => {
      function changeStatus() {
        seajs.use('../app/common/ajax', function (ajax) {
          ajax.post('surveillance/info/updateStatus', params.row, function (response) {
            var result = response.data;
            if (result.code <= 0) {
              $.showErrorInfo(result.message);
            } else {
              var id = params.row.id;
              var icon = $("#" + id).attr("class");
              if ('icon icon-unlock-alt' == icon) {
                $("#" + id).attr("class", "icon icon-lock");
                $("#" + id).css("color", "red");
              } else {
                $("#" + id).attr("class", "icon icon-unlock-alt");
                $("#" + id).css("color", "green");
              }
            }
          });
        });
      }
      var taskStatus = params.row.taskStatus;
      var className;
      var style;
      var statusText = '';
      if ('1' == taskStatus) {
        className = 'icon icon-lock';
        style = 'color:red';
        statusText = '布控中';
      }
      if ('0' == taskStatus) {
        className = 'icon icon-unlock-alt';
        style = 'color:green';
        statusText = '已撤销';
      }
      return statusText;
      // return h('i', {
      //   domProps: {
      //     id: params.row.id,
      //     className: className,
      //     style: style
      //   },
      //   on: {
      //     click: () => {
      //       changeStatus();
      //     }
      //   }
      // });
    }
  }, {
    title: '布控原因',
    key: 'reason',
    align: 'center'
  }];

  //模块默认初始化方法
  function initialization() {
    var queryParams = {};
    var orderParams = {
      order: 'createTime'
    }
    table.initializationWithSearchAndOrderParams('tableView', 'surveillance/info/findPage', tableColumns, ajax, queryParams, orderParams)
    initActions();
  }
  initialization();
})