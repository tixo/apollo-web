define(function (require, exports, module) {
    
    var orgValidation = require('./formValidate');
    orgValidation.initValidation();
    
    $('#save').on('click',function(){
        if($("#orgForm").valid()){
            var params = $.formToJson($("#orgForm").serialize());
            params.parentId = $.zui.store.get('pid');
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
           
            ajax.post('organization/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存字典分类信息成功','./index.html');
                }
            });
               
        });
    }
})