define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      no: $.trim($('#no').val()),
      name: $.trim($('#address').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#policeQuery').on('click', function () {
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
      
      if(!$.isEmptyObject(selects)){
        if(selects.length == 1){
          $.goTo('./form.html?id='+selects[0].id)
        }else{
          $.showErrorInfo('只能选择一条要编辑的报警柱记录');
        }
      }else{
        $.showErrorInfo('请选择要编辑的报警柱记录');
      }
    });
  }

  //编辑事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的报警柱记录');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          console.log(selects);
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('police/info/delete', params, function (response) {
            var result = response.data;
            if(result.code <=0){
              $.showErrorInfo(result.message);
            }else{
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

  function initActions() {
    initSearch();
    initAdd();
    initEdit();
    initDelete()
    initRefresh();
   // initDownload();
   // initImport();
   // initExport();
  }

  var tableColumns = [{
    title: '编号',
    key: 'no',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '位置',
    key: 'name',
    sortable: 'custom'
  },
  {
    title: '经度',
    key: 'mapDimension'
  }, {
    title: '纬度',
    key: 'mapLongitude'
  }, 
  {
    title: '备注',
    ellipsis: true,
    key: 'remark'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'alarm/pillar/findPage', tableColumns, ajax);

    initActions();
  }


  initialization();
})