define(function (require, exports, module) {
    require('utilityForm');
    var id = '';
    //表单验证
    var surveillance = require('./formValidate');

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#surveillanceForm").valid()){
            var params = $.formToJson($("#surveillanceForm").serialize());
            params.id=id;
            surveillance.getParams(params);
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('plan/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存预案信息成功','./index.html');
                }
            });         
        });
    }

    function initData() {
        id = $.getParam('id');
        var doc = null;
        if(!$.isEmptyObject(id)){
            seajs.use(['../app/common/ajax','./formValidate'], function (ajax,surveillanceValidation) {
                ajax.post('plan/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('布控信息信息不存在');
                    }else{                      
                        //表单    
                        // result.data.beginTime = dateFormat(result.data.beginTime);
                        // result.data.endTime = dateFormat(result.data.endTime);      
                        $.setForm(JSON.stringify(result.data));
                        surveillance.initValidation(result.data.planDocumentUrl);
                        //回显target图片
                        getBack(result.data.httpUrl,result.data.planPicUrl);
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的警员信息');
        }
        
    }

    initData();

    //回显target图片（人脸和车牌）
    function getBack(httpUrl,target){
        surveillance.getBackFaceImg("",httpUrl,target,'11');
    }
})

