define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../../app/common/ajax');
  var table = require('../../dist/lib/table/index');
  var params = {

  };

  function search() {
    table.query(params);
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

      if (!$.isEmptyObject(selects)) {
        if (selects.length == 1) {
          $.goTo('./form.html?id=' + selects[0].id)
        } else {
          $.showErrorInfo('只能选择一条要编辑的兴趣点信息');
        }
      } else {
        $.showErrorInfo('请选择要编辑的兴趣点信息');
      }
    });
  }

  //删除事件绑定
  function initDelete() {
    $('#delete').on('click', function () {
      var selects = table.getSelectionData();
      if ($.isEmptyObject(selects) || selects.length == 0) {
        $.showErrorInfo('请选择要删除的兴趣点信息');
      } else {
        $.showConfirmInfo('删除', '确定要删除选中兴趣点?', function () {
          console.log(selects);
          var params = [];
          $.each(selects, function (index, data) {
            params.push(data.id);
          });
          ajax.post('interest/place/delete', params, function (response) {
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

  //批量导入绑定
  function initImport() {
    $('#import').on('click', function () {
      //弹出一个iframe层
      layer.open({
        type: 2,
        title: '九小场所信息批量导入',
        maxmin: false,
        shadeClose: false,
        area: ['800px', '260px'],
        content: './import.html'
      });
    });
  }

  function initDownload() {
    $('#download').on('click', function () {
      ajax.download('interest/place/download', {}, function (response) {
        var result = response.data;
        var linkElement = document.createElement('a');
        try {
          var blob = new Blob([result], {
            type: 'application/octet-stream'
          });
          var url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute("download", '九小场所信息导入模板.xls');
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
    title: '国标代码',
    key: 'gb',
    align: 'center'
  }, {
    title: '符号代码',
    key: 'fhcode',
    align: 'center',
    sortable: 'custom'
  }, {
    title: '图标',
    key: 'icon',
    sortable: 'custom',
    render: (h, params) => {
      var imgSrc = params.row.icon;
      if (!$.isEmptyObject(imgSrc)) {
        return h('img', {
          domProps: {
            style: 'height:50px;width:60px;',
            src: imgSrc
          },
          on: {
            click: () => {
              layer.photos({
                photos: {
                  //"title": "", //相册标题
                  //"id": 123, //相册id
                  //"start": 0, //初始显示的图片序号，默认0
                  "data": [ //相册包含的图片，数组格式
                    {
                      //"alt": "图片名",
                      //"pid": 666, //图片id
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
    title: '编号',
    key: 'no',
    align: 'center'
  }, {
    title: '名称',
    key: 'name',
    align: 'center'
  }, {
    title: '类型',
    key: 'typeName',
    align: 'center'
  }, {
    title: '地址',
    align: 'center',
    key: 'address',
  }, {
    title: '城中村名称',
    align: 'center',
    key: 'village',
  }, {
    title: '负责人姓名',
    key: 'chargeName',
    align: 'center'
  }, {
    title: '联系电话',
    key: 'telephone',
    align: 'center'
  }];

  //模块默认初始化方法
  function initialization() {
    params = {};
    var type = $.getParam('type');
    if (!$.isEmptyObject(type)) {
      params.type = type;
    }

    var parentId = $.getParam('parentId');
    if (!$.isEmptyObject(parentId)) {
      params.parentId = parentId;
    }



    console.log(params);
    table.initializationWithSearchParams('tableView', 'interest/place/findPage', tableColumns, ajax, params);
    initActions();
  }
  initialization();
})