define(['validate','validation','localization', 'utilityForm'], function (require, exports, module) {
    exports.initValidation = function () {
        //表单验证
        $("#cameraForm").validate({
            debug:false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules:{
                no: {
                    required: true,
                    maxlength: 64
                },
                name: {
                    required: true,
                    maxlength: 255
                },
                administrativeRegionName: {
                    required: true,
                    maxlength: 255
                },
                monitoryPointType: {
                    required: true,
                    maxlength: 64
                },
                cameraModel: {
                    required: true,
                    maxlength: 128
                },alias: {
                    maxlength: 128
                },
                ipFour: {
                    required: true,
                    maxlength: 128
                },
                ipSix: {
                    maxlength: 128
                },
                macAddrerss: {
                    maxlength: 128
                },
                cameraType: {
                    maxlength: 128
                },
                cameraFunctionType: {
                    maxlength: 128
                },
                fillLightProperties: {
                    maxlength: 128
                },
                cameraCodeFormat: {
                    maxlength: 128
                },
                installationAddress: {
                    required: true,
                    maxlength: 128
                },
                cameraLocationType: {
                    required: true,
                    maxlength: 128
                },
                pointLon: {
                    required: true,
                    maxlength: 128
                },
                pointLat: {
                    required: true,
                    maxlength: 128
                },
                monitoringBearing: {
                    required: true,
                    maxlength: 128
                },
                networkingProperties: {
                    required: true,
                    maxlength: 128
                },
                popedomPopedom: {
                    required: true,
                    maxlength: 128
                },
                popedomPopedomCode: {
                    required: true,
                    maxlength: 128
                },
                managementUnitContact: {
                    required: true,
                    maxlength: 128
                },
                videoPreservationDays: {
                    required: true,
                    maxlength: 128
                },
                belongToDept: {
                    maxlength: 128
                },
                installationDate: {
                    required: true,
                    maxlength: 64
                },
                cameraState: {
                    required: true
                },
                loginName: {
                    required: true,
                    maxlength: 64
                },
                loginPassword: {
                    required: true,
                    maxlength: 64
                },
                bayonetType: {
                    required: true,
                    maxlength: 64
                }
            },
            messages: {
                no: {
                    required: "设备编号不能为空！"
                },name: {
                    required: "设备名称不能为空！"
                },administrativeRegionName: {
                    required: "行政区域名称不能为空！"
                },monitoryPointType: {
                    required: "监控点类型名称不能为空！"
                },cameraModel: {
                    required: "设备型号不能为空！"
                },cameraState: {
                    required: "摄像头状态不能为空！"
                },loginName: {
                    required: "用户名不能为空！"
                },loginPassword: {
                    required: "密码不能为空！"
                },bayonetType: {
                    required: "卡口类型不能为空！"
                },ipFour: {
                    required: "IPV4不能为空！"
                },installationDate: {
                    required: "安装时间不能为空！"
                }
            },
            // submitHandler: function (form) {
            //     console.log($.formToJson($(form).serialize()));
            //     save(params);
            //     return false;
            // } 
         });
        }
})