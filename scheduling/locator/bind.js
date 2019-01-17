define(['validate', 'validation', 'localization', 'utilityForm'],function (require, exports, module) {
    $("#carForm").validate({
        debug: false, //调试模式，即使验证成功也不会跳转到目标页面
        focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
        onkeyup: false,
        errorClass: "alert alert-danger",
        rules: {
            no: {
                required: true,
                maxlength: 64
            },
            type: {
                maxlength: 64
            }
        },
        messages: {
            no: {
                required: "车牌号不能为空！"
            },
            type: {
                required: "类型不能为空！"
            }
        }
    })

    $('#pageClose').on('click', function () {
        window.location.href = './index.html';
    });

    var params = {
    };

    //警员选择
    $('#choiceCar').on('click', function () {
        //弹出一个iframe层
        layer.open({
            type: 2,
            title: '车辆信息查询',
            maxmin: false,
            shadeClose: true, //点击遮罩关闭层
            area: ['800px', '550px'],
            content: './choice.html'
        });
    });

    $('#save').on('click', function () {
        if ($("#carForm").valid()) {
            save($.extend(params,$.formToJson($("#carForm").serialize())));
        }
    });

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('locator/bind/release', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('绑定车辆信息成功', './index.html');
                }
            });

        });
    }

    function initData() {
        var id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('device/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('北斗定位终端信息不存在');
                    }else{                      
                        params.deviceId = result.data.id;
                        params.deviceNo = result.data.no;
                        params.deviceImei = result.data.imei;
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要绑定的北斗定位终端信息');
        }
    }
    initData();
})