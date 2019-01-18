define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      keyWord: $.trim($('#keyWord').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#policeQuery').on('click', function () {
      search();
    });
  }

  function initActions() {
    initSearch();
  }

  var tableColumns = [{
    title: '产权证号',
    key: 'no',
    align: 'center'
  }, {
    title: '名称',
    key: 'name',
    align: 'center',
    sortable: 'custom'
  }, {
    title: '地址',
    key: 'address',
    align: 'center'
  }, {
    title: '间数',
    key: 'room',
    align: 'center'
  }, {
    title: '面积(平方米)',
    key: 'area',
    align: 'center'
  }, {
    title: '现状',
    key: 'statusName',
    align: 'center'
  }, {
    title: '类型',
    align: 'center',
    key: 'categoryName',
  }, {
    title: '性质',
    key: 'propertyName',
    align: 'center'
  }, {
    title: '用途',
    key: 'purposeName',
    align: 'center'
  }, {
    title: '产权人',
    key: 'lordName',
    align: 'center'
  }, {
    title: '联系电话',
    key: 'lordTelephone',
    align: 'center'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'house/info/findPage', tableColumns, ajax, {
      showCheckbox: true,
      highlightRow: true
    }, function (currentRow) {
      parent.initHouseInfo(currentRow);
      parent.layer.closeAll();
    });

    initActions();
  }


  initialization();
})