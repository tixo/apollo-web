define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    var isSave = false;
    var nation = [{
            "key": "01",
            "value": "汉族"
        },
        {
            "key": "02",
            "value": "壮族"
        },
        {
            "key": "03",
            "value": "满族"
        },
        {
            "key": "04",
            "value": "回族 "
        },
        {
            "key": "05",
            "value": "苗族"
        },
        {
            "key": "06",
            "value": "维吾尔族 "
        },
        {
            "key": "07",
            "value": "土家族"
        },
        {
            "key": "08",
            "value": "彝族"
        },
        {
            "key": "09",
            "value": "蒙古族"
        },
        {
            "key": "10",
            "value": "藏族"
        },
        {
            "key": "11",
            "value": "布依族"
        },
        {
            "key": "12",
            "value": "侗族"
        },
        {
            "key": "13",
            "value": "瑶族"
        },
        {
            "key": "14",
            "value": "朝鲜族   "
        },
        {
            "key": "15",
            "value": "白族"
        },
        {
            "key": "16",
            "value": "哈尼族"
        },
        {
            "key": "17",
            "value": "哈萨克族"
        },
        {
            "key": "18",
            "value": "黎族"
        },
        {
            "key": "19",
            "value": "傣族"
        },
        {
            "key": "20",
            "value": "畲族"
        },
        {
            "key": "21",
            "value": "傈僳族  "
        },
        {
            "key": "22",
            "value": "仡佬族"
        },
        {
            "key": "23",
            "value": "东乡族"
        },
        {
            "key": "24",
            "value": "高山族"
        },
        {
            "key": "25",
            "value": "拉祜族"
        },
        {
            "key": "26",
            "value": "水族"
        },
        {
            "key": "27",
            "value": "佤族"
        },
        {
            "key": "28",
            "value": "纳西族   "
        },
        {
            "key": "29",
            "value": "羌族"
        },
        {
            "key": "30",
            "value": "土族"
        },
        {
            "key": "31",
            "value": "仫佬族"
        },
        {
            "key": "32",
            "value": "锡伯族"
        },
        {
            "key": "33",
            "value": "柯尔克孜族"
        },
        {
            "key": "34",
            "value": "达斡尔族"
        },
        {
            "key": "35",
            "value": "景颇族  "
        },
        {
            "key": "36",
            "value": "毛南族"
        },
        {
            "key": "37",
            "value": "撒拉族"
        },
        {
            "key": "38",
            "value": "布朗族"
        },
        {
            "key": "39",
            "value": "塔吉克族"
        },
        {
            "key": "40",
            "value": "阿昌族"
        },
        {
            "key": "41",
            "value": "普米族"
        },
        {
            "key": "42",
            "value": "鄂温克族   "
        },
        {
            "key": "43",
            "value": "怒族"
        },
        {
            "key": "44",
            "value": "京族"
        },
        {
            "key": "45",
            "value": "基诺族"
        },
        {
            "key": "46",
            "value": "德昂族"
        },
        {
            "key": "47",
            "value": "保安族"
        },
        {
            "key": "48",
            "value": "俄罗斯族"
        },
        {
            "key": "49",
            "value": "裕固族  "
        },
        {
            "key": "50",
            "value": "乌兹别克族"
        },
        {
            "key": "51",
            "value": "门巴族"
        },
        {
            "key": "52",
            "value": "鄂伦春族"
        },
        {
            "key": "53",
            "value": "独龙族"
        },
        {
            "key": "54",
            "value": "塔塔尔族"
        },
        {
            "key": "55",
            "value": "赫哲族"
        },
        {
            "key": "56",
            "value": "珞巴族"
        }
    ];

    function initNation() {
        $.each(nation, function (index, d) {
            $("#nation").append('<option value="' + d.key + '">' + d.value + '</option>');
        });
        $('#nation').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(nation, function (index, d) {
                if (d.key == option.selected) {
                    $("#nationName").val(d.value);
                }
            });
        });
        $("#nationName").val(nation[0].value);
    }

    function initSex() {
        var gender = [{
            "key": "1",
            "value": "男"
        }, {
            "key": "2",
            "value": "女"
        }, {
            "key": "9",
            "value": "未知"
        }];

        $("#sex").val(gender[0].value);
        $.each(gender, function (index, d) {
            $("#gender").append('<option value="' + d.key + '">' + d.value + '</option>');
        });
        $('#gender').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(gender, function (index, d) {
                if (d.key == option.selected) {
                    $("#sex").val(d.value);
                }
            });
        });
    }

    function initEducation() {
        var education = [{
            "key": "01",
            "value": "小学"
        }, {
            "key": "02",
            "value": "初中"
        }, {
            "key": "03",
            "value": "高中"
        }, {
            "key": "04",
            "value": "专科"
        }, {
            "key": "05",
            "value": "本科"
        }, {
            "key": "06",
            "value": "硕士"
        }, {
            "key": "07",
            "value": "博士"
        }];
        $("#educationName").val(education[0].value);
        $.each(education, function (index, d) {
            $("#education").append('<option value="' + d.key + '">' + d.value + '</option>');
        });
        $('#education').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(education, function (index, d) {
                if (d.key == option.selected) {
                    $("#educationName").val(d.value);
                }
            });
        });
    }

    function initPolitication() {
        var politication = [{
            "key": "01",
            "value": "中共党员"
        }, {
            "key": "02",
            "value": "共青团员"
        }, {
            "key": "03",
            "value": "民主党派"
        }, {
            "key": "04",
            "value": "无党派"
        }, {
            "key": "05",
            "value": "其他"
        }];
        $("#politicationName").val(politication[0].value);
        $.each(politication, function (index, d) {
            $("#politication").append('<option value="' + d.key + '">' + d.value + '</option>');
        });
        $('#politication').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(politication, function (index, d) {
                if (d.key == option.selected) {
                    $("#politicationName").val(d.value);
                }
            });
        });
    }

    /**
     * 户口类别
     */
    function initHousehold(household) {
        $("#householdName").val(household[0].DIC_NAME);
        $.each(household, function (index, d) {
            $("#household").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#household').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(household, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#householdName").val(d.DIC_NAME);
                }
            });
        });
    }

    /** 
     * 数据字典下拉框初始化
    */
    function initPopulationSlelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            var dics = ['population_house_hold'];
            ajax.post('dic/info/findItemsBatch', dics, function (response) {
                var result = response.data;           
                $.each(dics, function (index, data) {
                    if (!$.isEmpty(result[data])) {
                        if (data == 'population_house_hold') {
                            initHousehold(result[data])
                        }
                    }
                });
            });

        });
    }

    /**
     * 住所类别
     */
    function initDomicile() {
        var domicile = [{
            "key": "01",
            "value": "居民家中"
        }, {
            "key": "02",
            "value": "单位内部"
        }, {
            "key": "03",
            "value": "工地现场"
        }, {
            "key": "04",
            "value": "租赁房屋"
        }, {
            "key": "05",
            "value": "自购房"
        }, {
            "key": "06",
            "value": "其他"
        }];

        $("#domicileName").val(domicile[0].value);
        $.each(domicile, function (index, d) {
            $("#domicile").append('<option value="' + d.key + '">' + d.value + '</option>');
        });
        $('#domicile').chosen({
            allow_single_deselect: true,
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(domicile, function (index, d) {
                if (d.key == option.selected) {
                    $("#domicileName").val(d.value);
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
            type: 'date',
            max: new Date().toTimeString(),
            format: 'yyyy-MM-dd'
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
            ajax.post('population/info/save', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('保存人口信息成功', './index.html');
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
            ajax.post('population/info/update', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('更新人口信息成功', './index.html');
                }
            });

        });
    }

    exports.queryGeometry = function (result, isSave) {
        isSave = isSave;
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
                    var params = $.formToJson($("#populationForm").serialize());
                    params.house = getHouse();
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

    function initFloorInfo(floor) {
        if (!$.isEmptyObject(floor)) {
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
                    if (option.selected == data.id) {
                        $('#floorNo').val(data.no);
                    }
                });
            });
        }
    }

    exports.initStructureInfo = function (structure) {
        if (!$.isEmpty(structure)) {
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


    exports.initCompanyInfo = function (company) {
        $('#unitId').val(company.id);
        $('#unitName').val(company.name);
    }

    exports.initHouseInfo = function (houses) {
        var house_template = '<tr>' +
            '<td>' +
            '<input type="checkbox" class="xcheckgroup2 checkItem" name="chk" value="{{id}}">' +
            '</td>' +
            '<td>' +
            '{{no}}' +
            '</td>' +
            '<td>' +
            '{{area}}' +
            '</td>' +
            '<td>' +
            '{{categoryName}}' +
            '</td>' +
            '<td>' +
            '{{address}}' +
            '</td>' +
            '</tr>';
        if (!$.isEmpty(houses)) {
            var template = Handlebars.compile(house_template);
            $('#house_tableView').append(template(houses));
        }
    }

    exports.setHouse = function (houses) {
        if(!$.isEmpty(houses) && !$.isEmptyObject(houses)){
            var tp = this;
            $.each(houses,function(index,data){
                tp.initHouseInfo(data);
            });
        }
    }

    function getHouse() {
        var house = [];
        $('#house_tableView tr').each(function () {
            var sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
            house.push({
                id: sel.val()
            });
        });
        return house;
    }

    function initHouseActions() {
        $('#house_add').on('click', function () {
            //弹出一个iframe层
            layer.open({
                type: 2,
                title: '房屋信息查询',
                maxmin: false,
                shadeClose: true, //点击遮罩关闭层
                area: ['1000px', '600px'],
                content: '../house/choice.html'
            });
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
                $.showErrorInfo('未选中房屋信息');
            } else {
                $('#house_tableView tr').each(function () {
                    sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
                    if (sel.is(':checked')) {
                        $(this).remove();
                    }
                });
            }
        });
    }

    exports.initValidation = function () {
        //表单验证
        $("#populationForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                name: {
                    required: true,
                    maxlength: 32
                },
                age: {
                    required: true,
                    isAge: true
                },
                addressShow: {
                    required: true,
                    maxlength: 1024
                },
                cardNumber: {
                    required: true
                    // cardCheck: true
                },
                structureNo: {
                    required: true
                },
                floorId: {
                    required: true
                },
                nativePlace: {
                    maxlength: 32
                },
                telephone: {
                    maxlength: 32
                }
            },
            messages: {}
        });
        initDownload();

        initYearWidget('birthDate');
        initNation();
        initEducation();
        initPolitication();

        initDomicile();
        initSex();
        initHouseActions();
        initPopulationSlelect();

        //建筑物选择
        $('#structureNo').on('click', function () {
            //弹出一个iframe层
            layer.open({
                type: 2,
                title: '建筑物信息查询',
                maxmin: false,
                shadeClose: true, //点击遮罩关闭层
                area: ['800px', '550px'],
                content: '../structure/choice.html'
            });
        });

        //单位物选择
        $('#unitName').on('click', function () {
            //弹出一个iframe层
            layer.open({
                type: 2,
                title: '单位信息查询',
                maxmin: false,
                shadeClose: true, //点击遮罩关闭层
                area: ['800px', '550px'],
                content: '../company/choice.html'
            });
        });

        window.initStructureInfo = this.initStructureInfo;
        window.initCompanyInfo = this.initCompanyInfo;
        window.initHouseInfo = this.initHouseInfo;

        check = $.XCheck({
            groupClass: ".xcheckgroup2"
        });

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