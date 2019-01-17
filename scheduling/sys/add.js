define(function (require, exports, module) {
    // seajs.use('./formValidate', function (sysValidation) {
    //     sysValidation.initValidation();
    // });
    var menuList = [];
    var sysValidation = require('./formValidate');
    sysValidation.initValidation();
    $('#save').on('click',function(){
        if($("#sysForm").valid()){
            var params = $.formToJson($("#sysForm").serialize());
            sysValidation.getParams(params);
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('sys/info/save', params, function (response) {
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