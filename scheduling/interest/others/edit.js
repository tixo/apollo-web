define(function (require, exports, module) {
    var populationValidation = require('./formValidate');
    populationValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if ($("#populationForm").valid()) {
            seajs.use('../../app/common/ajax', function (ajax) {
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
            seajs.use('../../app/common/ajax', function (ajax) {
                ajax.post('interest/others/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('兴趣点信息不存在');
                    }else{                
                        $.setForm(JSON.stringify(result.data));
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的兴趣点信息');
        }
    }
    initData();
})