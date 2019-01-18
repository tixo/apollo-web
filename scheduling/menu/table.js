define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');
  var params = '';


  function searchId(id) {
    var params = {
      
    };
    if(id){
      params.id=id;
    }
    
  }


  function search(id) {
    var params = {
      name: $.trim($('#name').val())
    };
    if(id){
      params.id=id;
    }
    console.log(params);
    table.query(params);
    
  }

  //查询事件绑定
  function initSearch() {
    $('#menuQuery').on('click', function () {
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
          $.showErrorInfo('只能选择一条要编辑的菜单信息');
        }
      }else{
        $.showErrorInfo('请选择要编辑的菜单信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的菜单信息');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('menu/info/delete', params, function (response) {
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
    title: '菜单名称',
    key: 'name',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  },{
    title: '类型',
    key: 'type',
    sortable: 'custom',
    filterFill: 'custom',
    filters: [{
      label: '栏目',
      value: '0'
    },
    {
      label: '按钮',
      value: '1'
    }
  ],
  render: (h, table) => {
    var target = '';
    var type = table.row.type;  
    if(type!==''){
      if('0'==type){
        target = '栏目';
      }
      if('1'==type){
        target = '按钮';
      }
    }
    return target;
  }
  }, {
    title: 'URL',
    key: 'url'
  }, {
    title: '菜单顺序',
    key: 'sort'
  }];

  //模块默认初始化方法
  exports.initialization = function(id) {
    var params = {
      // id:'1'
       id:id
    }
    if(id){
      
      params.id=id;
     
    }


    table.initializationWithSearchParams('tableView', 'menu/info/findPage', tableColumns, ajax, params);
    

    initActions();
  }

  exports.clickQuery = function (id) {
    search(id);
    
  }
})