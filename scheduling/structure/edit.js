define(function (require, exports, module) {
    var structureValidation = require('./formValidate');
    structureValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './populationList.html';
    });

    $('#save').on('click',function(){
        if ($("#structureForm").valid()) {
            seajs.use('../app/common/ajax', function (ajax) {
                //清空每次查询结果
                // $('#address').val('');
                ajax.post("map/info/resolve", {
                    address: $('#address').val()
                }, function (response) {
                    structureValidation.queryGeometry(response.data,false);
                });
            });
        }
    })

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('structure/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    console.log(result);
                    if(result.code <=0){
                        $.showErrorInfo('建筑物信息不存在');
                    }else{                
                        $.setForm(JSON.stringify(result.data));
                        // $('#addressShow').val(result.data.address);
                        structureValidation.setFloor(result.data.floor);
                        $('select.chosen-select').trigger('chosen:updated');
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的建筑物信息');
        }
    }
    initData();
})