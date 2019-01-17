define(function (require, exports, module) {
    require('utilityForm');
    var ajax = require('../../app/common/ajax');
    var table = require('../../dist/lib/table/index');
  
    function search(dic) {
      table.query({
        type:dic,
        keyWord: $.trim($('#keyWord').val())
      });
    }
  
    //查询事件绑定
    function initSearch() {
      $('#populationQuery').on('click', function () {
        search(window.parent.selectedId);
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
            $.showErrorInfo('只能选择一条要编辑的兴趣点信息');
          }
        }else{
          $.showErrorInfo('请选择要编辑的兴趣点信息');
        }
      });
    }
  
    //删除事件绑定
    function initDelete() {
      $('#delete').on('click', function () {
        var selects = table.getSelectionData();
        if($.isEmptyObject(selects) || selects.length == 0){
          $.showErrorInfo('请选择要删除的兴趣点信息');
        }else{
          $.showConfirmInfo('删除','确定要删除选中兴趣点?',function(){
            console.log(selects);
            var params = [];
            $.each(selects,function(index,data){
              params.push(data.id);
            });
            ajax.post('interest/info/delete', params, function (response) {
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
          title: '人口信息批量导入',
          maxmin: false,
          shadeClose: false, 
          area: ['800px', '260px'],
          content: './import.html'
        });
      });
    }
    initImport();
  
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
      title: '兴趣点名称',
      key: 'name',
      align: 'center'
    }, {
      title: '兴趣点图标',
      key: 'icon',
      sortable: 'custom',
      render: (h, params) => {
        var imgSrc = params.row.icon;
        if(!$.isEmptyObject(imgSrc)){
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
      title: '排序',
      key: 'sort',
      align: 'center'
    }, {
      title: '描述',
      key: 'description',
      align: 'center'
    }];
  
      //模块默认初始化方法
    function initialization() {
      table.initialization('tableView', 'interest/info/findPage', tableColumns, ajax);
      initActions();
    }
    initialization();
  })