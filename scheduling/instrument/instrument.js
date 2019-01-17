define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  var queryParams = {
    no: $.trim($('#no').val()),
    type: $.getParam('type')
  };

  function search() {
    console.log(queryParams);
    table.query({
      no: $.trim($('#no').val()),
      type: $.getParam('type')
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
      window.location.href = './form.html?type='+queryParams.type;
    });
  }

  //编辑事件绑定
  function initEdit() {
    $('#edit').on('click', function () {

      var tempData = [];
      var selects = table.getSelectionData();

      if (!$.isEmptyObject(selects)) {
        if (selects.length == 1) {
          $.goTo('./form.html?id=' + selects[0].id+'&type='+queryParams.type);
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
          var params = [];
          $.each(selects, function (index, data) {
            params.push(data.id);
          });
          ajax.post('device/info/delete', params, function (response) {
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
      $('#queryForm')[0].reset();
      search();
    });
  }

  function initActions() {
    initSearch();
    initAdd();
    initEdit();
    initDelete()
    initRefresh();
  }

  var tableColumns = [{
    title: '设备编号',
    key: 'no',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '品牌',
    key: 'vender',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '型号',
    key: 'model',
    sortable: 'custom'
  }, {
    title: '主要参数',
    key: 'params',
    sortable: 'custom'
  }];

  //模块默认初始化方法
  function initialization() {
    var typeParams = {
      type: $.getParam('type')
    };
    queryParams = $.extend(queryParams, typeParams);
    table.initializationWithSearchParams('tableView', 'device/info/findPage', tableColumns, ajax, typeParams);
    initActions();
  }
  initialization();
  if ($.isEmptyObject($.getParam('type'))) {
      document.getElementById('span').innerHTML='<i class="icon icon-list">设备列表</i>';
      document.getElementById('span1').innerText='警用设施管理';
    } else {
      if ($.getParam('type')=='policeman') {
        document.getElementById('span').innerHTML='<i class="icon icon-list">执法记录仪列表</i>';
        document.getElementById('span1').innerText='执法记录仪';
      } else {
        document.getElementById('span').innerHTML='<i class="icon icon-list">北斗定位设备列表</i>';
        document.getElementById('span1').innerText='北斗定位设备';
      }
  }
  
})