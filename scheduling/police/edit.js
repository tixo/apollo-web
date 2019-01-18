define(function (require, exports, module) {
    var id = '';
    var photo = '';
    var policeValidation = require('./formValidate');
    policeValidation.initValidation();
    $('#save').on('click',function(){
        if($("#policeForm").valid()){
            var params = $.formToJson($("#policeForm").serialize());
            params.id=id;
            params.department =  $("#departmentId").find("option:selected").text();
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('police/info/update', params, function (response) {
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
            console.log('id='+id); 
            seajs.use(['../app/common/ajax','./formValidate'], function (ajax,policeValidation) {
                ajax.post('police/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('警员信息不存在');
                    }else{                      
                        //表单            
                        $.setForm(JSON.stringify(result.data));
                        //单位回显
                        init_tree(orgTreeData);
                        var treeObj = $.fn.zTree.getZTreeObj("dropdown-menu-tree-fun");
                        var node = treeObj.getNodeByParam("orgKey", result.data.unitId, null);
                        var nodeId = node.id;
                        //部门回显
                        findDepartment(nodeId,result.data.departmentId);
                        //验证
                        policeValidation.initValidation(result.data.photo,result.data.httpUrl);
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的警员信息');
        }
    }
    initData();
})