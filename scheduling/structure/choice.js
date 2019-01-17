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
    title: '建筑物名称',
    key: 'name',
    align: 'center'
  }, {
    title: '建筑物编号',
    key: 'no',
    align: 'center',
    sortable: 'custom'
  }, {
    title: '建筑年代',
    key: 'years',
    align: 'center'
  }, {
    title: '地址',
    key: 'address',
    align: 'center'
  }, 
  // {
  //   title: '社区名称',
  //   key: 'community',
  //   align: 'center'
  // }, 
  {
    title: '类型',
    key: 'typeName',
    align: 'center'
  }, {
    title: '性质',
    key: 'propertyName',
    align: 'center'
  }, {
    title: '联系人',
    key: 'chargeName',
    align: 'center'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'structure/info/findPage', tableColumns, ajax, {
      showCheckbox: false,
      highlightRow: true
    }, function (currentRow) {
      parent.initStructureInfo(currentRow);
      parent.layer.closeAll();
    });

    initActions();
  }


  initialization();
})