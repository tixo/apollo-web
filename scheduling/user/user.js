define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      loginName: $.trim($('#loginName').val()),
      name: $.trim($('#name').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#userQuery').on('click', function () {
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
          $.showErrorInfo('只能选择一条要编辑的用户信息');
        }
      }else{
        $.showErrorInfo('请选择要编辑的用户信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的用户信息');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          console.log(selects);
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('user/info/delete', params, function (response) {
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

  //删除事件绑定
  function initReset() {
    $('#reset').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要重置密码的用户信息');
      }
      else if(selects.length > 1){
        $.showErrorInfo('请选择要一条用户信息');
      }
      else{
        $.showConfirmInfo('重置密码','确定要重置该用户密码?',function(){
          console.log(selects);
          ajax.post('user/info/password/reset/'+selects[0].id, {}, function (response) {
            var result = response.data;
            if(result.code <=0){
              $.showErrorInfo(result.message);
            }else{
              $.showSuccessTipAndGo("密码重置成功");
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
    initReset();
  }

  var tableColumns = [{
    title: '登录名',
    key: 'loginName',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  },{
    title: '姓名',
    key: 'name',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '电话',
    key: 'mobile'
  }, {
    title: '手机',
    key: 'phone'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'user/info/findPage', tableColumns, ajax);

    initActions();
  }

  initialization();

})