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
    title: '单位名称',
    key: 'name',
    align: 'center'
  }, {
    title: '单位类别',
    key: 'typeName',
    align: 'center'
  },{
    title: '地址',
    key: 'address',
    align: 'center',
    sortable: 'custom'
  }, {
    title: '法人',
    key: 'chargeName',
    align: 'center'
  }, {
    title: '联系电话',
    key: 'telephone',
    align: 'center'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'company/info/findPage', tableColumns, ajax, {
      showCheckbox: false,
      highlightRow: true
    }, function (currentRow) {
      parent.initCompanyInfo(currentRow);
      parent.layer.closeAll();
    });

    initActions();
  }


  initialization();
})