define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {

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
                    maxlength: 256
                },
                address: {
                    required: true,
                    maxlength: 512
                },
                params: {
                    maxlength: 256
                },
                remark: {
                    maxlength: 256
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
    }
})