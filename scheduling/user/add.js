define(function (require, exports, module) {
    
    var roleList = [];
    var userValidation = require('./formValidate');
    userValidation.initValidation();
    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#userForm").valid()){
            var params = $.formToJson($("#userForm").serialize());
            userValidation.getParams(params);
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('user/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存警员信息成功','./index.html');
                }
            });
                        
        });
    }
})