define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    function initStructureSlelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            var dics = ['structure_type', 'structure_property'];
            ajax.post('dic/info/findItemsBatch', dics, function (response) {
                var result = response.data;
                $.each(dics, function (index, data) {
                    if (!$.isEmpty(result[data])) {
                        if (data == 'structure_type') {
                            initType(result[data])
                        }
                        if (data == 'structure_property') {
                            initProperty(result[data])
                        }
                    }
                });
            });

        });
    }

    function initType(data) {
        $("#typeName").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#type").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#type').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(gender, function (index, d) {
                if (d.key == option.selected) {
                    $("#typeName").val(d.value);
                }
            });
        });
    }

    function initProperty(data) {
        $("#propertyName").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#property").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#property').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(gender, function (index, d) {
                if (d.key == option.selected) {
                    $("#propertyName").val(d.DIC_NAME);
                }
            });
        });
    }

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
            type: 'year',
            max: new Date().toTimeString(),
            format: 'yyyy'
        });
    }

    /**
     *根据传入的点的x,y坐标查询此点所属的片区
     *x: x坐标（数值）
     *y: y坐标（数值）
     */
    function queryFeatureByGeometry(x, y) {
        var point = new SuperMap.Geometry.Point(x, y);
        var getFeaturesByGeometryParameters, getFeaturesByGeometryService;
        var url = top.services.queryUrl;
        //新建查询参数
        getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters({
            datasetNames: ["HTC02:片区面"],
            toIndex: -1,
            spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
            geometry: point
        });
        //新建查询服务
        getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(url, {
            eventListeners: {
                "processCompleted": processCompleted,
                "processFailed": function (e) {
                    console.log("查询所属片区面失败！");
                }
            }
        });
        //异步查询
        getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
    }
    /**
     *查询成功的回调函数
     */
    function processCompleted(getFeaturesEventArgs) {
        if (getFeaturesEventArgs.result && getFeaturesEventArgs.result.features.length > 0) {
            var feature = getFeaturesEventArgs.result.features[0];
            $('#district').val(feature.attributes.LAYER);
        }
    }

    /**
     * 设置坐标
     * 
     * @param {*} queryGeo 
     */
    function setCoordinates(queryData) {
        var location = queryData.location;
        var position = location.split(',');
        var x = position[0];
        var y = position[1];
        var new_position = gcj02ToWgs84(Number(x), Number(y));

        $('#longtitude').val(new_position.x);
        $('#latitude').val(new_position.y);

        // $('#addressShow').val(queryData.formatted_address);
        // $('#address').val(queryData.formatted_address);

        queryFeatureByGeometry(new_position.x, new_position.y);
    }

    /**
     * 数据保存
     * @param {*} params 
     */
    function save(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('structure/info/save', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('保存建筑物信息成功', './index.html');
                }
            });

        });
    }

    /**
     * 数据更新
     * @param {*} params 
     */
    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('structure/info/update', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('保存建筑物信息成功', './index.html');
                }
            });

        });
    }

    exports.queryGeometry = function (result, isSave) {
        if (1 == result.code) {
            var queryGeo = result.data.geocodes
            if (queryGeo.length == 0) {
                $.showErrorInfo('地址解析结果不存在,请输入正确的地址');
            } else {
                if (queryGeo.length == 1) {
                    $('#choiceAddress').attr('style', 'display:none;');
                    setCoordinates(queryGeo[0]);
                } else {
                    $('#choiceAddress').attr('style', '');
                    initChoiceData(queryGeo);

                    if ($('#address_input>option').length > 1 && $.isEmpty($('#address_input>option:selected'))) {
                        $.showErrorInfo('地址解析结果存在多选,请点击输入框后的下拉按钮并选择合适的地址');
                        return;
                    }
                }

                if ($.trim($('#address').val()).length > 0) {
                    var params = $.formToJson($("#structureForm").serialize());
                    var floor = getFloor();
                    if (!$.isEmpty(floor)) {
                        params.floor = floor;
                    }

                    if (isSave) {
                        save(params);
                    } else {
                        update(params);
                    }
                }
            }
        } else {
            $.showErrorInfo('地址解析地理编码失败,服务未开启或者参数错误');
        }
    }

    /**
     * 初始化下拉框选项
     * 
     * @param {*} choiceData 
     */
    function initChoiceData(choiceData) {
        $('#address_input').html('');
        $("#address_input").append('<option></option>');
        $.each(choiceData, function (index, data) {
            $("#address_input").append('<option value=' + index + '>' + data.formatted_address + '</option>');
        });
        $('#address_input').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            var tempData = choiceData[option.selected];
            $('#address').val(tempData.formatted_address)
            setCoordinates(tempData);
        });
    };

    var floor_template = '<tr>' +
        '<td>' +
        '<input type="checkbox" class="xcheckgroup2 checkItem" name="chk" value="{{id}}">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control" required name="layer" value="{{layer}}" placeholder="层号" />' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control" required name="floor_no" value="{{floor_no}}" placeholder="楼层编码" />' +
        '</td>' +
        '<td>' +
        '<input type="number" class="form-control" name="houses" value="{{houses}}"  placeholder="楼层户数" />' +
        '</td>' +
        '</tr>';

    exports.setFloor = function (floors) {
        console.log(floors);
        if(!$.isEmpty(floors) && !$.isEmptyObject(floors)){
            $.each(floors,function(index,data){
                var template = Handlebars.compile(floor_template);
                $('#floor_tableView').append(template({
                    id: data.id,
                    layer: data.layer,
                    floor_no: data.no,
                    houses: data.houses
                }));
            });
        }
    }

    function getFloor() {
        var floor = [];
        console.log($('#floor_tableView tr').length);
        $('#floor_tableView tr').each(function () {
            var sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));

            var layer = $($(this).children('td:eq(1)')).children('input[type="text"]').val();
            var floor_no = $($(this).children('td:eq(2)')).children('input[type="text"]').val();
            var houses = $($(this).children('td:eq(3)')).children('input[type="number"]').val();

            console.log(layer);
            if (!$.isEmpty(layer) && !$.isEmpty(floor_no) && !$.isEmpty(houses)) {
                var tempData = {
                    layer: layer,
                    no: floor_no,
                    houses: houses
                };
                if(!$.isEmpty(sel.val())){
                    tempData.id=sel.val();
                }
                floor.push(tempData);
            }
        });
        return floor;
    }

    function initFloorActions() {
        $('#floor_add').on('click', function () {
            var template = Handlebars.compile(floor_template);
            $('#floor_tableView').append(template({}));
        });

        $('#floor_delete').on('click', function () {
            var sel = null;
            var isCheck = false;
            $('#floor_tableView tr').each(function () {
                sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
                if (sel.is(':checked')) {
                    isCheck = true;
                }
            });
            if (!isCheck) {
                $.showErrorInfo('未选中楼层信息');
            } else {
                $('#floor_tableView tr').each(function () {
                    sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
                    if (sel.is(':checked')) {
                        $(this).remove();
                    }
                });
            }
        });
    }

    var xcheck = null;
    exports.initValidation = function () {
        //表单验证
        $("#structureForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                name: {
                    required: true,
                    maxlength: 1024
                },
                no: {
                    required: true,
                    maxlength: 64
                },
                address: {
                    required: true,
                    maxlength: 1024
                },
                type: {
                    required: true
                },
                years: {
                    required: true
                },
                property: {
                    required: true
                },
                community: {
                    maxlength: 1024
                },
                chargeName: {
                    maxlength: 20
                },
                telephone: {
                    maxlength: 32
                }
            },
            messages: {}
        });
        initDownload();

        initYearWidget('years');
        initFloorActions();

        check = $.XCheck({
            groupClass: ".xcheckgroup2"
        });

        initStructureSlelect();
        /*
        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/surveillance/info/upload',
            limitFilesCount: 1,
            filters: {
                // 只允许上传图片
                mime_types: [{
                    title: '图片',
                    extensions: 'jpg,gif,png'
                }],
                // 最大上传文件为 10MB
                max_file_size: '10mb',
                // 不允许上传重复文件
                prevent_duplicates: false
            },
            deleteActionOnDone: function (file, doRemoveFile) {
                doRemoveFile();
            },
            
            responseHandler: function (responseObject, file) {
                var response = JSON.parse(responseObject.response);
                // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
                if (1 == response.code) {
                    this.removeFile(file);
                    $('#icon').val(response.data);
                } else {
                    return 'error';
                }
            }
        });*/
    }
})