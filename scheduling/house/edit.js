define(function (require, exports, module) {
    var houseValidation = require('./formValidate');
    houseValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './populationList.html';
    });

    $('#save').on('click',function(){
        if ($("#houseForm").valid()) {
            seajs.use('../app/common/ajax', function (ajax) {
                //清空每次查询结果
                // $('#address').val('');
                ajax.post("map/info/resolve", {
                    address: $('#address').val()
                }, function (response) {
                    console.log(response);
                    houseValidation.queryGeometry(response.data,false);
                });
            });
        }
    })

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('house/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('房屋信息不存在');
                    }else{                
                        // $.setForm(JSON.stringify(result.data));
                        // $('#addressShow').val(result.data.address);

                        houseValidation.initStructureInfo({
                            id: result.data.structureId,
                            no: result.data.structureNo
                        });

                        setTimeout(function () {
                            $.setForm(JSON.stringify(result.data));
                            $('select.chosen-select').trigger('chosen:updated');
                        }, 2000);
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的房屋信息');
        }
    }
    initData();
})