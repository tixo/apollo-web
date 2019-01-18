define(['utilityForm'],function (require, exports, module) {
    var id = '';
    var typeParam= {};

    //表单验证
    seajs.use('./formValidate', function (instrumentValidation) {
        instrumentValidation.initValidation();
        $('#no').attr('readonly','readonly');
        $("#no").rules('remove');
        $('#imei').attr('readonly','readonly');
        $("#imei").rules('remove');
    });

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#instrumentForm").valid()){
            var params = $.formToJson($("#instrumentForm").serialize());
            params.id=id;
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('device/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                   $.showSuccessTipAndGo('保存设备信息成功','./index.html?type='+typeParam.type);
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('device/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('设备信息不存在');
                    }else{                      
                        $.setForm(JSON.stringify(result.data));
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的设备信息');
        }
    }

    exports.initialization = function (type) {
        typeParam.type= type;
        initData();
    }
})