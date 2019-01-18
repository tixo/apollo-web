define(["utilityForm"], function (require, exports, module) {
  //参数
  var params = {
    searchParams: {
      unit: '1',
      period: '2',
      mode: ['1'],
      time: '',
      items: []
    }
  };

  //初始化下拉框
  function initCategorySelect() {
    params.searchParams.category = '';
    seajs.use('../app/common/ajax', function (ajax) {
      ajax.post("dictionary/info/findCaseAffairs", [], function (response) {
        $("#category").html('');

        var result = response.data;
        $.each(result, function (index, d) {
          if(0==index){
            params.searchParams.category = d.dicIdent;
            $("#category").append('<option value="' + d.dicIdent + '">' + d.dicName + '</option>');
          }else{
            $("#category").append('<option value="' + d.dicIdent + '">' + d.dicName + '</option>');
          }
        });

        $("#category").trigger("chosen:updated");
      });
    });
  }

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

        $("#sub_category").trigger("chosen:updated");
      });

    });
  }

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
      if (1 == period) {
        initWeekWidget(new Date().pattern("yyyy-MM"));
      }
      if (2 == period) {
        initMonthWidget();
      }

      if (3 == period) {
        initQuarterWidget(new Date().pattern("yyyy"));
      }
      if (4 == period) {
        initHalfWidget(new Date().pattern("yyyy"));
      }
      if (5 == period) {
        initYearWidget();
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

    params.searchParams.category = null;
    params.searchParams.items = [];
    $("input:radio[name='issue'][value='1']").prop("checked", "checked");

    // 月度专刊
    if (2 == period) {
      $('#issueShow').removeAttr('style');
    } else {
      $('#criminalItems').attr('style', 'display:none');
      $('#subCriminal').attr('style', 'display:none');
      $('#issueShow').attr('style', 'display:none');
    }
  }

  Date.prototype.pattern = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份         
      "d+": this.getDate(), //日         
      "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
      "H+": this.getHours(), //小时         
      "m+": this.getMinutes(), //分         
      "s+": this.getSeconds(), //秒         
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
      "S": this.getMilliseconds() //毫秒         
    };
    var week = {
      "0": "/u65e5",
      "1": "/u4e00",
      "2": "/u4e8c",
      "3": "/u4e09",
      "4": "/u56db",
      "5": "/u4e94",
      "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  /**
   * 月控件初始化
   */
  function initMonthWidget() {
    var ins1 = laydate.render({
      elem: '#month_widget',
      type: 'month',
      theme: '#4c8fbd',
      value: new Date(),
      done: function (value, date, endDate) {
        params.searchParams.time = value.split('-').join('');
      }
    });
    var month = new Date().pattern("yyyyMM");
    params.searchParams.time = month;
  }

  /**
   * 半年控件初始化
   */
  function initHalfWidget() {
    var ins1 = laydate.render({
      elem: '#half_widget',
      type: 'year',
      theme: '#4c8fbd',
      value: new Date(),
      done: function (value, date, endDate) {
        initHalfSel(value);
      }
    });
    initHalfSel(new Date().pattern("yyyy"));
  }

  function initHalfSel(value) {
    params.searchParams.time = value.split('-').join('');
    //上半年的开始日期和结束日期
    var halfFirstStartDate = value + '01';
    var halfFirstEndDate = value + '06';

    var day = new Date(value, month, 0).getDate();
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
      params.searchParams.title = $("#sub_half option:selected").text();
    });

    params.searchParams.time = $("#sub_half option:selected").val();
    params.searchParams.title = $("#sub_half option:selected").text();
    params.searchParams.half = $("#sub_half option:selected").text();
    params.searchParams.year = value;
  }
  /**
   * 年控件初始化
   */
  function initYearWidget() {
    var ins1 = laydate.render({
      elem: '#year_widget',
      type: 'year',
      theme: '#4c8fbd',
      value: new Date(),
      done: function (value, date, endDate) {
        params.searchParams.time = value.split('-').join('');
      }
    });
    params.searchParams.time = new Date().pattern("yyyy");
  }

  /**
   * 季度控件初始化
   */
  function initQuarterWidget() {
    var ins1 = laydate.render({
      elem: '#quarter_widget',
      type: 'year',
      theme: '#4c8fbd',
      value: new Date(),
      done: function (value, date, endDate) {
        initQuarterSel(value);
      }
    });
    initQuarterSel(new Date().pattern("yyyy"));
  }

  function initQuarterSel(value) {
    console.log(value);
    $("#sub_quarter").html('');
    $("#sub_quarter").append("<option value='" + value + "-01-01'>第一季度</option>");
    $("#sub_quarter").append("<option value='" + value + "-04-01'>第二季度</option>");
    $("#sub_quarter").append("<option value='" + value + "-07-01'>第三季度</option>");
    $("#sub_quarter").append("<option value='" + value + "-10-01'>第四季度</option>");
    params.searchParams.time = $("#sub_quarter option:selected").val();
    params.searchParams.title = $("#sub_quarter option:selected").text();
    params.searchParams.year = value;
    $("#sub_quarter").change(function () {
      params.searchParams.time = $("#sub_quarter option:selected").val();
      params.searchParams.title = $("#sub_quarter option:selected").text();
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
      params.searchParams.title = $("#sub_week option:selected").text();
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
      value: new Date(),
      done: function (value, date, endDate) {
        initWeekSel(value);
      }
    });
    initWeekSel(new Date().pattern("yyyy-MM"));
  }

  function initWeekSel(value) {
    var ym = value.split('-');
    params.searchParams.time = ym.join('');
    calculateWeeks(value);

    params.searchParams.time = $("#sub_week option:selected").val();
    params.searchParams.title = $("#sub_week option:selected").text();
    params.searchParams.year = ym[0] + '年' + ym[1] + '月';
  }

  var unitMap = {};
  //初始化单位下拉框
  function initDeptSelect() {
    // params.searchParams.unit = '';
    seajs.use('../app/common/ajax', function (ajax) {
      ajax.post("organization/info/findOrgTree", [], function (response) {
        $("#dept").html('');
        var result = response.data;
        $.each(result, function (index, d) {
          unitMap[d.orgKey] = d.name;
          if (d.orgKey == 1) {
            $("#dept").append('<label class="radio-inline"><input type="radio" checked name="unit" value="' + d.orgKey + '" />' + d.name + '</label>');
          } else {
            $("#dept").append('<label class="radio-inline"><input type="radio" name="unit" value="' + d.orgKey + '" />' + d.name + '</label>');
          }

        });

        //单位 绑定事件
        $("input:radio[name='unit']").click(function () {
          params.searchParams.unit = $('input:radio[name=unit]:checked').val();
          params.searchParams.unitName = unitMap[params.searchParams.unit];
        });

      });
    });
  }

  $("input:radio[name='period']").click(function () {
    //$('#exportForm')[0].reset();
    params.searchParams.time = '';
    params.searchParams.period = $(this).val();
    switchWidgets(params.searchParams.period);
  });

  $("input:radio[name='issue']").click(function () {
    if ($(this).attr('value') == 2) {
      $('#criminalItems').removeAttr('style');
      $('#issueShow').removeAttr('style');

      initCategorySelect();
    } else {
      $('#criminalItems').attr('style', 'display:none');
      $('#subCriminal').attr('style', 'display:none');
      //$('#issueShow').attr('style', 'display:none');
    }
    params.searchParams.issue = $(this).attr('value');
  });

  initDeptSelect();

  // initWeekWidget();
  initMonthWidget();
  // initYearWidget();
  // initHalfWidget();
  // initQuarterWidget();

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
      $("#subCriminal").removeAttr('style');
    } else {
      // $("#sub_category").chosen("destroy").trigger("chosen:updated");
      $("#subCriminal").attr('style', 'display:none');
    }
    if ($.isEmptyObject(option)) {
      params.searchParams.category = null;
    } else {
      params.searchParams.category = option.selected;
    }
    params.searchParams.items = [];
  });

  //刑事案件分类
  $("#sub_category").chosen({
    disable_search_threshold: 10,
    no_results_text: "没有找到",
    width: "500px"
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
  });

  window.getParams = function () {
    params.searchParams = $.extend({}, params.searchParams);
    return params;
  }
})