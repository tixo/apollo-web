define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    var staticFiles = [];
    function initStructureSlelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            var dics = ['plan_category'];
            ajax.post('dic/info/findItemsBatch', dics, function (response) {
                var result = response.data;
                $.each(dics, function (index, data) {
                    if (!$.isEmpty(result[data])) {
                        if (data == 'plan_category') {
                            initType(result[data])
                        }
                    }
                });
            });

        });
    }

    function initType(data) {
        $("#categoryName").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#categoryId").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#categoryId').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#categoryName").val(d.DIC_NAME);
                }
            });
        });
    }

    exports.initValidation = function (editFile) {
        if(!$.isEmptyObject(editFile)){
            staticFiles.push({
                name: editFile
            });
        }
        
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
                planName: {
                    required: true,
                    maxlength: 64
                }
            },
            messages: {
                planName: {
                    required: "预案名称不能为空！"
                }
            }
        });

        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/api/plan/uploadImg',
            headers:top.authorization,
            limitFilesCount: 1,
            filters: {
                // 只允许上传图片
                mime_types: [{
                    title: '图片',
                    extensions: 'jpg,gif,png'
                }],
                // 最大上传文件为 10MB
                max_file_size: '10mb',
                // 不允许上传重复文件
                prevent_duplicates: false
            },
            deleteActionOnDone: function (file, doRemoveFile) {
                doRemoveFile();
                $('#planPicUrl').val('');
            },
            
            responseHandler: function (responseObject, file) {
                var response = JSON.parse(responseObject.response);
                // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
                if (1 == response.code) {
                    this.removeFile(file);
                    $("i[class='icon icon-remove-circle']").parent("div").remove();
                    $('#planPicUrl').val(response.data.filePath);                 
                    exports.getBackFaceImg("",response.data.httpUrl,response.data.filePath,'11');
                } else {
                    return response.message;
                }
            }
        });

        $('#uploaderDoc').uploader({
            url: top.fhzxApolloApi + '/api/plan/uploadDoc',
            limitFilesCount: 1,
            headers:top.authorization,
            staticFiles:staticFiles,
            filters: {
                // 只允许上传图片
                mime_types: [{
                    title: '文档',
                    extensions: 'doc'
                }],
                // 最大上传文件为 10MB
                max_file_size: '10mb',
                // 不允许上传重复文件
                prevent_duplicates: false
            },
            deleteActionOnDone: function (file, doRemoveFile) {
                doRemoveFile();
                $('#planDocumentUrl').val('');
            },
            
            responseHandler: function (responseObject, file) {
                var response = JSON.parse(responseObject.response);
                console.log(responseObject);
                // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
                if (1 == response.code) {
                    $('#planDocumentUrl').val(response.data);
                } else {
                    return response.message;
                }
            }
        });


        initStructureSlelect()
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
        $('#planPicUrl').val('');
    }
})
