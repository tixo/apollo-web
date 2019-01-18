define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    function setheaders(request) {
        if(!$.isEmptyObject(top.authorization)){
            request.setRequestHeader("userId", top.authorization.userId);
            request.setRequestHeader("userToken", top.authorization.userToken);
        }
    }

    exports.initValidation = function () {
        //表单验证
        $("#buildingForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                no: {
                    required: true,
                    maxlength: 64,
                    remote:{  
                        type: "POST",
                        cache: false,
                        headers: top.authorization,
                        url: top.fhzxApolloApi + "building/info/remoteValidate", //请求地址  
                        beforeSend: function(request) {
                            setheaders(request);
                        },
                        data:{}
                    }  
                },
                name: {
                    required: true,
                    maxlength: 128
                },
                holderName: {
                    required: true,
                    maxlength: 128
                },
                holderTelephone: {
                    required: true,
                    maxlength: 64
                },
                address: {
                    required: true,
                    maxlength: 200
                },
                type: {
                    required: true,
                    maxlength: 64
                },
                year: {
                    required: true,
                    maxlength: 64
                },
                remark: {
                    maxlength: 500
                }
            },
            messages: {
                no: {
                    required: "建筑物编号不能为空！",
                    remote:"该编号已存在"
                },
                name: {
                    required: "建筑名称不能为空！"
                },
                holderName: {
                    required: "产权人不能为空！"
                },
                holderTelephone: {
                    required: "联系电话不能为空！"
                },
                address: {
                    required: "地址不能为空！"
                },
                type: {
                    required: "建筑类型不能为空！"
                },
                year: {
                    required: "建筑类型不能为空！"
                }
            }
        })
    }
})