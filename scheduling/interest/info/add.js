define(function (require, exports, module) {
    var populationValidation = require('./formValidate');
    populationValidation.initValidation();

    $('#pageClose').on('click', function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#populationForm").valid()){
            var params = $.formToJson($("#populationForm").serialize());
            save(params);
        }
    });

    function save(params) {
        seajs.use('../../app/common/ajax', function (ajax) {
            ajax.post('interest/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    parent.window.refreshZtree();
                    $.showSuccessTipAndGo('保存兴趣点信息成功','./index.html');
                }
            });
                        
        });
    }
})