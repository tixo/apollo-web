define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    function initHouseSlelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            var dics = ['house_type','house_property','house_status','house_purpose','certificate_type'];
            ajax.post('dic/info/findItemsBatch', dics, function (response) {
                var result = response.data;
                console.log(result);
                $.each(dics, function (index, data) {
                    if (!$.isEmpty(result[data])) {
                        if (data == 'house_type') {
                            initCategory(result[data])
                        }
                        if (data == 'house_property') {
                            initProperty(result[data])
                        }        
                        if (data == 'house_status') {
                            initStatus(result[data])
                        }    
                        if (data == 'house_purpose') {
                            initPurpose(result[data])
                        }   
                        if (data == 'certificate_type') {
                            initCertType('lordCert',result[data]);
                            initCertType('trustCert',result[data]);
                        }                                                                                               
                    }
                });
            });

        });
    }

    function initCertType(prefix,data) {
        $("#"+prefix+"Name").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#"+prefix+"Type").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#'+prefix+"Type").chosen({
            allow_single_deselect: true, 
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#"+prefix+"Name").val(d.DIC_NAME);
                }
            });
        });
    }

    function initCategory(data) {
        $("#categoryName").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#category").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#category').chosen({
            allow_single_deselect: true, 
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#categoryName").val(d.DIC_NAME);
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
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#propertyName").val(d.DIC_NAME);
                }
            });
        });
    }

    function initStatus(data) {
        $("#statusName").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#status").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#status').chosen({
            allow_single_deselect: true, 
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#statusName").val(d.DIC_NAME);
                }
            });
        });
    }

    function initPurpose(data) {
        $("#purposeName").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#purpose").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#purpose').chosen({
            allow_single_deselect: true, 
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#purposeName").val(d.DIC_NAME);
                }
            });
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
            ajax.post('house/info/save', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('保存房屋信息成功', './index.html');
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
            ajax.post('house/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('更新房屋信息成功','./index.html');
                }
            });
                        
        });
    }
    
    exports.queryGeometry = function (result,isSave) {
        if (1 == result.code) {
            var queryGeo = result.data.geocodes
            if (queryGeo.length == 0) {
                $.showErrorInfo('地址解析结果不存在,请输入正确的地址');
            } else {
                if (queryGeo.length == 1) {
                    $('#choiceAddress').attr('style','display:none;');
                    setCoordinates(queryGeo[0]);                       
                } else {
                    $('#choiceAddress').attr('style','');
                    initChoiceData(queryGeo);


                    if ($('#address_input>option').length > 1 && $.isEmpty($('#address_input>option:selected'))) {
                        $.showErrorInfo('地址解析结果存在多选,请点击输入框后的下拉按钮并选择合适的地址');
                        return;
                    }
                }

                if ($.trim($('#address').val()).length > 0) {
                    var params = $.formToJson($("#houseForm").serialize());
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
            var tempData = choiceData[option.selected];
            $('#address').val(tempData.formatted_address)
            setCoordinates(tempData);
        });
    };

    
    function initFloorInfo(floor){
        if(!$.isEmptyObject(floor)){
            $('#floorNo').val(floor[0].no);
            $('#floorId').html('');

            $.each(floor, function (index, data) {
                $("#floorId").append('<option value=' + data.id + '>' + data.layer + '</option>');
            });
            $('#floorId').chosen({
                allow_single_deselect: true,
                no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
                disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
                search_contains: true // 从任意位置开始检索
            }).on('change', function (evt, option) {   
                $.each(floor, function (index, data) {
                    if(option.selected == data.id){
                        $('#floorNo').val(data.no);
                    }
                });
            });  
        }  
    }

    exports.initStructureInfo = function(structure){
        if(!$.isEmpty(structure)){
            $('#structureId').val(structure.id);
            $('#structureNo').val(structure.no);
            $('#community').val(structure.community);

            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('floor/info/findByCondition', {
                    structureId: structure.id
                }, function (response) {
                    var result = response.data;
                    if ($.isEmpty(structure)) {
                        $.showErrorInfo('楼层信息不存在');
                    } else {
                        initFloorInfo(result);
                    }
                });       
            });
        }
    }

    exports.initValidation = function () {
        //表单验证
        $("#houseForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                name: {
                    required: true,
                    maxlength: 32
                },
                no: {
                    required: true,
                    maxlength: 64
                },
                room: {
                    required: true,
                    isAge: true
                },          
                area: {
                    required: true,
                    isAge: true
                },                      
                address: {
                    required: true,
                    maxlength: 1024
                },
                // community: {
                //     required: true
                // },
                lordCertType: {
                    required: true
                },
                lordNo: {
                    required: true,
                    maxlength: 18
                },
                lordName: {
                    required: true,
                    maxlength: 32
                },
                structureNo: {
                    required: true
                },
                floorId: {
                    required: true
                }
            },
            messages: {}
        });

        //建筑物选择
        $('#structureNo').on('click', function () {
            //弹出一个iframe层
            layer.open({
                type: 2,
                title: '警员信息查询',
                maxmin: false,
                shadeClose: true, //点击遮罩关闭层
                area: ['800px', '550px'],
                content: '../structure/choice.html'
            });
        });
   
        window.initStructureInfo = this.initStructureInfo; 
        
        initHouseSlelect();
    }
})