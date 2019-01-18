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
    title: '警员编号',
    key: 'no',
    sortable: 'custom',
    filterFill: 'auto',
    filters: []
  }, {
    title: '姓名',
    key: 'name',
    sortable: 'custom'
  }, {
    title: '警员类别',
    key: 'isBackup',
    sortable: 'custom',
    render: (h, params) => {
      var target = '';
      var isBackup = params.row.isBackup;  
      
      if(!$.isEmpty(isBackup)){
        if(1==isBackup){
          target = '警员';
        }
        if(2==isBackup){
          target = '辅警';
        }
      }
      return target;
    }
  }, {
    title: '照片',
    key: 'photo',
    sortable: 'custom',
    render: (h, params) => {
      var imgSrc = params.row.photo;
      if(!$.isEmpty(imgSrc)){
        return h('img',{domProps:{
          style:'height:50px;width:60px;',
          src:imgSrc
        },
        on: {
          click: () => {
            layer.photos({
              photos: {
                //"title": "", //相册标题
                //"id": 123, //相册id
                //"start": 0, //初始显示的图片序号，默认0
                "data": [   //相册包含的图片，数组格式
                  {
                    //"alt": "图片名",
                    //"pid": 666, //图片id
                    "src": imgSrc, //原图地址
                    "thumb": "" //缩略图地址
                  }
                ]
              }
              ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
            });
          }
        }
      })
      }else{
        return '未上传';
      }
    }
  }, {
    title: '性别',
    key: 'gender',
    sortable: 'custom',
    filterFill: 'custom',
    filters: [{
        label: '男',
        value: '1'
      },
      {
        label: '女',
        value: '2'
      }
    ],
    render: (h, params) => {
      var target = '';
      var gender = params.row.gender;  
      if(!$.isEmpty(gender)){
        if('1'==gender){
          target = '男';
        }
        if('2'==gender){
          target = '女';
        }
      }
      return target;
    }
  }, {
    title: '联系方式',
    key: 'telephone'
  }, {
    title: '部门及单位',
    key: 'department',
    sortable: 'custom',
    render: (h, params) => {
      var target = '';
      if(!$.isEmpty(params.row.unit)){
        target = target + params.row.unit;
      }
      if(!$.isEmpty(params.row.department)){
        target = target + params.row.department;
      }
      return target;
    }
  }, {
    title: '岗位',
    key: 'station',
    sortable: 'custom',
    render: (h, params) => {
      var target = '';
      if(!$.isEmpty(params.row.station)){
        target =  params.row.station;
      }
      return params.row.station;
    }
  }, {
    title: '职责',
    key: 'duty'
  }, {
    title: '对讲机编号',
    key: 'deviceNo'
  }, {
    title: '备注',
    ellipsis: true,
    key: 'remark'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'police/info/findPage', tableColumns, ajax);

    initActions();
  }


  initialization();
})