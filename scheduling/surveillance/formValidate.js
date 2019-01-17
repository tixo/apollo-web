define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    exports.initValidation = function () {
        $('#pageClose').on('click',function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#surveillanceForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                title: {
                    required: true,
                    maxlength: 64
                },
                reason: {
                    required: true,
                    maxlength: 256
                },
                beginTime: {
                    required: true,
                    maxlength: 64
                },
                endTime: {
                    required: true,
                    maxlength: 64
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
                title: {
                    required: "任务名称不能为空！"
                },
                beginTime: {
                    required: "开始时间不能为空！"
                },
                endTime: {
                    required: "结束时间不能为空！"
                },
                reason: {
                    required: "布控原因不能为空！"
                },
                treshold: {
                    required: "比对阈值不能为空！",
                    number: "只能输入小于或者等于1的数字",
                    minNumber: "输入数字最多小数点后两位"
                }
            }
        });

        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/surveillance/info/upload',
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
                    exports.getBackFaceImg("",response.data.httpUrl,response.data.filePath,response.data.populationId);
                } else {
                    return response.message;
                }
            }
        });

        //点击确定生成车牌号图片
        $("#getCarNoImg").on('click',function(){
            var val = $("#carNo").val();
            var id = "";
            exports.createCarImg(id,val);
            $("#carNo").val("");
        });

        $('#category').chosen({
            allow_single_deselect: true, 
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            // console.log()
            if ('car' == option.selected) {
                // top.location.href='http://10.100.0.60/dispositionIndex!gotoIndexPage.action';
                top.window.open('http://10.100.0.60/dispositionIndex!gotoIndexPage.action');
            }
        });
    }

    //封装图片参数到params中
    exports.getParams = function(params){
        params.target = [];
        var face =  $("#faceDiv").find("img");
        var car = $("#carImgDiv").find("span");
        for(var i = 0; i < face.length ; i++){
            var target;
            if($(face[i]).attr("id") !="" && $(face[i]).attr("id") !=undefined){
                target = {
                    id:$(face[i]).attr("id"),
                    targetType:'face',
                    targetFilePath:$(face[i]).attr("name"),
                    populationId:$(face[i]).attr("populationId")
                }
            }else{
                target = {
                    targetType:'face',
                    targetFilePath:$(face[i]).attr("name"),
                    populationId:$(face[i]).attr("populationId")
                }
            }
            params.target.push(target);
        }
        for(var i = 0; i < car.length ; i++){
            var target;
            if($(car[i]).attr("id") !="" && $(car[i]).attr("id") !=undefined){
                target = {
                    id:$(car[i]).attr("id"),
                    targetType:'car',
                    targetFilePath:$(car[i]).html()
                }
            }else{
                target = {
                    targetType:'car',
                    targetFilePath:$(car[i]).html()
                }
            }
            params.target.push(target);
        }
    }

    //生成车牌号图片
    exports.createCarImg = function (id,text){
        if(text !==""){
            if(isCarNo(text)){
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
            }else{
                $.showErrorInfo('请输入正确的车牌号码');
            }
            
        }
    }
    //回显人脸照片
    exports.getBackFaceImg = function (id,httpUrl,filePath,populationId){
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
        img.src = httpUrl+filePath;
        img.name = filePath;
        $(img).attr('populationId',populationId);
        console.log(img.populationId);
        face.appendChild(img);
        faceDiv.appendChild(i);
        faceDiv.appendChild(face);
        dom.appendChild(faceDiv);
    }

    //给关闭图标绑定移除图片事件
	$(document).on("click","i[class='icon icon-remove-circle']",deleteTarget);
    function deleteTarget(){
        $(this).parent("div").remove();
    }

    /**
   * 时间控件初始化
   */
  function initLaydate(startTime,endTime,type,format){
    var start = {  
        elem: '#'+startTime,  
        show: true,  
        closeStop: '#'+startTime ,
        type: type,
        format: format
    };  
    var end = {  
        elem: '#'+endTime,  
        show: true,  
        closeStop: '#'+endTime,
        type: type,
        format: format
    };  
    lay('#'+startTime).on('click', function(e){
      if($('#'+endTime).val() != null && $('#'+endTime).val() != undefined && $('#'+endTime).val() != ''){
        start.max = $('#'+endTime).val();  
      }
        laydate.render(start); 
    });   
    lay('#'+endTime).on('click', function(e){
        if($('#'+startTime).val() != null && $('#'+startTime).val() != undefined && $('#'+startTime).val() != ''){  
            end.min = $('#'+startTime).val();  
        }  
        laydate.render(end);  
    });	
  }

  function isCarNo(value){
    var reg = RegExp(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/);
	return reg.test(value); 
  }
  

  initLaydate('beginTime','endTime','datetime','yyyy-MM-dd HH:mm:ss');
})
