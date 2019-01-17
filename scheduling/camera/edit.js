define(function (require, exports, module) {
    var id = '';
    //表单验证
    require('utilityForm');
    var instrumentValidation = require('./formValidate');
    instrumentValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#cameraForm").valid()){
            var params = $.formToJson($("#cameraForm").serialize());
            params.department =  $("#departmentId").find("option:selected").text();
            params.id=id;
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('camera/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存设备信息成功','./index.html');
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            console.log('id='+id); 
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('camera/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('设备信息不存在');
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
            $.showErrorInfo('请重新选择要编辑的设备信息');
        }
    }
    initData();

     /**
   * 时间控件初始化
   */
  function initYearWidget() {
    var ins1 = laydate.render({
        elem: '#installationDate',
        format: 'yyyy-MM-dd'
    });
}

initYearWidget();
})