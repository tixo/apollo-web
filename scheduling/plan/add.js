define(function (require, exports, module) {
    var surveillance = require('./formValidate');
    surveillance.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#surveillanceForm").valid()){
            var params = $.formToJson($("#surveillanceForm").serialize());
            surveillance.getParams(params);
            save(params);
        }
    });

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('plan/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存预案信息成功','./index.html');
                }
            });
                        
        });
    }
})