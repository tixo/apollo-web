define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');
 
  function search() {
    table.query({
      title: $.trim($('#title').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#logQuery').on('click', function () {
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
          $.showErrorInfo('只能选择一条要编辑的车辆信息');
        }
      }else{
        $.showErrorInfo('请选择要编辑的车辆信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的车辆记录');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          console.log(selects);
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('log/info/delete', params, function (response) {
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
    title: '日志标题',
    key: 'title'
  }, {
    title: '操作耗时',
    key: 'requestTime'
  }, {
    title: '请求IP地址',
    key: 'remoteAddr'
  }, {
    title: '请求URI',
    key: 'requestUri'
  }, {
    title: '操作方法',
    key: 'method'
  }, {
    title: '执行结果',
    key: 'result'
  }, {
    title: '创建时间',
    key: 'createTime'
  },  {
    title: '操作用户',
    key: 'userName',
    // render: (h, params) => {
    //   var target = '';
    //   if (!$.isEmptyObject(params.row.user.name)) {
    //     target = params.row.user.name;
    //   }
    //   return target;
    // }
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'log/info/findPage', tableColumns, ajax);

    initActions();
  }


  initialization();
})