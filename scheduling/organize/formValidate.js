define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    
    exports.initValidation = function (icon, httpUrl) {
        $('#pageClose').on('click', function () {
            window.location.href = './index.html';
        });
        $("#parentOrgName").val($.zui.store.get("parentOrgName"));
        //表单验证
        $("#orgForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                orgKey: {
                    required: true,
                    maxlength: 64,
                    remote:{
                        type:"POST",  
                        headers: top.authorization,  
                        url: top.fhzxApolloApi+"/organization/info/remoteValidate", //请求地址  
                        data:{
                            orgKey:function(){
                                return $('#orgKey').val();
                            }
                        }
                    }  
                },
                type: {
                    required: true
                },
                name: {
                    required: true
                }
                
            },
            messages: {
                orgKey: {
                    required: "组织机构标识不能为空！",
                    remote: "组织机构标识重复！"
                },
                type: {
                    required: "组织机构类型不能为空！",
                },
                name: {
                    required: "组织机构名称不能为空！",
                }
            }
        });

    }

   

})