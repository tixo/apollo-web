define(['validate', 'validation', 'localization', 'utilityForm'],function (require, exports, module) {
    $("#policeForm").validate({
        debug: false, //调试模式，即使验证成功也不会跳转到目标页面
        focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
        onkeyup: false,
        errorClass: "alert alert-danger",
        rules: {
            no: {
                required: true,
                maxlength: 64
            },
            name: {
                required: true,
                maxlength: 128
            },
            telephone: {
                maxlength: 64
            }
        },
        messages: {
            no: {
                required: "警员编号不能为空！"
            },
            name: {
                required: "警员姓名不能为空！"
            }
        }
    })

    $('#pageClose').on('click', function () {
        window.location.href = './index.html';
    });

    var params = {
    };

    //警员选择
    $('#choicePolice').on('click', function () {
        //弹出一个iframe层
        layer.open({
            type: 2,
            title: '警员信息查询',
            maxmin: false,
            shadeClose: true, //点击遮罩关闭层
            area: ['800px', '550px'],
            content: './choice.html'
        });
    });

    $('#save').on('click', function () {
        if ($("#policeForm").valid()) {
            save($.extend(params,$.formToJson($("#policeForm").serialize())));
        }
    });

    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('recorder/bind/release', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('绑定警员信息成功', './index.html');
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
                        $.showErrorInfo('执法记录仪信息不存在');
                    }else{                      
                        params.deviceId = result.data.id;
                        params.deviceNo = result.data.no;
                        params.deviceImei = result.data.imei;
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要绑定的执法记录仪信息');
        }
    }
    initData();
})