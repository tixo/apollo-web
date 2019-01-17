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

  //查询事件绑定
  function initSearch() {
    $('#buildingQuery').on('click', function () {
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
          $.showErrorInfo('只能选择一条要编辑的建筑物信息');
        }
      }else{
        $.showErrorInfo('请选择要编辑的建筑物信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的建筑物信息');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          console.log(selects);
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('building/info/delete', params, function (response) {
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
  }

  var tableColumns = [{
    title: '建筑物编号',
    key: 'no',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  },{
    title: '建筑物名称',
    key: 'name',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '产权人（业主）',
    key: 'holderName'
  }, {
    title: '联系电话',
    key: 'holderTelephone'
  }, {
    title: '楼高',
    key: 'height'
  }, {
    title: '层数',
    key: 'floor'
  }, {
    title: '地址（门牌）',
    key: 'address'
  }, {
    title: '建筑类型',
    key: 'type'
  }, {
    title: '建筑年代',
    key: 'year'
  }, {
    title: '备注',
    ellipsis: true,
    key: 'remark'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'building/info/findPage', tableColumns, ajax);

    initActions();
  }

  initialization();

})