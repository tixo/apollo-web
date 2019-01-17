define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    function setheaders(request) {
        if(!$.isEmptyObject(top.authorization)){
            request.setRequestHeader("userId", top.authorization.userId);
            request.setRequestHeader("userToken", top.authorization.userToken);
        }
    }

    exports.initValidation = function () {
        //表单验证
        $("#carForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                no: {
                    required: true,
                    //isPlateNo:true,
                    maxlength: 64,
                    remote:{
                        type: "POST",
                        cache: false,
                        headers: top.authorization,
                        url: top.fhzxApolloApi + "car/info/remoteValidate", //请求地址  
                        beforeSend: function(request) {
                            setheaders(request);
                        },
                        data:{}
                    }  
                },
                type: {
                    required: true,
                    maxlength: 128
                },
                remark: {
                    maxlength: 500
                }
            },
            messages: {
                no: {
                    required: "车牌号码不能为空！",
                    remote: "该车牌号码已存在！"
                   // isPlateNo:"车牌号码格式不正确！"
                },
                type: {
                    required: "车辆类型不能为空！"
                }
            }
        });
        
    }
})