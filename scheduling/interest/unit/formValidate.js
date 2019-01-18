define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {

    function initType(nodes) {
        if ($.isEmptyObject(nodes)) {
            $.showErrorInfo('兴趣点分类选中节点无效');
        } else {
            // console.log(result);
            var selectData=[];
            if(!$.isEmpty(nodes.children)){
                $.each(nodes.children, function (index, d) {
                    selectData.push({
                        id: d.id,
                        name: d.name
                    });
                });
                $("#typeName").val(nodes.children[0].name);
            }else{
                selectData.push({
                    id: nodes.id,
                    name: nodes.name
                });
                $("#typeName").val(nodes.name);
            }

            $.each(selectData, function (index, d) {
                $("#type").append('<option value="' + d.id + '">' + d.name + '</option>');
            });

            $('#type').chosen({
                allow_single_deselect: true,
                no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
                disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
                search_contains: true // 从任意位置开始检索
            }).on('change', function (evt, option) {
                $.each(selectData, function (index, d) {
                    if (d.id == option.selected) {
                        $("#typeName").val(d.name);
                    }
                });
            });
        }
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
        seajs.use('../../app/common/ajax', function (ajax) {
            ajax.post('interest/unit/save', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('保存兴趣点信息成功', './index.html');
                }
            });

        });
    }

    /**
     * 数据更新
     * @param {*} params 
     */
    function update(params) {
        seajs.use('../../app/common/ajax', function (ajax) {
            ajax.post('interest/unit/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('更新兴趣点信息成功','./index.html');
                }
            });
                        
        });
    }
    
    exports.queryGeometry = function (result,isSave) {
        if (1 == result.code) {
            var queryGeo = result.data.geocodes
            if (queryGeo.length == 0) {
                $.showErrorInfo('住址解析结果不存在,请输入正确的地址');
            } else {
                if (queryGeo.length == 1) {
                    $('#choiceAddress').attr('style','display:none;');
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
                    var params = $.formToJson($("#populationForm").serialize());
                    if(isSave){
                        save(params);
                    }else{
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
        $.each(choiceData, function (index, data) {
            $("#address_input").append('<option value=' + index + '>' + data.formatted_address + '</option>');
        });
        $('#address_input').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            setCoordinates(choiceData[option.selected]);
        });
    };

    exports.initValidation = function () {
        //表单验证
        $("#populationForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                gb: {
                    required: true,
                    maxlength: 32
                },
                fhcode: {
                    required: true,
                    maxlength: 64
                },
                name: {
                    required: true,
                    maxlength: 32
                },             
                no: {
                    required: true,
                    maxlength: 32
                },                        
                type: {
                    required: true
                },
                idCard: {
                    required: true,
                    maxlength: 20
                },
                chargeName: {
                    required: true,
                    maxlength: 20
                },
                telephone: {
                    required: true,
                    maxlength: 20
                },
                address: {
                    required: true,
                    maxlength: 512
                },
                remarks: {
                    maxlength: 512
                }
            },
            messages: {}
        });
        // initDownload();

        initType(parent.window.getSlectedNode());

        var selNode = parent.window.getSlectedNode();
        
        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/user/info/upload',
            headers:top.authorization,
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
        });
    }
})