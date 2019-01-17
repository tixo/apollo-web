define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    function initDownload() {
        $('#download').on('click', function () {
            ajax.download('police/info/download', {}, function (response) {
                console.log(response);
                var result = response.data;
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([result], {
                        type: 'application/octet-stream'
                    });
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", '案件信息导入模板.xls');
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                    console.log(ex);
                }
            });
        });
    }

    /**
     * 时间控件初始化
     */
    function initYearWidget(inputId) {
        laydate.render({
            elem: '#' + inputId,
            type: 'datetime',
            max: new Date().toTimeString(),
            format: 'yyyy-MM-dd HH:mm:ss'
        });
    }

    //判断是否显示损失金额和失窃物品div
    function isLoss() {
        $("input[name='isLoss']").on('click', function () {
            if ($("#isLoss-2").prop("checked") == true) {
                $("#damageMoneyDiv").css("display", "block");
                $("#lostThingsDiv").css("display", "block");
            }
            if ($("#isLoss-1").prop("checked") == true) {
                $("#damageMoneyDiv input").val("");
                $("#damageMoneyDiv").css("display", "none");
                $("#lostThingsDiv input").val("");
                $("#lostThingsDiv").css("display", "none");
            }
        })
    }

    //判断是否显示警情子类别下拉框
    function hasSubCategory() {
        $("#category").change(function () {
            if ($("#category").val() == "1") {
                common_select("subCategory");
                //$("#subCategory").val("1");
                $("#subCategoryDiv").css("display", "block");
            } else {
                $("#subCategory").val("");
                $("#subCategoryDiv").css("display", "none");
                $("#subCategory").empty();
            }
        });
    }

    function initCaseAffirs() {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("dictionary/info/findCaseAffairs", [], function (response) {
                var result = response.data;
                //var value = $("#" + domId).attr("value");
                //$("#" + domId).val(value);
                $.each(result, function (index, d) {
                    $("#category").append('<option value="' + d.dicIdent + '">' + d.dicName + '</option>');
                });
            });
        });
    }

    //初始化字典下拉框
    function common_select(domId) {
        var dicKey = $("#" + domId).attr("key");
        var key = "dicIdent";
        var val = "dicName";
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("dictionary/info/findDicByCategory/"+dicKey, {}, function (response) {
                var result = response.data;
                var value = $("#" + domId).attr("value");
                $("#" + domId).val(value);
                $.each(result, function (i, o) {
                    $("<option>", {
                        "value": o[key],
                        "text": o[val],
                        "selected": value == o[key]
                    }).appendTo($("#" + domId))
                });

            });
        });
    }

    //初始化单位下拉框
    function unit_select() {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("organization/info/findOrgTree", {}, function (response) {
                var result = response.data;
                var value = $("#disposeUnit").attr("value");
                $("#disposeUnit").val(value);
                $.each(result, function (i, o) {
                    $("<option>", {
                        "value": o.orgKey,
                        "text": o.name,
                        "selected": value == o.orgKey
                    }).appendTo($("#disposeUnit"))
                });

            });
        });
    }

    function initMapFinder() {
        $('#mapFinder').on('click', function () {
            console.log($('#alarmPosition').val())
			
            if($.isEmpty($('#alarmPosition').val())){
                $.showErrorInfo('请先输入警情位置');
            }else{
                //弹出即全屏
                var index = layer.open({
                    type: 2,
                    content: './map.html',
                    area: ['320px', '195px'],
                    maxmin: true,
                    closeBtn: 2,
                    btnAlign: 'c',
                    btn: ['关闭'],
                    yes: function (index, layero) {
                    layer.closeAll();
                    }
                });
                layer.full(index);
            }
        });
    }

    exports.initValidation = function () {
        //表单验证
        $("#caseForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                alarmTime: {
                    required: true
                },
                name: {
                    required: true,
                    maxlength: 128
                },
                alarmPosition: {
                    required: true
                },
                disposeTime: {
                    required: true
                },
                policeOfficer: {
                    required: true,
                    maxlength: 128
                },
                detail: {
                    required: true,
                    maxlength: 500
                }
            },
            messages: {
                alarmTime: {
                    required: "报警时间不能为空！"
                },
                name: {
                    required: "报警人姓名不能为空！"
                },
                alarmPosition: {
                    required: "警情位置不能为空！"
                },
                disposeTime: {
                    required: "受理时间不能为空！"
                },
                policeOfficer: {
                    required: "接警人不能为空！"
                },
                detail: {
                    required: "报警内容不能为空！"
                }
            }
        });


        hasSubCategory();

        
        common_select("category");
        //initCaseAffirs();
        unit_select();
        initDownload();

        initYearWidget('alarmTime');
        initYearWidget('disposeTime');
        initYearWidget('arrivalTime');
        isLoss();

        initMapFinder();
    }
})