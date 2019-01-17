define(function (require, exports, module) {
    seajs.use('./formValidate', function (userValidation) {
        userValidation.initValidation();
    });

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#roleForm").valid()){
            var params = $.formToJson($("#roleForm").serialize());
            params.menuList = [];
            var checkMenu = $.zui.store.get("checkMenu");
            for(var i = 0;i < checkMenu.length;i++){
                var menu = {
                    id:checkMenu[i]
                }
                params.menuList.push(menu);
                var actionId = $.zui.store.get(checkMenu[i]);
                for(var j = 0;j < actionId.length;j++){
                    menu = {
                        id:actionId[j]
                    }
                    params.menuList.push(menu);
                }
                $.zui.store.set(checkMenu[i],[]);
            }
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('role/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存角色信息成功','./index.html');
                }
            });
                        
        });
    }
})