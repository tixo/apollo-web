define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    exports.initValidation = function () {
        //表单验证
        $("#instrumentForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                no: {
                    required: true,
                    maxlength: 256,
                    remote: {
                        type: "POST",
                        cache: false,
                        headers: top.authorization,
                        url: top.fhzxApolloApi + "device/info/remoteValidate", //请求地址  
                        beforeSend: function(request) {
                            $.setheaders(request);
                        },
                        data: {
                            name: 'no',
                            value: function(){
						        return $('#no').val();
					        }  
                        }
                    }
                },
                remark: {
                    maxlength: 500
                },
                imei: {
                    required: true,
                    maxlength: 256,
                    remote: {
                        type: "POST",
                        cache: false,
                        headers: top.authorization,
                        url: top.fhzxApolloApi + "device/info/remoteValidate", //请求地址  
                        beforeSend: function(request) {
                            $.setheaders(request);
                        },
                        data: {
                            name: 'imei',
                            value: function(){
						        return $('#imei').val();
					        } 
                        }
                    }
                }
            },
            messages: {
                no: {
                    required: "设备编号不能为空！",
                    remote: "设备编号已经存在,请重新输入！"
                },
                imei: {
                    required: "设备IMEI不能为空！",
                    remote: "设备IMEI已经存在,请重新输入！"
                }
            },
            submitHandler: function (form) {
                console.log($.formToJson($(form).serialize()));
                save(params);
                return false;
            }
        })
    }
})