define(function (require, exports, module) {
    var id = '';
    var photo = '';
    require('utilityForm');
    var sysValidation = require('./formValidate');
    $('#save').on('click',function(){
        if($("#sysForm").valid()){
            var params = $.formToJson($("#sysForm").serialize());
            params.id=id;
            sysValidation.getParams(params);
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('sys/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存系统应用信息成功','./index.html');
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            console.log('id='+id); 
            seajs.use(['../app/common/ajax','./formValidate'], function (ajax,sysValidation) {
                ajax.post('sys/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('系统应用信息不存在');
                    }else{
                        console.log(result.data);
                        //表单            
                        $.setForm(JSON.stringify(result.data));
                        //验证
                        sysValidation.initValidation(result.data.icon,result.data.httpUrl);
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的系统应用信息');
        }
    }
    initData();
})