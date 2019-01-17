define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      no: $.trim($('#no').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#carQuery').on('click', function () {
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
          $.showErrorInfo('只能选择一条要编辑的车辆信息');
        }
      } else {
        $.showErrorInfo('请选择要编辑的车辆信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if ($.isEmptyObject(selects) || selects.length == 0) {
        $.showErrorInfo('请选择要删除的车辆记录');
      } else {
        $.showConfirmInfo('删除', '确定要删除选中记录?', function () {
          console.log(selects);
          var params = [];
          $.each(selects, function (index, data) {
            params.push(data.id);
          });
          ajax.post('car/info/delete', params, function (response) {
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

  //恢复默认查询
  function initRefresh() {
    $('#refresh').click(function () {
      console.log('ww');
      $('#queryForm')[0].reset();
      table.reset({});
    });
  }

  function initDownload() {
    $('#download').on('click', function () {
      ajax.download('car/info/download', {}, function (response) {
        console.log(response);
        var result = response.data;
        var linkElement = document.createElement('a');
        try {
          var blob = new Blob([result], {
            type: 'application/octet-stream'
          });
          var url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute("download", '车辆信息导入模板.xls');
          var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
          });
          linkElement.dispatchEvent(clickEvent);
        } catch (ex) {
          console.log(ex);
        }
      });
    });
  }

  function initImport() {
    $('#import').on('click', function () {
      //弹出一个iframe层
      layer.open({
        type: 2,
        title: '车辆信息批量导入',
        maxmin: false,
        shadeClose: false,
        area: ['800px', '360px'],
        content: './import.html',
        btnAlign: 'c',
        btn: ['关闭'],
        yes: function (index, layero) {
          search();
          layer.closeAll();
        },
        cancel: function(index, layero){ 
          search();
          return true; 
        }
      });
    });
  }

  function initExport() {
    $('#export').on('click', function () {
      layer.confirm('确定导出本次查询全部结果?', {icon: 3, title:'导出提示'}, function(index){
        //do something
        
        ajax.downloadPost('car/info/export', {}, function (response) {
          var result = response.data;
          var linkElement = document.createElement('a');
          try {
            var blob = new Blob([result], {
              type: 'application/octet-stream'
            });
            var url = window.URL.createObjectURL(blob);
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", '车辆信息导出.xls');
            var clickEvent = new MouseEvent("click", {
              "view": window,
              "bubbles": true,
              "cancelable": false
            });
            linkElement.dispatchEvent(clickEvent);
          } catch (ex) {
            console.log(ex);
          }
        });

        layer.close(index);
      });
    });
  }

  function initActions() {
    initSearch();
    initAdd();
    initEdit();
    initDelete()
    initRefresh();
    initImport();
    initExport();
    initDownload();
  }

  var tableColumns = [{
    title: '车牌号',
    key: 'no',
    sortable: 'custom'
    // filterFill: 'auto',
    // filters: []
  }, {
    title: '车辆类型',
    key: 'type'
  }, {
    title: '车辆型号',
    key: 'modle'
  }, {
    title: '单位',
    key: 'unit'
  }, {
    title: '部门',
    key: 'department'
  }, {
    title: '用途',
    key: 'usage'
  }, {
    title: '备注',
    ellipsis: true,
    key: 'remark'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'car/info/findPage', tableColumns, ajax);

    initActions();
  }


  initialization();
})