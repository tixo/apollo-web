define(function (require, exports, module) {
  var selectedImage = [];
  var faceLocalData = [];
  require('utilityForm');
  require('validation');
  require('validate');
  require('localization');

  var ajax = require('../app/common/ajax');
  var pager = require('../dist/lib/pager/index');

          //表单验证
  $("#queryForm").validate({
    debug: false, //调试模式，即使验证成功也不会跳转到目标页面
    focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
    onkeyup: false,
    errorClass: "alert alert-danger",
    rules: {
        startTime: {
            required: true
        },
        endTime: {
            required: true
        }
    },
    messages: {
        startTime: {
            required: "开始时间不能为空！"
        },
        endTime: {
            required: "结束时间不能为空！"
        }
    }
  });

  var selectedTemplate = '<div class="grid border" id="{{id}}" sindex="{{index}}" capturetime="{{capturetime}}">' +
    '<img src="./close_pop.png"  class="closeimg" alt="删除"  />' +
    '<div class="imgholder">' +
    '<img id="{{id}}}" src="{{src}}}" capid="{{capid}}"/>' +
    '</div>' +
    '</div>';
  var ajax = require('../app/common/ajax');
  var pager = require('../dist/lib/pager/index');


  window.getSelections = function () {
    var selected = [];

    $("#econtainer").children('div').each(function () {
      selected.push({
        src: $(this).find('div img').attr('src'),
        capId: $(this).find('div img').attr('capid'),
        capturetime: $(this).attr('capturetime')

      });
    });
    
    return selected;
  }

  
  function afterPageLoad() {
    $('[data-toggle="lightbox"]').lightbox();
  }

  function initialization(){
    seajs.use(['../app/common/ajax','../dist/lib/pager/index'], function (ajax,pager) {
      console.log(pager);
    });
    
    pager.show('tableView', 'trajectory/info/capture/findPage', ajax, function (rowData) {
      if ($.isEmptyObject(rowData)) {
        $('#imageList').find('ul').html('搜索结果不存在');
        return;
      }
      $('#imageList').find('ul').html('');
      $.each(rowData, function (index, data) {

        var aHtml = document.createElement("a");
        var img = document.createElement("img");
        img.id = data.cid;
        img.src = data.src;
        $(img).attr('cid', data.cid);
        $(img).attr('capid', data.capid);
        $(img).attr('capturetime', data.capturetime);
        $(img).attr('cameraid', data.cameraid);
        $(aHtml).attr('data-toggle', "lightbox");
        $(aHtml).attr('href', data.src);
        $(aHtml).attr('data-group', "group1");
        $(aHtml).attr('data-lightbox-group', "group1");
        // $(aHtml).attr('data-caption', data.src);
        // $(aHtml).attr('class', "img-thumbnail");


        aHtml.appendChild(img);
        $('#imageList').find('ul').append(aHtml);

        // $(aHtml).on('click', function () {
        //   if (!$(this).hasClass('selected')) {
        //     $(this).addClass('selected');
        //     addSelection($(this).find('img').attr('id'), $(this).find('img').attr('src'), data.id, data.capturetime, data.capid);
        //   } else {
        //     $(this).removeClass('selected');
        //     removeSelection($(this).find('img').attr('id'));
        //   }
        // })
      });

      afterPageLoad();
    });
  }

  //模块默认初始化方法
  function search() {
    // seajs.use(['../app/common/ajax','../dist/lib/pager/index'], function (ajax,pager) {

  
      pager.query($.formToJson($("#queryForm").serialize()));
    // });

  }

  function addSelection(id, src, index, capturetime, capid) {
    console.log(id);
    var template = Handlebars.compile(selectedTemplate);
    $('#econtainer').append(template({
      id: id,
      src: src,
      index: index,
      capid: capid,
      capturetime: capturetime
    }));

    $('#econtainer').children('div').each(function (index) {
      $(this).on('click', function () {
        var clickId = $(this).attr('id');
        removeSelection(clickId);
        $('#imageList ul').children('a').each(function () {
          var sThis = $(this);
          var sId = sThis.find('img').attr('id');
          if (clickId == sId) {
            sThis.removeClass('selected');
          }
        });
      });
    });
  }



  function removeSelection(id) {
    $('#econtainer').children('div').each(function (index) {
      if ($(this).attr('id') == id) {
        $(this).remove();
      }
    });
  }

        /**
     * 时间控件初始化
     */
    function initLaydate(startTime, endTime, type, format) {
      var start = {
          elem: '#' + startTime,
          show: true,
          closeStop: '#' + startTime,
          type: type,
          format: format
      };
      var end = {
          elem: '#' + endTime,
          show: true,
          closeStop: '#' + endTime,
          type: type,
          format: format
      };
      lay('#' + startTime).on('click', function (e) {
          if ($('#' + endTime).val() != null && $('#' + endTime).val() != undefined && $('#' + endTime).val() != '') {
              start.max = $('#' + endTime).val();
          }
          laydate.render(start);
      });
      lay('#' + endTime).on('click', function (e) {
          if ($('#' + startTime).val() != null && $('#' + startTime).val() != undefined && $('#' + startTime).val() != '') {
              end.min = $('#' + startTime).val();
          }
          laydate.render(end);
      });
  }

  initLaydate('startTime', 'endTime', 'datetime', 'yyyy-MM-dd HH:mm:ss');
  initialization();
  // item selection
  // $('#imageList').find('ul a').each(function (index) {
  //   $(this).on('click', function () {
  //     if (!$(this).hasClass('selected')) {
  //       $(this).addClass('selected');
  //       addSelection($(this).find('img').attr('id'), $(this).find('img').attr('src'), index, $(this).find('img').attr('capturetime'), $(this).find('img').attr('capid'));
  //     } else {
  //       $(this).removeClass('selected');
  //       removeSelection($(this).find('img').attr('id'));
  //     }
  //   })
  // });

  $('#surveillanceQuery').on('click', function () {
    if($("#queryForm").valid()){
      search();
    };
    
  });
})

