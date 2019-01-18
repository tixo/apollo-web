define(function (require, exports, module) {
  var selectedImage = [];
  var faceLocalData = [];
  require('utilityForm');
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

  function getLocalData() {
    var dataIndex = [];
    var mapIndex = {};
    var result = [];
    $('#localSelectedList').children('div').each(function (index) {
      var outDiv = $(this).children('div');
      outDiv.eq(1).find('ul a').each(function (sIndex) {
        if ($(this).hasClass('selected')) {
          dataIndex.push(sIndex);
        }
      });
      console.log(dataIndex);
      if (!$.isEmptyObject(dataIndex)) {
        var selectedData = [];
        var faceData = $.extend({}, faceLocalData[index]);
        var tempCompare = faceData.compare;
        console.log(faceLocalData);
        $.each(dataIndex, function (lIndex, data) {
          selectedData.push(tempCompare[data]);
        });
        // faceData.compare=selectedData;
        result.push({
          id: faceData.id,
          src: faceData.url,
          compare: selectedData
        });
      }
    });
    return result;
    console.log(result);
  }

  $('#query').on('click', function () {
    // console.log(decodeURIComponent("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a\r\nHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy\r\nMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAC4AJUDASIA\r\nAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA\r\nAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3\r\nODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm\r\np6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA\r\nAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx\r\nBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK\r\nU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3\r\nuLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCrmlzT\r\nc0Zr2TyRc0opvWnCkwFC0bacKcBxSuOxCeKjuF327r+NTSDHcCq8tzDAP3siqD61M9VYqOjMkEFD\r\ntlKPjjb1ql596JcCbcn+2OtV7i5geaWRCwUEhRmqC3cm/CtIE+vSvLkrM9JSujbBKDO4HPXFJ5gP\r\nesxZivRmIPqacLk5AKnB71DTKTRu2drNcrIYrczqOuDgrWgrapGioNOYADAFc9o2tPpXiIy/M8DR\r\n7JEB6+9ei2OtWWonEUmHP8L8Gu7DxVjirt3Oc83Uerac9L513/Fp8o+grsuelLg118pys483cwjY\r\nfYZ844ytM8OxXEWsrI8LqkispODXYucIxPpToFEduDjBxmk4sFoeXa5FZ2msXCyh9zNnrjiitLX9\r\n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\r\nKKAEooooA//Z"));
    var queryParams = $.formToJson($("#queryForm").serialize());
    console.log(queryParams);
    //人脸
    if ('face' == queryParams.type) {
      //抓拍库分页查询
      if ('capture' == queryParams.source) {
        pager.query(queryParams);
      }
      if ('local' == queryParams.source) {
        if ($.isEmptyObject(faceLocalData)) {
          $.showErrorInfo('请上传需要比对的照片');
        } else {
          var ids = [];
          $.each(faceLocalData, function (index, data) {
            ids.push(data.filePath);
          });

          queryParams.imgIDs = ids.join(';');
          seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('face/capture/comparison', {
              searchParams: queryParams
            }, function (response) {
              var result = response.data;
              if (result.code == 0) {
                new $.zui.Messager(result.message, {
                  type: 'danger',
                  icon: 'bell' // 定义消息图标
                }).show();
              } else {
                // 上图数据初始化
                mapDrawData = result.data;

                var target = [];
                $.each(faceLocalData, function (index, data) {
                  var tempData = mapDrawData[data.filePath];
                  if (!$.isEmptyObject(tempData)) {
                    $.each(tempData, function (sIndex, cData) {
                      cData.score = eval(cData.score * 100).toFixed(0) + '%';
                    });
                    faceLocalData[index] = $.extend({}, faceLocalData[index], {
                      id: data.filePath,
                      url: data.httpUrl + data.filePath,
                      compare: tempData
                    });
                  }
                  var result = {
                    id: data.filePath,
                    url: data.httpUrl + data.filePath,
                    compare: tempData
                  };
                  target.push(result);
                });

                console.log(faceLocalData);
                var template = Handlebars.compile(require('./local_face.html'));
                $('#localSelectedList').html(template(target));

                $('#localSelectedList').children('div').children('div:eq(1)').find('ul a').each(function (index) {
                  $(this).on('click', function () {
                    if (!$(this).hasClass('selected')) {
                      $(this).addClass('selected');
                      // addSelection($(this).find('img').attr('id'), $(this).find('img').attr('src'), index, $(this).find('img').attr('capid'));
                    } else {
                      $(this).removeClass('selected');
                      // removeSelection($(this).find('img').attr('id'));
                    }
                  })
                });


              }
            });
          });
        }
      }
    }
  });

  //模块默认初始化方法
  function initialization() {

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
        aHtml.appendChild(img);
        $('#imageList').find('ul').append(aHtml);

        $(aHtml).on('click', function () {
          if (!$(this).hasClass('selected')) {
            $(this).addClass('selected');
            addSelection($(this).find('img').attr('id'), $(this).find('img').attr('src'), data.id, data.capturetime, data.capid);
          } else {
            $(this).removeClass('selected');
            removeSelection($(this).find('img').attr('id'));
          }
        })
      });
    });

    console.log(parent.window.params);
    pager.query(parent.window.params);
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

  initialization();
  // item selection
  $('#imageList').find('ul a').each(function (index) {
    $(this).on('click', function () {
      if (!$(this).hasClass('selected')) {
        $(this).addClass('selected');
        addSelection($(this).find('img').attr('id'), $(this).find('img').attr('src'), index, $(this).find('img').attr('capturetime'), $(this).find('img').attr('capid'));
      } else {
        $(this).removeClass('selected');
        removeSelection($(this).find('img').attr('id'));
      }
    })
  });

})