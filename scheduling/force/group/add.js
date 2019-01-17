define(function (require, exports, module) {
    seajs.use('./formValidate', function (policeValidation) {
        policeValidation.initValidation();
    });
    
    $('#save').on('click',function(){
        
        if($("#groupForm").valid()){
            var params = $.formToJson($("#groupForm").serialize());
            var storeMember = $.zui.store.page;
            if(!$.isEmptyObject(storeMember)){
                var member = [];
                $.each(storeMember,function(key, value) {               // 遍历所有本地存储的条目
                    member.push(value);
                });
                params.member =  member;
            }
            
            save(params);
        }
    })

    function save(params) {
        seajs.use('../../app/common/ajax', function (ajax) {
            ajax.post('force/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存分组信息成功','./index.html');
                }
            });
                        
        });
    }
})