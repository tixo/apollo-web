define(function (require, exports, module) {
    var id = '';
    require('utilityForm');
    var buildingValidation = require('./formValidate');
    buildingValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#buildingForm").valid()){
            var params = $.formToJson($("#buildingForm").serialize());
            params.id=id;
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('building/info/update', params, function (response) {
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
            $('#no').attr('readonly','readonly');
            $('#no').rules('remove','remote');
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('building/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('车辆信息不存在');
                    }else{
                        $.setForm(JSON.stringify(result.data));
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的车辆信息');
        }
    }
    initData();

     /**
   * 时间控件初始化
   */
    function initYearWidget() {
        var ins1 = laydate.render({
            elem: '#year',
            format: 'yyyy-MM-dd'
        });
    }

    initYearWidget();
})