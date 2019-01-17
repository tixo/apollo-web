define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      no: $.trim($('#no').val()),
      name: $.trim($('#name').val())
    });
  }

  function initSearch() {
    //查询事件绑定
    $('#policeQuery').on('click', function () {
      search();
    });
  }

  function initAdd() {
    //查询事件绑定
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
          $.showErrorInfo('只能选择一条要编辑的设备记录');
        }
      } else {
        $.showErrorInfo('请选择要编辑的设备记录');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if ($.isEmptyObject(selects) || selects.length == 0) {
        $.showErrorInfo('请选择要删除的设备记录');
      } else {
        $.showConfirmInfo('删除', '确定要删除选中记录?', function () {
          console.log(selects);
          var params = [];
          $.each(selects, function (index, data) {
            params.push(data.id);
          });
          ajax.post('camera/info/delete', params, function (response) {
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
      search();
    });
  }

  function initDownload() {
    $('#download').on('click', function () {
      ajax.download('camera/info/download', {}, function (response) {
        var result = response.data;
        var linkElement = document.createElement('a');
        try {
          var blob = new Blob([result], {
            type: 'application/octet-stream'
          });
          var url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute("download", '摄像头信息导入模板.xls');
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
        title: '摄像头信息批量导入',
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
        cancel: function (index, layero) {
          search();
          return true;
        }
      });
    });
  }

  function initActions() {
    initSearch();
    initAdd();
    initEdit();
    initDelete()
    initRefresh();
    initDownload();
    initImport();
  }

  var tableColumns = [{
      title: '设备编号',
      key: 'no',
      sortable: 'custom',
      filterFill: 'auto',
      filters: []
    }, {
      title: '设备名称',
      key: 'name',
      sortable: 'custom',
      filterFill: 'auto',
      filters: []
    },
    {
      title: '安装地址',
      key: 'installationAddress',
      sortable: 'custom',
      filterFill: 'auto',
      filters: []
    }, {
      title: '摄像机位置类型',
      key: 'cameraLocationType',
      sortable: 'custom'
    }, {
      title: '卡口类型',
      key: 'bayonetType',
      sortable: 'custom',
      filterFill: 'auto',
      filters: []
    }, {
      title: '所属单位',
      key: 'unit',
      sortable: 'custom',
      filterFill: 'auto',
      filters: []
    }
  ];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'camera/info/findPage', tableColumns, ajax);
    initActions();
  }
  initialization();
})