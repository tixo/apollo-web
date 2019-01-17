define(function (require, exports, module) {
    var id = '';
    require('utilityForm');
    var orgValidation = require('./formValidate');
    orgValidation.initValidation();
   
    $('#save').on('click',function(){
        if($("#orgForm").valid()){
            var params = $.formToJson($("#orgForm").serialize());
            params.id=id;
            var parentId = $.zui.store.get('pid');
            params.parentId = parentId;
            update(params);
        }
    });

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
        
            ajax.post('organization/info/update', params, function (response) {
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
                ajax.post('organization/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('菜单信息不存在');
                    }else{                      
                        //表单            
                        $.setForm(JSON.stringify(result.data));
                        //组织机构类型和标识不能修改，去掉验证
                        $('#orgKey').attr("disabled","disabled");
                        $('#orgKey').rules("remove");
                        $('#type').attr("disabled","disabled");
                        $('#type').rules("remove");
                    }
                });     
                
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的菜单信息');
        }
    }
    initData();
})