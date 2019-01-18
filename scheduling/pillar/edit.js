define(function (require, exports, module) {
    var id = '';
    var photo = '';
    var policeValidation = require('./formValidate');
    policeValidation.initValidation();
    $('#save').on('click',function(){
        if($("#pillarForm").valid()){
            debugger;
            var params = $.formToJson($("#pillarForm").serialize());
            params.id=id;
            params.department =  $("#departmentId").find("option:selected").text();
            update(params);
        }
    });

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('alarm/pillar/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('更新报警柱信息成功','./index.html');
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            console.log('id='+id); 
            seajs.use(['../app/common/ajax','./formValidate'], function (ajax,policeValidation) {
                ajax.post('alarm/pillar/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('报警柱信息不存在');
                    }else{                      
                        //表单            
                        $.setForm(JSON.stringify(result.data));
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的警员信息');
        }
    }
    initData();
})