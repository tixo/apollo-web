define(function (require, exports, module) {

    var typeParam= {};
    seajs.use('./formValidate', function (instrumentValidation) {
        instrumentValidation.initValidation();
    });

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });
    
     $('#save').on('click',function(){
        if($("#instrumentForm").valid()){
            var params = $.formToJson($("#instrumentForm").serialize());
            $.extend(params,typeParam);
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('device/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存设备信息成功','./index.html?type='+typeParam.type);
                }
            });
                        
        });
    }

    exports.initialization = function (type) {
        typeParam.type= type;
    }
})