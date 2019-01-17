define(function (require, exports, module) {
    seajs.use('./formValidate', function (policeValidation) {
        policeValidation.initValidation();
    });
    
    $('#save').on('click',function(){
        if($("#policeForm").valid()){
            var params = $.formToJson($("#policeForm").serialize());
            params.department =  $("#departmentId").find("option:selected").text();
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('police/info/save', params, function (response) {
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