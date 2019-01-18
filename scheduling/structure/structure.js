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
      $('#populationQuery').on('click', function () {
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
            ajax.post('structure/info/delete', params, function (response) {
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
  
    //批量导入绑定
    function initImport() {
      $('#import').on('click', function () {
        //弹出一个iframe层
        layer.open({
          type: 2,
          title: '建筑物信息批量导入',
          maxmin: false,
          shadeClose: false, 
          area: ['800px', '260px'],
          content: './import.html'
        });
      });
    }
  
    function initDownload() {
      $('#download').on('click', function () {
        ajax.download('structure/info/download', {}, function (response) {
          var result = response.data;
          var linkElement = document.createElement('a');
          try {
            var blob = new Blob([result], {
              type: 'application/octet-stream'
            });
            var url = window.URL.createObjectURL(blob);
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", '建筑物信息导入模板.xls');
            var clickEvent = new MouseEvent("click", {
              "view": window,
              "bubbles": true,
              "cancelable": false
            });
            linkElement.dispatchEvent(clickEvent);
          } catch (ex) {
            console.log(ex);
          }
        });
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
      initDownload();
      initImport();
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
    },  {
      title: '层数',
      key: 'floorCount',
      align: 'center'
    },{
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
      table.initialization('tableView', 'structure/info/findPage', tableColumns, ajax);
      initActions();
    }
    initialization();
  })