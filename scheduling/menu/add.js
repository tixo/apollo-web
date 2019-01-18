define(function (require, exports, module) {
    
    var policeValidation = require('./formValidate');
    policeValidation.initValidation();

    $('#save').on('click',function(){
        if($("#menuForm").valid()){
            var params = $.formToJson($("#menuForm").serialize());
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('menu/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存菜单信息成功','./index.html');
                }
            });
                        
        });
    }
})