define(function (require, exports, module) {
  require('utilityForm');
  //参数
  var params = {
    searchParams: {
      unit: '',
      period: '2',
      mode: ['1'],
      time: '',
      items: []
    }
  };

  /**
   * 初始化专项查询条件
   * 
   */
  function initSpecialItems() {
    params.searchParams.items = [];
    seajs.use(['../app/common/api'], function (api) {
      var subItems = api.getCriminalItems({
        searchParams: {
          dic: 'criminal'
        }
      }, function (response) {
        $("#sub_category").html('');
        $.each(response.data, function (index, data) {
          $("#sub_category").append('<option value="' + data.DIC_IDENT + '">' + data.DIC_NAME + '</option>');
        });

        //刑事案件分类
        $("#sub_category").chosen({
          disable_search_threshold: 10,
          no_results_text: "没有找到",
          width: "700px"
        }).on('change', function (evt, option) {
          if ($.isEmptyObject(option)) {
            params.searchParams.items = [];
          } else {
            //console.log(option);
            //选中
            if (!$.isEmptyObject(option.selected)) {
              if (!$.isArray(params.searchParams.items) || $.isEmptyObject(option)) {
                params.searchParams.items = [];
              }
              params.searchParams.items = $.unique($.merge(params.searchParams.items, [option.selected]));
            }
            //取消选中 
            if (!$.isEmptyObject(option.deselected)) {
              var itemIndex = $.inArray(option.deselected, params.searchParams.items);
              if (-1 != itemIndex) {
                params.searchParams.items.splice(itemIndex, 1);
              }
            }
          }
          initializationQuery(params);
        });
      });

    });
  }
  initSpecialItems();



  //初始化下拉框
  function initCategorySelect() {
    params.searchParams.category = '';
    seajs.use('../app/common/ajax', function (ajax) {
      ajax.post("dictionary/info/findCaseAffairs", [], function (response) {
        $("#category").html('');
        var result = response.data;
        $("#category").append('<option value="">请选择</option>');
        $.each(result, function (index, d) {
          $("#category").append('<option value="' + d.dicIdent + '">' + d.dicName + '</option>');
        });
        //案件专项
        $('#category').chosen({
          width: "150px",
          allow_single_deselect: true,
          no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
          disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
          search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {

          if (!$.isEmptyObject(option) && '1' == option.selected) {
            initSpecialItems();
            $("#sub_category_lable").removeAttr('style');
          } else {
            $("#sub_category").chosen("destroy").trigger("chosen:updated");
            $("#sub_category_lable").attr('style', 'display:none');
          }
          if ($.isEmptyObject(option)) {
            params.searchParams.category = null;
          } else {
            params.searchParams.category = option.selected;
          }
          params.searchParams.items = [];
          initializationQuery(params);
        });

      });
    });
  }
  initCategorySelect();


  //初始化单位下拉框
  function initDeptSelect() {
    params.searchParams.unit = '';
    seajs.use('../app/common/ajax', function (ajax) {
      ajax.post("organization/info/findOrgTree", [], function (response) {
        $("#dept").html('');
        var result = response.data;
        $.each(result, function (index, d) {

          if (d.orgKey == 1) {
            $("#dept").append('<label class="radio-inline"><input type="radio" checked name="unit" value="' + d.orgKey + '" />' + d.name + '</label>');
          } else {
            $("#dept").append('<label class="radio-inline"><input type="radio" name="unit" value="' + d.orgKey + '" />' + d.name + '</label>');
          }

        });

        //单位 绑定事件
        $("input:radio[name='unit']").click(function () {
          params.searchParams.unit = $('input:radio[name=unit]:checked').val();
          initializationQuery(params);
        });

      });
    });
  }
  initDeptSelect();



  /**
   * 根据选择周期切换不同的时间控件
   * @param {*} period 
   */
  function switchWidgets(period) {
    $("#sub_half").html('');
    $("#sub_week").html('');
    $("#sub_quarter").html('');
    for (let index = 1; index <= 5; index++) {
      if (index == period) {
        $('#_' + index).removeAttr("style");
      } else {
        $('#_' + index).attr('style', 'display:none;');
      }
    }

    if (period == 5) {
      $('#mode_basis_lable').attr('style', 'display:none');
      var basisIndex = $.inArray('3', params.searchParams.mode);
      if (-1 != basisIndex) {
        params.searchParams.mode.splice(basisIndex, 1);
      }

      $("input:checkbox[name='mode']").each(function () {
        if ($(this).attr('value') == 3) {
          $(this).attr('checked', false);
        }
      });
    } else {
      $('#mode_basis_lable').removeAttr('style');
    }
  }

  /**
   * 月控件初始化
   */
  function initMonthWidget() {
    var ins1 = laydate.render({
      elem: '#month_widget',
      type: 'month',
      theme: '#4c8fbd',
      done: function (value, date, endDate) {
        if($.isEmpty(value)){
          params.searchParams.time = '';
        }else{
          params.searchParams.time = value.split('-').join('');
        }
        
        initializationQuery(params);
      }
    });
  }

  /**
   * 半年控件初始化
   */
  function initHalfWidget() {
    var ins1 = laydate.render({
      elem: '#half_widget',
      type: 'year',
      theme: '#4c8fbd',
      done: function (value, date, endDate) {
        if($.isEmpty(value)){
          params.searchParams.time = '';
          $("#sub_half").html('');
        }else{
          params.searchParams.time = value.split('-').join('');

          
          //上半年的开始日期和结束日期
          var halfFirstStartDate = value + '01';
          var halfFirstEndDate = value + '06';

          //下半年的开始日期和结束日期
          var halfSecondStartDate = value + '07';
          var halfSecondEndDate = value + '12';

          var optionsFirst = "<option value='" + halfFirstStartDate + '-' + halfFirstEndDate + "'>上半年</option>"
          var optionsSecond = "<option value='" + halfSecondStartDate + '-' + halfSecondEndDate + "'>下半年</option>"
          $("#sub_half").html('');
          $("#sub_half").append(optionsFirst);
          $("#sub_half").append(optionsSecond);

          $("#sub_half").change(function () {
            params.searchParams.time = $("#sub_half option:selected").val();
            initializationQuery(params);
          });

          params.searchParams.time = $("#sub_half option:selected").val();
        }

        initializationQuery(params);
      }
    });
  }

  /**
   * 年控件初始化
   */
  function initYearWidget() {
    var ins1 = laydate.render({
      elem: '#year_widget',
      type: 'year',
      theme: '#4c8fbd',
      done: function (value, date, endDate) {
        if($.isEmpty(value)){
          params.searchParams.time = '';
        }else{
          params.searchParams.time = value.split('-').join('');
        }

        initializationQuery(params);
      }
    });
  }

  /**
   * 季度控件初始化
   */
  function initQuarterWidget() {
    var ins1 = laydate.render({
      elem: '#quarter_widget',
      type: 'year',
      theme: '#4c8fbd',
      done: function (value, date, endDate) {
        $("#sub_quarter").html('');

        if($.isEmpty(value)){
          params.searchParams.time = '';
        }else{
          params.searchParams.time = value.split('-').join('');

          $("#sub_quarter").append("<option value='" + value + "-01-01'>第一季度</option>");
          $("#sub_quarter").append("<option value='" + value + "-04-01'>第二季度</option>");
          $("#sub_quarter").append("<option value='" + value + "-07-01'>第三季度</option>");
          $("#sub_quarter").append("<option value='" + value + "-10-01'>第四季度</option>");
          params.searchParams.time = $("#sub_quarter option:selected").val();
          $("#sub_quarter").change(function () {
            params.searchParams.time = $("#sub_quarter option:selected").val();
            initializationQuery(params);
          });
        }

        initializationQuery(params);
      }
    });
  }

  /**
   * 每周的开始和结束日期计算
   * @param {*} yearMonth 
   */
  function calculateWeeks(yearMonth) {
    var ymd = yearMonth.substring(0, 4) + "-" + yearMonth.substring(5, 7) + "-1";
    var week = new Date(Date.parse(ymd.replace(/\-/g, "/")));
    var w = week.toString().substring(0, 3);
    var yymm = new Date(yearMonth.substring(0, 4), yearMonth.substring(5, 7), 0);
    var day = yymm.getDate();
    var dd = 1;
    switch (w) {
      case "Mon":
        dd = 0;
        break;
      case "Tue":
        dd = 1;
        break;
      case "Wed":
        dd = 2;
        break;
      case "Thu":
        dd = 3;
        break;
      case "Fri":
        dd = 4;
        break;
      case "Sat":
        dd = 5;
        break;
      case "Sun":
        dd = 6;
        break;
    }
    var aw = 5;
    if (day == 28 && dd == 0) {
      aw = 4;
    }
    var i = 1;

    var year = yearMonth.split('-')[0];
    var month = '';
    $("#sub_week").html('');
    for (var i = 0; i < aw; i++) {
      var start = i * 7 + 1 - dd;
      var end = i * 7 + 7 - dd;
      if (start < 1) {
        start = 1;
      }
      if (end > day) {
        end = day;
      }
      if (start < 10) {
        start = '0' + start;
      }
      if (end < 10) {
        end = '0' + end;
      }
      month = yearMonth.substring(5, 7);

      var str = ("第" + (i + 1) + "周 (" + month + "月" + start + "号—" + month + "月" + end + "号)").toString();
      $("#sub_week").append("<option value='" + year + month + start + "-" + year + month + end + "'>" + str + "</option>");
    }

    $("#sub_week").change(function () {
      params.searchParams.time = $("#sub_week option:selected").val();
      initializationQuery(params);
    });
  }

  /**
   * 周统计控件初始化
   */
  function initWeekWidget() {
    laydate.render({
      elem: '#week_widget',
      type: 'month',
      theme: '#4c8fbd',
      done: function (value, date, endDate) {
        $("#sub_week").html('');
        if($.isEmpty(value)){
          params.searchParams.time = '';
        }else{
          params.searchParams.time = value.split('-').join('');
          calculateWeeks(value);
  
          params.searchParams.time = $("#sub_week option:selected").val();
        }        

        initializationQuery(params);
      }
    });
  }


  // $("#sub_half").change(function () {
  //   params.searchParams.time = $("#sub_half option:selected").val();
  //   initializationQuery(params);
  // });

  // $("#sub_week").change(function () {
  //   //console.log($("#sub_week option:selected").val());
  //   params.searchParams.time = $("#sub_week option:selected").val();
  //   initializationQuery(params);
  // });




  //周期 绑定事件
  $("input:radio[name='period']").click(function () {
    $('#queryForm')[0].reset();
    params.searchParams.time = '';
    params.searchParams.period = $('input:radio[name=period]:checked').val();
    switchWidgets(params.searchParams.period);
    initializationQuery(params);
  });

  //方式 绑定事件
  $("input:checkbox[name='mode']").click(function () {
    params.searchParams.mode = $('input:checkbox[name=mode]:checked').val();
    initializationQuery(params);
  });


  /**
   * 获取选中的统计方式
   */
  function getCheckedMode() {
    var checked = [];
    //每次重新初始化
    checked.push('1');
    $('input:checkbox[name="mode"]:checked').each(function () {
      checked.push($(this).val());
    });

    return $.unique(checked);
  }

  /**
   * 统计路由跳转
   * 
   * @param {*} period 
   * @param {*} params 
   */
  function routerPage(period, params) {
    //console.log(params);
    switch (parseInt(period)) {
      case 1:
        //周统计
        seajs.use('./js/week/week', function (month) {
          month.initialization(params);
        });
        break;
      case 2:
        //月统计
        seajs.use('./js/month/month', function (month) {
          month.initialization(params);
        });
        break;
      case 3:
        //季度统计
        seajs.use('./js/quarter/quarter', function (quarter) {
          quarter.initialization(params);
        });
        break;
      case 4:
        //半年统计
        seajs.use('./js/half/half', function (half) {
          half.initialization(params);
        });
        break;
      case 5:
        //年统计
        seajs.use('./js/year/year', function (year) {
          year.initialization(params);
        });
        break;
      default:
        //月统计页面展示
        seajs.use('./js/month/month', function (month) {
          month.initialization(params);
        });
    }
  }

  /**
   * 输入参数校验与模块加载
   * 
   * @param {*} params 
   * @param {*} storeKeys 
   */
  function validate(params) {
    //没有选中统计方式
    if (0 == params.searchParams.mode.length) {
      new $.zui.Messager('请选择统计方式', {
        icon: 'bell'
      }).show();
      //console.log(params);
      return;
    }

    if (1 < params.searchParams.mode.length) {
      var index = $.inArray('1', params.searchParams.mode);
      if (-1 == index) {
        new $.zui.Messager('请选择本期', {
          icon: 'bell'
        }).show();
        return;
      }
    }

    var period = $.trim(params.searchParams.period);
    var periodArray = ['1', '2', '3', '4', '5'];
    if ($.isEmptyObject(period) || 'undefined' == period || 0 == period.length || -1 == $.inArray(period, periodArray)) {
      new $.zui.Messager('请选择正确的统计周期', {
        icon: 'bell'
      }).show();
    } else {
      routerPage(period, params);
    }
  }

  /**
   * 页面查询初始化方法
   * 
   * @param {*} params 
   */
  function initializationQuery(params) {
    params.searchParams.mode = $.unique($.merge(getCheckedMode(), params.searchParams.mode));

    validate(params);
  }

  //预览事件绑定
  $('#preview').on('click', function () {
    var allChecked = [];
    $("#export_options input:checkbox").each(function () {
      if ($(this).is(":checked")) {
        console.log($(this).attr('value'));
        allChecked.push($(this).attr('value'));
      }
    });

    if (0 == allChecked.length) {
      new $.zui.Messager('请选择要导出的项', {
        icon: 'bell'
      }).show();
    } else {
      seajs.use('./js/exports/showOptions', function (showOptions) {
        showOptions.loadPreview(params, allChecked);
      });
    }
  })

  function preview(params){
    window.exports=params;
    var index = layer.open({
      // id: 'export_preview',
      title: '导出预览',
      type: 2,
      shade: 0.8,
      //skin: 'layui-layer-lan',
      content: top.frontHttpUrl+'/scheduling/app/preview.html',
      area: ['320px', '195px'],
      maxmin: true,
      btnAlign: 'c',
      btn: ['导出', '取消'],
      yes: function (index, layero) {
        var iframeWin = window[layero.find('iframe')[0]['name']];
        iframeWin.export(params);
      },
      btn2: function () {
          console.log('取消了');
          layer.closeAll();
      }
  });
  layer.full(index);
  }

  function exportChoose() {
    var index = layer.open({
      id: 'export_preview',
      title: '导出条件选择',
      type: 2,
      shade: 0.8,
      //skin: 'layui-layer-lan',
      content: top.frontHttpUrl + '/scheduling/app/export_choose.html',
      area: ['800px', '400px'],
      maxmin: false,
      btnAlign: 'c',
      btn: ['预览', '取消'],
      yes: function (index, layero) {
        layer.close(index);
        var iframeWin = window[layero.find('iframe')[0]['name']];
        preview(iframeWin.getParams());
      },
      btn2: function () {
        layer.closeAll();
      }
    });
  }

  
  //获取预览项
  $('#previewModal').on('click', function () {

    exportChoose();

    // var period = $.trim(params.searchParams.period);
    // var periodArray = ['1', '2', '3', '4', '5'];
    // if ($.isEmptyObject(period) || 'undefined' == period || 0 == period.length || -1 == $.inArray(period, periodArray)) {
    //   new $.zui.Messager('请选择正确的统计周期', {
    //     icon: 'bell'
    //   }).show();
    //   return;
    // }

    // var showOptions = require('./exports/showOptions');

    // //动态加载到处项
    // var optionPath = showOptions.getExportOptionsPath(period);

    // seajs.use(['./js/exports/config', optionPath], function (config, optionPath) {
    //   var all = [];
    //   var tempConfig = config.getConfig();
    //   var optionsData = optionPath.getPreviewOptions(params);
    //   $.each(optionsData, function (index, data) {
    //     console.log(data);
    //     all.push({
    //       value: data,
    //       text: tempConfig[data].title
    //     });
    //   });

    //   bootbox.prompt({
    //     title: "导出数据选择",
    //     inputType: 'checkbox',
    //     size: 'small',
    //     inputOptions: all,
    //     buttons: {
    //       confirm: {
    //         label: '预览',
    //         className: 'btn-primary'
    //       },
    //       cancel: {
    //         label: '关闭',
    //         className: 'btn-default'
    //       }
    //     },
    //     callback: function (result) {
    //       console.log(result);
    //       if (null != result) {
    //         if (0 == result.length) {
    //           new $.zui.Messager('请选择要导出的项', {
    //             icon: 'bell'
    //           }).show();
    //         } else {
    //           showOptions.loadPreview(params, result);
    //         }
    //       }

    //     }
    //   });
    // });

  })

  $('#pager').find('li a').on('click', function () {
    $('#show_img').attr('src', './js/heat/' + $(this).attr('data-page') + 'quyu.jpg');
  });

  //初始化专项子类
  //initSpecialItems();

  //自定义时间控件初始化
  initWeekWidget();
  initMonthWidget();
  initYearWidget();
  initHalfWidget();
  initQuarterWidget();

  //初始化查询方法
  initializationQuery(params);
})