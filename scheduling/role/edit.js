define(function (require, exports, module) {
    var id = '';
    require('utilityForm');
    var roleValidation = require('./formValidate');
    roleValidation.initValidation();
    $('#indent').attr('readonly','readonly');
    $("#indent").rules('remove');
    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });
    $('#save').on('click',function(){
        if($("#roleForm").valid()){
            var params = $.formToJson($("#roleForm").serialize());
            params.id=id;
            params.menuList = [];
            var checkMenu = $.zui.store.get("checkMenu");
            for(var i = 0;i < checkMenu.length;i++){
                var menu = {
                    id:checkMenu[i]
                }
                params.menuList.push(menu);
                var actionId = $.zui.store.get(checkMenu[i]);
                if(!actionId){
                    actionId = [];
                }
                for(var j = 0;j < actionId.length;j++){
                    menu = {
                        id:actionId[j]
                    }
                    params.menuList.push(menu);
                }
                $.zui.store.set(checkMenu[i],[]);
            }
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('role/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存角色信息成功','./index.html');
                }
            });    
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use(['../app/common/ajax'], function (ajax) {
                ajax.post('role/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('角色信息不存在');
                    }else{                      
                        //表单            
                        $.setForm(JSON.stringify(result.data));
                        var mList = result.data.menuList;
                        $.zui.store.set("checkMenu",[]);
                        for(var i = 0;i < mList.length;i++){
                            if(0 == mList[i].type){
                                var checkMenu = $.zui.store.get("checkMenu");
                                checkMenu.push(mList[i].id);
                                $.zui.store.set("checkMenu",checkMenu);
                            }
                        }
                        for(var i = 0;i < mList.length;i++){
                            if(1 == mList[i].type){
                                $.zui.store.set(mList[i].parentId,[]);
                            }
                        }
                        for(var i = 0;i < mList.length;i++){
                            if(1 == mList[i].type){
                                var action = $.zui.store.get(mList[i].parentId);
                                action.push(mList[i].id);
                                $.zui.store.set(mList[i].parentId,action);
                            } 
                        }
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的角色信息');
        }
    }
    //清空store中的数据
    $.zui.store.clear();
    initData();
})