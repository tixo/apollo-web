define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    var cache = [];
    var companyHouseFloorInfo = [];

    function initCompanySlelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            var dics = ['company_category'];
            ajax.post('dic/info/findItemsBatch', dics, function (response) {
                var result = response.data;
 
                $.each(dics, function (index, data) {
                    if (!$.isEmpty(result[data])) {
                        if (data == 'company_category') {
                            initType(result[data])
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
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#typeName").val(d.DIC_NAME);
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
        if (!$.isEmpty(companyHouseFloorInfo)) {
            params.companyHouseFloorInfo = companyHouseFloorInfo;
        }

        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('company/info/save', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('保存单位信息成功', './index.html');
                }
            });
        });
    }

    /**
     * 数据更新
     * @param {*} params 
     */
    function update(params) {
        if (!$.isEmpty(companyHouseFloorInfo)) {
            params.companyHouseFloorInfo = companyHouseFloorInfo;
        }
        
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('company/info/update', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('更新单位信息成功', './index.html');
                }
            });

        });
    }

    exports.queryGeometry = function (result, isSave) {
        if (1 == result.code) {
            var queryGeo = result.data.geocodes
            if (queryGeo.length == 0) {
                $.showErrorInfo('住址解析结果不存在,请输入正确的地址');
            } else {
                if (queryGeo.length == 1) {
                    $('#choiceAddress').attr('style', 'display:none;');
                    setCoordinates(queryGeo[0]);
                } else {
                    $('#choiceAddress').attr('style', '');
                    initChoiceData(queryGeo);

                    if ($('#address_input>option').length > 1 && $.isEmpty($('#address_input>option:selected'))) {
                        $.showErrorInfo('住址解析结果存在多选,请点击输入框后的下拉按钮并选择合适的地址');
                        return;
                    }
                }

                if ($.trim($('#address').val()).length > 0) {
                    var params = $.formToJson($("#companyForm").serialize());
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

    // function initFloorInfo(floor) {
    //     if (!$.isEmptyObject(floor)) {
    //         $('#floorNo').val(floor[0].no);
    //         $('#floorId').html('');

    //         $.each(floor, function (index, data) {
    //             $("#floorId").append('<option value=' + data.id + '>' + data.layer + '</option>');
    //         });
    //         $('#floorId').chosen({
    //             allow_single_deselect: true,
    //             no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
    //             disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
    //             search_contains: true // 从任意位置开始检索
    //         }).on('change', function (evt, option) {
    //             $.each(floor, function (index, data) {
    //                 if (option.selected == data.id) {
    //                     $('#floorNo').val(data.no);
    //                 }
    //             });
    //         });
    //     }
    // }

    exports.initStructureInfo = function (companyHouseInfo,companyId) {
        if (!$.isEmpty(companyHouseInfo)) {

            var template = Handlebars.compile(floor_template);
            $.each(companyHouseInfo, function (index, data) {
                $('#house_tableView').append(template({
                    id: data.id,
                    layer: data.structureInfo.name
                }));

                
                var house_tableView = $('#house_tableView tr').last();
                //搜索初始化
                initAutocomplete(house_tableView);

                var tempFloor = null;
                // 楼层初始化
                var floorSelect = house_tableView.children('td:eq(2)').children('select');
                $.each(data.structureInfo.floor, function (fIndex, fl) {
                    if (data.floorInfo.id = fl.id) {
                        tempFloor = data.floorInfo;
                        floorSelect.append('<option selected value=' + fl.id + '>' + fl.layer + '(' + fl.no + ')' + '</option>');
                    } else {
                        floorSelect.append('<option value=' + fl.id + '>' + fl.layer + '(' + fl.no + ')' + '</option>');
                    }
                });

                floorSelect.chosen({
                    allow_single_deselect: true,
                    no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
                    disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
                    search_contains: true // 从任意位置开始检索
                }).on('change', function (evt, option) {
                    $.each(data.structureInfo.floor, function (tIndex, tfl) {
                        if (option.selected = tfl.id) {
                            initHouse({
                                id: data.id,
                                companyId: companyId,
                                structureId: data.structureInfo.id,
                                structureNo: data.structureInfo.no,
                                floorId: option.selected,
                                floorNo: tfl.no
                            }, index, house_tableView);
                        }
                    });                    
                });

                companyHouseFloorInfo[index] = {
                    id: data.id,
                    companyId: companyId,
                    structureId: data.structureInfo.id,
                    structureNo: data.structureInfo.no,
                    floorNo: tempFloor.no,
                    floorId: data.floorInfo.id
                }
                floorSelect.trigger('chosen:updated');

                initHouse(companyHouseFloorInfo[index], index, house_tableView);

                // 房屋初始化
                if (!$.isEmpty(data.floorInfo.houseInfo)) {
                    var houseSelect = $('#house_tableView tr').last().children('td:eq(3)').children('select');
                    $.each(data.floorInfo.houseInfo, function (hIndex, ho) {
                        if (data.houseInfo.id = ho.id) {
                            houseSelect.append('<option selected value=' + ho.id + '>' + ho.name + '(' + ho.no + '|' + ho.lordName + ')' + '</option>');
                        } else {
                            houseSelect.append('<option value=' + ho.id + '>' + ho.name + '(' + ho.no + '|' + ho.lordName + ')' + '</option>');
                        }
                    });

                    houseSelect.chosen({
                        allow_single_deselect: true,
                        no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
                        disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
                        search_contains: true // 从任意位置开始检索
                    }).on('change', function (evt, option) {
                        companyHouseFloorInfo[index].houseId = option.selected;
                    });

                    companyHouseFloorInfo[index] = {
                        id: data.id,
                        companyId: companyId,
                        structureId: data.structureInfo.id,
                        structureNo: data.structureInfo.no,
                        floorNo: tempFloor.no,
                        floorId: data.floorInfo.id,
                        houseId: data.houseInfo.id
                    }
                    houseSelect.trigger('chosen:updated');
                }
            });
        }
    }

    var floor_template = '<tr>' +
        '<td>' +
        '<input type="checkbox" class="xcheckgroup2 checkItem" name="chk" value="{{id}}">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control" required name="layer" value="{{layer}}" placeholder="请输入建筑物名称搜索" />' +
        '</td>' +
        '<td>' +
        '<select  class="chosen-select form-control required"></select>' +
        '</td>' +
        '<td>' +
        '<select  class="chosen-select form-control"></select>' +
        '</td>' +
        '</tr>';

    function initHouse(params, fIndex, house_tableView) {
        var targetHouse = house_tableView.children('td:eq(3)').children('select');
        targetHouse.html('');
        targetHouse.trigger('chosen:updated');
        companyHouseFloorInfo[fIndex] = params;
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('house/info/findByCondition', params, function (response) {
                var result = response.data;
                if ($.isEmpty(result)) {
                    $.showErrorInfo('没有查询到房屋信息');
                } else {
                    $.each(result, function (index, data) {
                        targetHouse.append('<option value=' + data.id + '>' + data.name + '(' + data.no + '|' + data.lordName + ')' + '</option>');
                    });
                    companyHouseFloorInfo[fIndex].houseId = result[0].id;

                    targetHouse.trigger('chosen:updated');

                    targetHouse.chosen({
                        allow_single_deselect: true,
                        no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
                        disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
                        search_contains: true // 从任意位置开始检索
                    }).on('change', function (evt, option) {
                        companyHouseFloorInfo[fIndex].houseId = option.selected;
                    });
                }
            });
        });
    }

    function searchFloor(cacheData,sId, fIndex, house_tableView) {
        var floorSelect = house_tableView.children('td:eq(2)').children('select');
        floorSelect.html('');
        $.each(cacheData, function (index, data) {
            if (sId = data.id) {

                var selectedId = '';

                if(!$.isEmpty(companyHouseFloorInfo[fIndex]) && !$.isEmpty(companyHouseFloorInfo[fIndex].id)){
                    selectedId = companyHouseFloorInfo[fIndex].id;
                }

                companyHouseFloorInfo[fIndex] = {
                    id: selectedId,
                    structureId: sId,
                    structureNo: data.no
                }

                var tempFloor = data.floor;
                if (!$.isEmpty(tempFloor)) {
                    $.each(tempFloor, function (index, fl) {
                        floorSelect.append('<option value=' + fl.id + '>' + fl.layer + '(' + fl.no + ')' + '</option>');
                    });

                    floorSelect.trigger('chosen:updated');

                    initHouse({
                        id: selectedId,
                        structureId: sId,
                        floorId: tempFloor[0].id,
                        structureNo: data.no,
                        floorNo: tempFloor[0].no
                    }, fIndex, house_tableView);

                    floorSelect.chosen({
                        allow_single_deselect: true,
                        no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
                        disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
                        search_contains: true // 从任意位置开始检索
                    }).on('change', function (evt, option) {
                        $.each(tempFloor, function (index, tdf) {
                            if(option.selected == tdf.id){
                                initHouse({
                                    id: selectedId,
                                    structureId: sId,
                                    floorNo: tdf.no,
                                    structureNo: data.no,
                                    floorId: option.selected
                                }, fIndex, house_tableView);
                            }
                        });
                    });
                }
                return;
            }
        });
    }

    function initAutocomplete(house_tableView){
        house_tableView.children('td:eq(1)').children('input[type="text"]').autocomplete({
            delay: 30,
            minLength: 1,
            source: function (request, response) {
                // console.log(request);
                var that = this;

                function wrapResponse(data) {
                    response($.grep(data, function (item) {
                        return item;
                    }));
                }

                seajs.use('../app/common/ajax', function (ajax) {
                    ajax.post('structure/info/findBySearch', {
                        searchParams: {
                            keyWord: request.term
                        }
                    }, function (response) {
                        var result = response.data;
                        cache = result;
                        console.log(cache);
                        console.log('cache');
                        house_tableView.children('td:eq(2)').children('select').html('');
                        if ($.isEmpty(result)) {
                            $.showErrorInfo('没有查询到建筑物信息');
                        } else {
                            var target = [];
                            $.each(result, function (index, data) {
                                target.push({
                                    id: data.id,
                                    label: data.name + '(' + data.address + ')',
                                    value: data.name
                                });
                            });

                            wrapResponse(target)
                        }
                    });
                });
            },
            _renderItem: function (ul, item) {
                return $("<li>")
                    .attr("data-value", item.value)
                    .append(item.lable)
                    .appendTo(ul);
            },
            select: function (event, ui) {
                if (!$.isEmpty(cache)) {
                    searchFloor(cache,ui.item.id, $('#house_tableView tr').length - 1, house_tableView);
                }
            }
        });
    }

    function initHouseActions() {
        $('#house_add').on('click', function () {
            var template = Handlebars.compile(floor_template);
            $('#house_tableView').append(template({}));
            initAutocomplete($('#house_tableView tr').last());
        });

        $('#house_delete').on('click', function () {
            var sel = null;
            var isCheck = false;
            $('#house_tableView tr').each(function () {
                sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
                if (sel.is(':checked')) {
                    isCheck = true;
                }
            });
            if (!isCheck) {
                $.showErrorInfo('未选中楼层信息');
            } else {
                // 不被删除的数组元素下标
                var keepHouseInfoIndex = [];
                $('#house_tableView tr').each(function (index) {
                    sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
                    if (sel.is(':checked')) {
                        $(this).remove();
                    } else {
                        keepHouseInfoIndex.push(index);
                    }
                });

                var keepHouseInfoValue = [];
                $.each(delHouseInfoIndex, function (dIndex, dData) {
                    keepHouseInfoValue.push(companyHouseFloorInfo[dData]);
                });
                companyHouseFloorInfo = keepHouseInfoValue;
            }
        });
    }

    exports.initValidation = function () {
        //表单验证
        $("#companyForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                name: {
                    required: true,
                    maxlength: 1024
                },
                // structureNo: {
                //     required: true,
                //     maxlength: 64
                // },
                code: {
                    required: true,
                    maxlength: 64
                },
                address: {
                    required: true,
                    maxlength: 1024
                },
                community: {
                    required: true
                },
                chargeName: {
                    required: true,
                    maxlength: 20
                },
                telephone: {
                    required: true,
                    maxlength: 32
                },
                cardNumber: {
                    required: true,
                    maxlength: 18
                }
                // strutctureId: {
                //     required: true
                // },
                // floorId: {
                //     required: true
                // }
            },
            messages: {}
        });

        //建筑物选择
        // $('#structureNo').on('click', function () {
        //     //弹出一个iframe层
        //     layer.open({
        //         type: 2,
        //         title: '建筑物信息查询',
        //         maxmin: false,
        //         shadeClose: true, //点击遮罩关闭层
        //         area: ['800px', '550px'],
        //         content: '../structure/choice.html'
        //     });
        // });

        // window.initStructureInfo = this.initStructureInfo;

        initHouseActions();

        check = $.XCheck({
            groupClass: ".xcheckgroup2"
        });

        initCompanySlelect();

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