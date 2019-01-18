define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    function initDownload() {
        $('#download').on('click', function () {
            ajax.download('police/info/download', {}, function (response) {
                console.log(response);
                var result = response.data;
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([result], {
                        type: 'application/octet-stream'
                    });
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", '警员信息导入模板.xls');
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

    exports.initValidation = function (photo, httpUrl) {
        $('#pageClose').on('click', function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#policeForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                no: {
                    required: true,
                    maxlength: 64
                },
                name: {
                    required: true,
                    maxlength: 128
                },
                unit:{
                    required: true,
                    maxlength: 128
                },
                telephone: {
                    maxlength: 64
                },
                duty: {
                    maxlength: 128
                },
                remark: {
                    maxlength: 500
                }
            },
            messages: {
                no: {
                    required: "警员编号不能为空！"
                },
                name: {
                    required: "警员姓名不能为空！"
                },
                unit: {
                    required: "所属单位不能为空！"
                }
            }
        });

        var showFiles = [];
        if (!$.isEmpty(photo)) {
            showFiles.push({
                type: 'image/jpg',
                name: httpUrl + photo,
                url: httpUrl + photo
            });
        }

        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/police/info/upload',
            limitFilesCount: 1,
            headers:top.authorization,
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
            },
            staticFiles: showFiles,
            responseHandler: function (responseObject, file) {
                var response = JSON.parse(responseObject.response);
                // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
                if (1 == response.code) {
                    $('#photo').val(response.data);
                } else {
                    return response.message;
                }
            }
        });

        initDownload();
    }
})