define(function (require, exports, module) {
    var id = '';
    
    
    require('utilityForm');
    var menuValidation =require('./formValidate');
    menuValidation.initValidation();
    $('#resKey').attr('readonly','readonly');
    $("#resKey").rules('remove');
    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });
    $('#save').on('click',function(){
        if($("#menuForm").valid()){
            var params = $.formToJson($("#menuForm").serialize());
            params.id=id;
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('menu/info/update', params, function (response) {
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
            seajs.use(['../app/common/ajax'], function (ajax) {
                ajax.post('menu/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                     var parentId =result.data.parentId;
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