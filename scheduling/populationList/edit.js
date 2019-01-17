define(function (require, exports, module) {
    var populationValidation = require('./formValidate');
    populationValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if ($("#populationForm").valid()) {
            seajs.use('../app/common/ajax', function (ajax) {
                //清空每次查询结果
                // $('#address').val('');
                ajax.post("map/info/resolve", {
                    address: $('#address').val()
                }, function (response) {
                    populationValidation.queryGeometry(response.data,false);
                });
            });
        }
    })

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('population/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('人口信息不存在');
                    }else{                
                        $.setForm(JSON.stringify(result.data));
                        populationValidation.setHouse(result.data.house);

                        populationValidation.initStructureInfo({
                            id: result.data.structureId,
                            no: result.data.structureNo
                        });

                        setTimeout(function () {
                            $('select.chosen-select').trigger('chosen:updated');
                        }, 2000);
                        
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的人口信息');
        }
    }
    initData();
})