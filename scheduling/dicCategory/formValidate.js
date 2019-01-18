define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    
    exports.initValidation = function (icon, httpUrl) {
        $('#pageClose').on('click', function () {
            window.location.href = './index.html';
        });
       
        //表单验证
        $("#dicForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                category: {
                    required: true,
                    maxlength: 64,
                    remote:{
                        type:"POST",  
                        cache: false,
                        headers: top.authorization,                        
                        url: top.fhzxApolloApi+"/dicCategory/info/remoteValidate", //请求地址  
                        data:{
                            dicIdent:function(){
                                return $('#category').val();
                            }
                        }
                    }  
                },
                dicName: {
                    required: true
                },
                name: {
                    required: true
                }
                
            },
            messages: {
                category: {
                    required: "字典code不能为空！",
                    remote: "字典code重复！"
                },
                name: {
                    required: "字典名称不能为空！",
                }
            }
        });

    }

})