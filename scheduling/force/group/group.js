define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../../app/common/ajax');
  var table = require('../../dist/lib/table/index');

  function search() {
    table.query({
      no: $.trim($('#no').val()),
      name: $.trim($('#name').val())
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
          $.showErrorInfo('只能选择一条要编辑的警员记录');
        }
      }else{
        $.showErrorInfo('请选择要编辑的警员记录');
      }
    });
  }

  //编辑事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的警员记录');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          console.log(selects);
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('force/info/delete', params, function (response) {
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

  function initDownload() {
    $('#download').on('click', function () {
      ajax.download('police/info/download', {}, function (response) {
        console.log(response);
        var result = response.data;
        var linkElement = document.createElement('a');
        try {
          var blob = new Blob([result], {
            type: 'application/octet-stream'
          });
          var url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute("download", '警员信息导入模板.xls');
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

  function initImport() {
    $('#import').on('click', function () {
      //弹出一个iframe层
      layer.open({
        type: 2,
        title: '警员信息批量导入',
        maxmin: false,
        shadeClose: false,
        area: ['800px', '360px'],
        content: './import.html',
        btnAlign: 'c',
        btn: ['关闭'],
        yes: function (index, layero) {
          search();
          layer.closeAll();
        },
        cancel: function(index, layero){ 
          search();
          return true; 
        }
      });
    });
  }

  function initExport() {
    $('#export').on('click', function () {
      layer.confirm('确定导出本次查询全部结果?', {icon: 3, title:'导出提示'}, function(index){
        //do something
        
        ajax.downloadPost('police/info/export', {}, function (response) {
          var result = response.data;
          var linkElement = document.createElement('a');
          try {
            var blob = new Blob([result], {
              type: 'application/octet-stream'
            });
            var url = window.URL.createObjectURL(blob);
            linkElement.setAttribute('href', url);
            linkElement.setAttribute("download", '警员信息导出.xls');
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

        layer.close(index);
      });
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
    initExport();
  }

  var tableColumns = [{
    title: '分组名称',
    key: 'name',
    sortable: 'custom'
  }, {
    title: '组长名称',
    key: 'captainName',
    sortable: 'custom'
  },{
    title: '出勤状态',
    key: 'status',
    render: (h, params) => {
      var target = '';
      var status = params.row.status;
      if (!$.isEmpty(status)) {
        if (1 == status) {
          target = '外出执勤';
        }
        if (0 == status) {
          target = '未外出执勤';
        }
      }
      return target;
    }
  },{
    title: '任务名称',
    key: 'taskName'
  }, {
    title: '成员总数',
    key: 'total'
  }, {
    title: '创建时间',
    ellipsis: true,
    key: 'createTime'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'force/info/findPage', tableColumns, ajax);

    initActions();
  }


  initialization();
})