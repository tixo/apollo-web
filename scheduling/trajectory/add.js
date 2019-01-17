define(function (require, exports, module) {
    var surveillance = require('./formValidate');
    surveillance.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#surveillanceForm").valid()){
            var params = $.formToJson($("#surveillanceForm").serialize());
            console.log(params);
            save(params);
        }
    });

    function save(params) {
        var ajax1 = require('../app/common/ajax');
        console.log(surveillance.getParams(params));
        // seajs.use('../app/common/ajax', function (ajax) {
            ajax1.post('trajectory/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存轨迹分析任务信息成功','./trajectory.html');
                }
            });
                        
        // });
    }
})