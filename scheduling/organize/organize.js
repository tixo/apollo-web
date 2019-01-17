define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');
  
  function searchId(id) {
    var params = {
      name: $.trim($('#name').val())
    };
    if(id){
      params.id=id;
    }
    table.query(params);
  }

  function search(id) {
    var params = {};
    if(id){
      params.id=id;
    }
    table.query(params);
  }

  //查询事件绑定
  function initSearch() {
    $('#dicQuery').on('click', function () {
      var parentId = $.zui.store.get('pid');
      searchId(parentId);
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
         
            $.goTo('./form.html?id='+selects[0].id);
         
        }else{
          $.showErrorInfo('只能选择一条要编辑的字典信息');
        }
      }else{
        $.showErrorInfo('请选择要编辑的字典信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的字典信息');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
        
          ajax.post('organization/info/delete', params, function (response) {
            var result = response.data;
            if(result.code <=0){
              $.showErrorInfo(result.message);
            }else{
              var parentId = $.zui.store.get('pid');
              search(parentId);
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
    title: '组织机构名称',
    key: 'name',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  },{
    title: '组织机构标识',
    key: 'orgKey',
    sortable: 'custom'
  },{
    title: '组织机构类型',
    key: 'type',
    render: (h, params) => {
      var result = params.row.type;  
      if('1'==result){
        return '单位'
      }
      if('2'==result){
        return '部门'
      }
    }
  }, {
    title: '备注',
    key: 'remark'
  }];

   //模块默认初始化方法
  function initialization() {
    var id = $.zui.store.get('pid');
     var params = {id:id};
    table.initializationWithSearchParams('tableView', 'organization/info/findPage', tableColumns, ajax, params);
   
    initActions();
  }
  initialization();
})


