define(function (require, exports, module) {
    
    var carValidation = require('./formValidate');
    carValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#carForm").valid()){
            var params = $.formToJson($("#carForm").serialize());
            params.department =  $("#departmentId").find("option:selected").text();
            save(params);
        }
    });

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('car/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存车辆信息成功','./index.html');
                }
            });
                        
        });
    }
})