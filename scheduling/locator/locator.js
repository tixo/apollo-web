define(function (require, exports, module) {
    require('utilityForm');
    var ajax = require('../app/common/ajax');
    var table = require('../dist/lib/table/index');

    function search() {
        table.query({
            no: $.trim($('#no').val()),
            isBind: $.trim($('#isBind').val())
        });
    }

    function initSearch() {
        //查询事件绑定
        $('#policeQuery').on('click', function () {
            search();
        });
    }

    //添加车辆和北斗定位终端绑定关系
        function initBind() {
            $('#bind').on('click', function () {
                var tempData = [];
                var selects = table.getCurrentRow();
                
                if (!$.isEmptyObject(selects)) {
                    if(selects.isBind == 1){
                        $.showErrorInfo('该设备已经被绑定,请先解除与车辆绑定关系');
                    }else{
                        $.goTo('./form.html?id=' + selects.id);
                    }
                } else {
                    $.showErrorInfo('请选择要绑定的北斗定位终端');
                }
            });
        }
    

    //解除车辆和北斗定位终端绑定关系
    function initUnBind() {
        $('#unBind').on('click', function () {
            var tempData = {};
            var selects = table.getCurrentRow();

            if (!$.isEmptyObject(selects)) {
                if (selects.isBind == 0) {
                    $.showErrorInfo('该设备没有被绑定,请与车辆绑定');
                } else {
                    console.log(selects);
                    tempData.deviceId = selects.id;
                    tempData.deviceImei = selects.imei;
                    tempData.deviceNo = selects.no;
                    tempData.policeCarId = selects.car.id;
                    tempData.department = selects.car.department;
                    tempData.type = selects.car.type;
                    tempData.policeCarNo = selects.car.no;
                    $.showConfirmInfo('解除绑定', '确定要解除与车辆绑定关系?', function () {
                        ajax.post('locator/bind/retrieve', tempData, function (response) {
                            var result = response.data;
                            if (result.code <= 0) {
                                $.showErrorInfo(result.message);
                            } else {
                                search();
                            }
                        });
                        return false;
                    }, 'unlock-alt');
                }
            } else {
                $.showErrorInfo('请选择要解除绑定的北斗定位终端');
            }
        });
    }


    //恢复默认查询
    function initRefresh() {
        $('#refresh').click(function () {
            console.log('ww');
            $('#queryForm')[0].reset();
            search();
        });
    }

    function initActions() {
        initSearch();
        initBind();
        initUnBind();
        initRefresh();
    }

  var tableColumns = [{
      title: '设备编号',
      key: 'no',
      sortable: 'custom',
      filterFill: 'auto',
      filters: []
  }, {
      title: '品牌',
      key: 'vender',
      sortable: 'custom',
      filterFill: 'auto',
      filters: []
  }, {
      title: '型号',
      key: 'model',
      sortable: 'custom'
  }, {
      title: '主要参数',
      key: 'imei',
      sortable: 'custom'
  }, {
      title: '绑定状态',
      key: 'isbind',
      sortable: 'custom',
      render: (h, params) => {
          var target = params.row.isBind;
          if (0 == target) {
              return '未绑定';
          }
          return h('a', {
              props: {
                  type: 'primary'
              },
              on: {
                //   mouseenter: () => {
                //       var tt =
                //           '<div class="checkbox">' +
                //           ' <label>' +
                //           '车牌号：' + params.row.car.no +
                //           '</label>' +
                //           '</div>' +
                //           '<div class="checkbox">' +
                //           ' <label>' +
                //           '车型：' + params.row.car.type +
                //           '</label>' +
                //           '</div>' +
                //           '<div class="checkbox">' +
                //           ' <label>' +
                //           '部门：' + params.row.car.department +
                //           '</label>' +
                //           '</div>';
                //       layer.closeAll();
                //       layer.open({
                //           id: 'export_preview',
                //           title: false,
                //           type: 1,
                //           shadeClose: true,
                //           shade: [0.1, '#fff'], //0.1透明度的白色背景
                //           scrollbar: false,
                //           mode: 0,
                //           content: html_encode(tt),
                //           area: ['200px', '160px'],
                //           btnAlign: 'c',
                //           btn: ['解除', '关闭'],
                //           yes: function (index, layero) {
                //             initUnBind();
                //             layer.closeAll();
                //           }
                //       });
                //   }
              }
          }, params.row.car.no);
      }
  }];

  function unBind(str) {

  }
  
  function html_encode(str) {
      var s = "";
      if (str.length == 0) return "";
      s = str.replace(/&/g, ">");
      s = s.replace(/</g, "<");
      s = s.replace(/>/g, ">");
      s = s.replace(/ /g, " ");
      s = s.replace(/\'/g, "'");
      s = s.replace(/\"/g, "\"");
      s = s.replace(/\n/g, "<br>");
      return s;
  }
  
  //模块默认初始化方法
  function initialization() {
      table.initialization('tableView', 'locator/bind/findPage', tableColumns, ajax, {
        showCheckbox: false,
        highlightRow: true
      });
      initActions();
  }
  initialization();
})