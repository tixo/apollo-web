define(function (require, exports, module) {

    var instrumentValidation = require('./formValidate');
    instrumentValidation.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

     $('#save').on('click',function(){
        if($("#cameraForm").valid()){
            var params = $.formToJson($("#cameraForm").serialize());
            params.department =  $("#departmentId").find("option:selected").text();
            save(params);
        }
    })

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('camera/info/save', params, function (response) {
                var result = response.data;
                console.log(result.code <=0);
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存设备信息成功','./index.html');
                }
            });
                        
        });
    }

    /**
   * 时间控件初始化
   */
  function initYearWidget() {
    laydate.render({
        elem: '#installationDate',
        format: 'yyyy-MM-dd'
    });
}
initYearWidget();
})