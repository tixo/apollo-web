define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      address: $.trim($('#address').val()),
      telephone: $.trim($('#telephone').val()),
      startTime: $.trim($('#startTime').val()),
      endTime: $.trim($('#endTime').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#caseQuery').on('click', function () {
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
          $.showErrorInfo('只能选择一条要编辑的案件信息');
        }
      }else{
        $.showErrorInfo('请选择要编辑的案件信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if($.isEmptyObject(selects) || selects.length == 0){
        $.showErrorInfo('请选择要删除的案件记录');
      }else{
        $.showConfirmInfo('删除','确定要删除选中记录?',function(){
          console.log(selects);
          var params = [];
          $.each(selects,function(index,data){
            params.push(data.id);
          });
          ajax.post('case/info/delete', params, function (response) {
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
        title: '案件信息批量导入',
        maxmin: false,
        shadeClose: false, 
        area: ['800px', '260px'],
        content: './import.html'
      });
    });
  }

  function initDownload() {
    $('#download').on('click', function () {
      ajax.download('case/info/download', {}, function (response) {
        console.log(response);
        var result = response.data;
        var linkElement = document.createElement('a');
        try {
          var blob = new Blob([result], {
            type: 'application/octet-stream'
          });
          var url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute("download", '案件信息导入模板.xls');
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
      console.log('ww');
      $('#queryForm')[0].reset();
      table.reset({});
    });
  }

  /**
   * 时间控件初始化
   */
  function initLaydate(startTime,endTime,type,format){
    var start = {  
        elem: '#'+startTime,  
        show: true,  
        closeStop: '#'+startTime ,
        type: type,
        format: format
    };  
    var end = {  
        elem: '#'+endTime,  
        show: true,  
        closeStop: '#'+endTime,
        type: type,
        max: new Date().toTimeString(),
        format: format
    };  
    lay('#'+startTime).on('click', function(e){
      if($('#'+endTime).val() != null && $('#'+endTime).val() != undefined && $('#'+endTime).val() != ''){
        start.max = $('#'+endTime).val();  
      }else{
        start.max = new Date().toTimeString();     //获取当前时间;
      }
        laydate.render(start); 
    });   
    lay('#'+endTime).on('click', function(e){
        if($('#'+startTime).val() != null && $('#'+startTime).val() != undefined && $('#'+startTime).val() != ''){  
            end.min = $('#'+startTime).val();  
        }  
        laydate.render(end);  
    });	
  }

  initLaydate('startTime','endTime','datetime','yyyy-MM-dd HH:mm:ss');


  function initActions() {
    initSearch();
    initAdd();
    initEdit();
    initDelete()
    initRefresh();
    initImport();
    initDownload();
  }

  var tableColumns = [{
    title: '案件编号',
    key: 'caseNumber',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '案件类型',
    key: 'categoryName'
  }, {
    title: '报警时间',
    key: 'alarmTime',
    sortable: 'custom'
  }, {
    title: '报警人',
    key: 'name'
  }, {
    title: '处警单位',
    key: 'disposeName'
  }, {
    title: '处置情况',
    key: 'result',
    render: (h, params) => {
      var target = '';
      var result = params.row.result;  
      if('1'==result){
        target = '已下发';
      }
      if('2'==result){
        target = '处理中';
      }
      if('3'==result){
        target = '已反馈';
      }
      return target;
    }
  }];

    //模块默认初始化方法
  function initialization() {
    var queryParams={};
    var orderParams={
      order:'createTime',
      sort: 'desc'
    }
    table.initializationWithSearchAndOrderParams ('tableView', 'case/info/findPage', tableColumns, ajax, queryParams,orderParams)
    initActions();
  }

  initialization();

})