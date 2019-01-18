define(function (require, exports, module) {
    seajs.use('./formValidate', function (buildingValidation) {
        buildingValidation.initValidation();
    });

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#buildingForm").valid()){
            var params = $.formToJson($("#buildingForm").serialize());
            save(params);
        }
    });

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('building/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存保存信息成功','./index.html');
                }
            });             
        });
    }

    /**
   * 时间控件初始化
   */
    function initYearWidget() {
        laydate.render({
            elem: '#year',
            format: 'yyyy-MM-dd'
        });
    }
    initYearWidget();
})