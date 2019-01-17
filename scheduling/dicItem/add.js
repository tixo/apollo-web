define(function (require, exports, module) {
    
    var policeValidation = require('./formValidate');
    policeValidation.initValidation();
    
    $('#save').on('click',function(){
        if($("#dicForm").valid()){
            var params = $.formToJson($("#dicForm").serialize());
            var parentIdent = $("#parentIdent").val();
            var pid = $.zui.store.get('pid');
            params.categoryId = pid;
            if(parentIdent !== pid){
                params.parentIdent = parentIdent;
            }
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            
            ajax.post('dictionary/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存字典信息成功','./index.html');
                }
            });
                       
        });
    }
})