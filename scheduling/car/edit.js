define(function (require, exports, module) {
    var id = '';
    //表单验证
    var carValidation = require('./formValidate');
    carValidation.initValidation();
    $('#no').attr('readonly','readonly');
    $("#no").rules('remove');
    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#carForm").valid()){
            var params = $.formToJson($("#carForm").serialize());
            params.department =  $("#departmentId").find("option:selected").text();
            params.id=id;
            
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('car/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存车辆信息成功','./index.html');
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('car/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('车辆信息不存在');
                    }else{                      
                        $.setForm(JSON.stringify(result.data));
                        //单位回显
                        init_tree(orgTreeData);
                        var treeObj = $.fn.zTree.getZTreeObj("dropdown-menu-tree-fun");
                        var node = treeObj.getNodeByParam("orgKey", result.data.unitId, null);
                        var nodeId = node.id;
                        //部门回显
                        findDepartment(nodeId,result.data.departmentId);
                    }
                });                  
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的车辆信息');
        }
    }
    initData();
})