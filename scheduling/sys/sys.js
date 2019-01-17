define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      name: $.trim($('#name').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#sysQuery').on('click', function () {
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
          $.showErrorInfo('只能选择一条要编辑的系统应用信息');
        }
      }else{
        $.showErrorInfo('请选择要编辑的系统应用信息');
      }
    });
  }

  //编辑事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的系统应用信息');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          console.log(selects);
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('sys/info/delete', params, function (response) {
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
    title: '应用编号',
    key: 'appNo',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '应用名称',
    key: 'name'
  }, {
    title: '背景图片',
    key: 'icon',
    render: (h, params) => {
      var imgSrc = params.row.icon;
      if(!$.isEmptyObject(imgSrc)){
        return h('img',{domProps:{
          style:'height:50px;width:60px;',
          src:imgSrc
        }
      })
      }else{
        return '未上传';
      }
    }
  }, {
    title: '背景色',
    key: 'backColor'
  }, {
    title: '主页地址',
    key: 'sysIndex'
  }, {
    title: '显示顺序',
    key: 'sysOrder'
  }, {
    title: '备注',
    ellipsis: true,
    key: 'remark'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'sys/info/findPage', tableColumns, ajax);

    initActions();
  }

  initialization();
})