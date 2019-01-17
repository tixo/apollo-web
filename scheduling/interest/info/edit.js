define(function (require, exports, module) {
    var populationValidation = require('./formValidate');
    populationValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#populationForm").valid()){
            var params = $.formToJson($("#populationForm").serialize());
            params.id=id;
            
            update(params);
        }
    })

    function update(params) {
        seajs.use('../../app/common/ajax', function (ajax) {
            ajax.post('interest/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    parent.window.refreshZtree();
                    $.showSuccessTipAndGo('保存兴趣点信息成功','./index.html');
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../../app/common/ajax', function (ajax) {
                ajax.post('interest/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('兴趣点信息不存在');
                    }else{                
                        if(!$.isEmptyObject(parentId)){
                            $("#url").rules("remove");
                            $('#view_url').attr('style','display:none;');
                            ajax.post('interest/info/findByPrimaryKey/'+result.data.parentId, {}, function (subResponse) {
                                var subResult = subResponse.data;
                                if(subResult.code <=0){
                                    $.showErrorInfo('兴趣点信息不存在');
                                }else{             
                                    result.data.pName =    subResult.data.name;
                                    $.setForm(JSON.stringify(result.data));
                                }
                            }); 
                        }                  
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的兴趣点信息');
        }
    }
    initData();
})