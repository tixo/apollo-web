define(['validate', 'validation', 'localization','utilityForm'], function (require, exports, module) {
    require('utilityForm');
    var ajax = require('../app/common/ajax');
    var pager = require('../dist/lib/pager/index');
    exports.initValidation = function () {
        $('#pageClose').on('click', function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#surveillanceForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                name: {
                    required: true,
                    maxlength: 512
                },
                type: {
                    required: true
                },
                source: {
                    required: true
                },
                startTime: {
                    required: true
                },
                endTime: {
                    required: true
                },
                treshold: {
                    required: true,
                    number: true,
                    max: 1,
                    min: 0.01,
                    minNumber: $("#treshold").val()
                }
            },
            messages: {
                name: {
                    required: "任务名称不能为空！"
                },
                startTime: {
                    required: "开始时间不能为空！"
                },
                endTime: {
                    required: "结束时间不能为空！"
                },
                treshold: {
                    required: "比对阈值不能为空！",
                    number: "只能输入小于或者等于1的数字",
                    minNumber: "输入数字最多小数点后两位"
                }
            }
        });

        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/trajectory/info/local/upload',
            limitFilesCount: false,
            headers: top.authorization,
            filters: {
                // 只允许上传图片
                mime_types: [{
                    title: '图片',
                    extensions: 'jpg'
                }],
                // 最大上传文件为 10MB
                max_file_size: '10mb',
                // 不允许上传重复文件
                prevent_duplicates: false
            },
            deleteActionOnDone: function (file, doRemoveFile) {
                doRemoveFile();
            },

            responseHandler: function (responseObject, file) {
                var response = JSON.parse(responseObject.response);
                console.log(response);
                // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
                if (1 == response.code) {
                    this.removeFile(file);
                    //$('#populationId').val(response.data.populationId);
                    exports.getBackFaceImg("", response.data.httpUrl, response.data.filePath, response.data.populationId);
                } else {
                    return response.message;
                }
            }
        });

        //点击确定生成车牌号图片
        $("#getCarNoImg").on('click', function () {
            var val = $("#carNo").val();
            var id = "";
            exports.createCarImg(id, val);
            $("#carNo").val("");
        });
    }

    //封装图片参数到params中
    exports.getParams = function (params) {
        if ('capture' == params.source) {
            params.params=JSON.stringify(imgs); 
        }
        if ('local' == params.source) {
            var face = $("#faceDiv").find("img");
            var car = $("#carImgDiv").find("span");
            var target = [];
            for (var i = 0; i < face.length; i++) {
                
                if ($(face[i]).attr("id") != "" && $(face[i]).attr("id") != undefined) {
                    // target = {
                    //     id: $(face[i]).attr("id"),
                    //     targetType: 'face',
                    //     targetFilePath: $(face[i]).attr("name"),
                    //     populationId: $(face[i]).attr("populationId")
                    // };
                    target.push($(face[i]).attr("name"));
                } else {
                    // target = {
                    //     targetType: 'face',
                    //     targetFilePath: $(face[i]).attr("name"),
                    //     populationId: $(face[i]).attr("populationId")
                    // };
                    target.push($(face[i]).attr("name"));
                }                    
            }
            params.params=JSON.stringify(target); 
        }
        params.cameras=JSON.stringify(window.cameraIds);

        return params;
        // for (var i = 0; i < car.length; i++) {
        //     var target;
        //     if ($(car[i]).attr("id") != "" && $(car[i]).attr("id") != undefined) {
        //         target = {
        //             id: $(car[i]).attr("id"),
        //             targetType: 'car',
        //             targetFilePath: $(car[i]).html()
        //         }
        //     } else {
        //         target = {
        //             targetType: 'car',
        //             targetFilePath: $(car[i]).html()
        //         }
        //     }
        //     params.target.push(target);
        // }
    }

    //生成车牌号图片
    exports.createCarImg = function (id, text) {
        if (text !== "") {
            if (isCarNo(text)) {
                var dom = document.getElementById("carImgDiv");
                var carNoDiv = document.createElement("div");
                carNoDiv.className = "carNoDiv";
                var i = document.createElement("i");
                i.className = "icon icon-remove-circle";
                i.style = "position : relative;color:#fc3232;margin-top:-5px;float:right";
                var carNo = document.createElement("div");
                carNo.className = "rectangle";
                var span = document.createElement("span");
                span.id = id;
                span.textContent = text;
                carNo.appendChild(span);
                carNoDiv.appendChild(i);
                carNoDiv.appendChild(carNo);
                dom.appendChild(carNoDiv);
            } else {
                $.showErrorInfo('请输入正确的车牌号码');
            }

        }
    }
    //回显人脸照片
    exports.getBackFaceImg = function (id, httpUrl, filePath, populationId) {
        var dom = document.getElementById("faceDiv");
        var faceDiv = document.createElement("div");
        faceDiv.className = "faceImgDiv";
        var i = document.createElement("i");
        i.className = "icon icon-remove-circle";
        i.style = "position : relative;color:#fc3232;margin-top:-5px;float:right";
        var face = document.createElement("div");
        face.className = "imgDiv";
        var img = document.createElement("img");
        img.id = id;
        img.className = "img";
        img.src = httpUrl + filePath;
        img.name = httpUrl + '|' +filePath;
        $(img).attr('populationId', populationId);
        console.log(img.populationId);
        face.appendChild(img);
        faceDiv.appendChild(i);
        faceDiv.appendChild(face);
        dom.appendChild(faceDiv);
    }

    //给关闭图标绑定移除图片事件
    $(document).on("click", "i[class='icon icon-remove-circle']", deleteTarget);

    function deleteTarget() {
        $(this).parent("div").remove();
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

    function isCarNo(value) {
        var reg = RegExp(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/);
        return reg.test(value);
    }

    function initSourceSel(){
        
        $('#source').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            if ('capture' == option.selected) {
                $("#localFace").attr('style','display:none;');
                $("#capturelFace").removeAttr("style");

                if($("#surveillanceForm").valid()){
                    var params = $.formToJson($("#surveillanceForm").serialize());
                    window.params=params;
                    initCaptureSel();
                };
            }
            if ('local' == option.selected) {
                $("#capturelFace").attr('style','display:none;');
                $("#localFace").removeAttr("style");
            }
        });
    }

    function initCaptureSel(){
        //弹出即全屏
        var index = layer.open({
            type: 2,
            content: './index.html',
            area: ['320px', '195px'],
            maxmin: true,
            closeBtn: 2,
            btnAlign: 'c',
            btn: ['确定', '取消'],
            yes: function (index, layero) {
              var iframeWin = window[layero.find('iframe')[0]['name']];
              var capture = iframeWin.getSelections();
              console.log(capture);
              if(0 == capture.length){
                layer.closeAll();
                $.showErrorInfo('未选择抓拍图片');
              }else{
                addSelection(iframeWin.getSelections());
                layer.closeAll();
              }
            },
            btn2: function () {
                layer.closeAll();
            }
          });
          layer.full(index);
    }

    function initCameraSel(){
        $("#mapSelect").on("click", function () {
            //弹出即全屏
            var index = layer.open({
              type: 2,
              content: './mapselect.html',
              area: ['320px', '195px'],
              maxmin: true,
              closeBtn: 2,
              btnAlign: 'c',
              btn: ['关闭'],
              yes: function (index, layero) {
        
                layer.closeAll();
              }
            });
            layer.full(index);
        });
    }

    var selectedTemplate = '<div class="grid border" id="{{id}}">' +
    '<img src="./close_pop.png"  class="closeimg" alt="删除"  />' +
    '<div class="imgholder">' +
    '<img id="{{id}}}" src="{{src}}}" capid="{{capid}}"/>' +
    '</div>' +
    '</div>';

    var imgs = [];
    function addSelection(result) {
        imgs = [];
        var template = Handlebars.compile(selectedTemplate);
        $.each(result,function(index,data){
            $('#econtainer').append(template({
                id: data.capId,
                src: data.src,
                capid: data.capId
            }));
            imgs.push(data.capId+'|'+data.capturetime+'|'+data.src);
        });
    
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

      function initType() {
        // $("#propertyName").val(data[0].DIC_NAME);
        // $.each(data, function (index, d) {
        //     $("#property").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        // });
        $('#type').chosen({
            allow_single_deselect: true, 
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            // console.log()
            if ('car' == option.selected) {
                // top.location.href='http://10.100.0.60/integratedQueryAction!goBayonetQuery.action';
                top.window.open('http://10.100.0.60/integratedQueryAction!goBayonetQuery.action');
            }
        });
    }

    initLaydate('startTime', 'endTime', 'datetime', 'yyyy-MM-dd HH:mm:ss');
    initSourceSel();
    initCameraSel();
    initType();
    window.cameraIds=[];
})