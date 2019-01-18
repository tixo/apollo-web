define(function (require, exports, module) {
    var id = '';
    var photo = '';
    require('utilityForm');
    var userValidation = require('./formValidate');
    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#userForm").valid()){
            var params = $.formToJson($("#userForm").serialize());
            params.id=id;
            userValidation.getParams(params);
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('user/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存警员信息成功','./index.html');
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            
            seajs.use(['../app/common/ajax'], function (ajax) {
                ajax.post('user/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('警员信息不存在');
                    }else{                      
                        //表单            
                        $.setForm(JSON.stringify(result.data));
                        //验证
                        userValidation.initValidation(result.data.photo,result.data.httpUrl);
                        $('#loginName').attr('readonly','readonly');
                        $("#loginName").rules('remove');
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的警员信息');
        }
    }

    initData();
})