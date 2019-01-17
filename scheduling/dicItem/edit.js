define(function (require, exports, module) {
    var id = '';
    var photo = '';
    require('utilityForm');
    var dicValidation = require('./formValidate');
    dicValidation.initValidation();
    $('#dicIdent').attr('readonly','readonly');
    $("#dicIdent").rules('remove');
    $('#save').on('click',function(){
        if($("#dicForm").valid()){
            var params = $.formToJson($("#dicForm").serialize());
            var parentIdent = $("#parentIdent").val();
            var pid = $.zui.store.get('pid');
            params.categoryId = pid;
            if(parentIdent !== pid){
                params.parentIdent = parentIdent;
            }
            params.id=id;
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('dictionary/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存菜单信息成功','./index.html');
                }
            });
                    
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            console.log('id='+id); 
            seajs.use(['../app/common/ajax'], function (ajax) {
               
                ajax.post('dictionary/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('菜单信息不存在');
                    }else{                      
                        //表单            
                        $.setForm(JSON.stringify(result.data));
                    }
                });     
            
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的菜单信息');
        }
    }
    initData();
})