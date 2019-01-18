define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      no: $.trim($('#no').val()),
      planName: $.trim($('#planName').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#planQuery').on('click', function () {
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
            $.showErrorInfo('只能选择一条要编辑的预案文档信息');
          }
        }else{
          $.showErrorInfo('请选择要编辑的布控信息');
        }
      });
    }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if ($.isEmptyObject(selects) || selects.length == 0) {
        $.showErrorInfo('请选择要删除的预案信息');
      } else {
        $.showConfirmInfo('删除', '确定要删除选中记录?', function () {
          console.log(selects);
          var params = [];
          $.each(selects, function (index, data) {
            params.push(data.id);
          });
          ajax.post('plan/info/delete', params, function (response) {
            var result = response.data;
            if (result.code <= 0) {
              $.showErrorInfo(result.message);
            } else {
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

  var tableColumns = [
  //   {
  //   title: '预案编号',
  //   key: 'no',
  //   sortable: 'custom',
  //   filterFill: 'auto',
  //   filters: []
  // }, 
  {
    title: '预案名称',
    key: 'planName',
    sortable: 'custom'
  }, {
    title: '预案图片',
    key: 'planPicUrl',
    render: (h, params) => {
      var imgSrc = params.row.planPicUrl;
      if (!$.isEmptyObject(imgSrc)) {
        return h('img', {
          domProps: {
            style: 'height:50px;width:60px;cursor:pointer',
            src: imgSrc
          },
          on: {
            click: () => {
              layer.photos({
                photos: {
                  "data": [ //相册包含的图片，数组格式
                    {
                      "src": imgSrc, //原图地址
                      "thumb": "" //缩略图地址
                    }
                  ]
                },
                anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
              });
            }
          }

        })
      } else {
        return '未上传';
      }
    }
  }, {
    title: '预案文档',
    key: 'planDocumentUrl',
    render: (h, params) => {
      var documentSrc = params.row.planDocumentUrl;
      if (!$.isEmptyObject(documentSrc)) {
        return h('a', {
          domProps: {
            href: '#'
          },
          on: {
            click: () => {
              ajax.get('plan/info/prepare?filePath='+documentSrc, {}, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                  $.showErrorInfo(result.message);
                } else {
                  var browserUrl = top.fhzxApolloApi + 'plan/info/preview?filePath='+documentSrc+'&userId=' + top.authorization.userId + '&userToken=' + top.authorization.userToken;
                  var index = layer.open({
                    id: 'export_preview',
                    title: '预案文档预览',
                    type: 2,
                    shade: 0.8,
                    //skin: 'layui-layer-lan',
                    content: top.frontHttpUrl + 'scheduling/plan/preview/viewer.html?file=' + encodeURIComponent(browserUrl),
                    area: [eval(window.screen.hight) + 'px', eval(window.screen.width - 400) + 'px'],
                    maxWidth: window.screen.width - 400 + 'px',
                    maxmin: true,
                    moveOut: true,
                    closeBtn: 2,
                    btnAlign: 'c',
                    btn: ['关闭'],
                    yes: function (index, layero) {
    
                      layer.closeAll();
                    }
                  });
                  layer.full(index);
                }
              });
              // alert(window.screen.width);
            }
          }

        }, '查看')
      } else {
        return '未上传';
      }
    }
  }, {
    title: '预案分类',
    key: 'categoryName'
  }, {
    title: '创建时间',
    key: 'createTime'
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'plan/info/findPage', tableColumns, ajax);

    initActions();
  }

  initialization();

})