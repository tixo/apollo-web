define(['validate','validation','localization', 'utilityForm'], function (require, exports, module) {
    function initValidation() {
        //表单验证
        $("#userForm").validate({
            debug:false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules:{
                password: {
                    required: true,
                    maxlength: 100
                },
                newPassword: {
                    required: true,
                    maxlength: 100,
                    passWord: true
                },
                confirmPassword: {
                    required: true,
                    maxlength: 100,
                    passWord: true,
                    equalTo: "#newPassword"
                }
            },
            messages: {
                password:{  
                    required:"请输入原始密码"
                },
                newPassword: {
                    required: "请输入新密码"
                },
                confirmPassword: {
                    required: "请输入确认密码",
                    equalTo: '确认密码和新密码输入不一致'
                }
            } 
         });


         $('#update').on('click',function(){
            if($("#userForm").valid()){
                var params = $.formToJson($("#userForm").serialize());
                var params = {
                    id: top.authorization.userId,
                    password: $('#password').val(),
                    newPassword: $('#newPassword').val()
                };
                console.log(params);
                seajs.use('../app/common/ajax', function (ajax) {
                    ajax.post('user/info/password/update', params, function (response) {
                        var result = response.data;
                        if(result.code <=0){
                            $.showErrorInfo(result.message);
                        }else{
                            $.showSuccessTipAndGo("密码修改成功");
                            top.authorization = [];
                            $.cookie("userId", '', { expires: -1 });
                            $.cookie("userToken", '', { expires: -1 });
                            $.cookie("appId", '', { expires: -1 });
                            top.location.href = top.fhzxApolloApi+"logout?userId="+top.authorization.userId;
                            setTimeout(function(){
                                parent.layer.closeAll();
                            },1000);
                        }
                    });
                                
                });

            }
        })

    }

    initValidation();

})