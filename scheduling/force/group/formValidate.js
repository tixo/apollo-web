define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    var member_template_photo = '<tr>' +
    '<td>' +
    '<input type="checkbox" class="xcheckgroup2 checkItem" name="chk" value="{{policeId}}">' +
    '</td>' +
    '<td>' +
    '{{name}}' +
    '</td>' +
    '<td>' +
    '{{no}}' +
    '</td>' +
    '<td>' +
    '<img style="height:50px;width:60px;" src="{{photo}}" />' +
    '</td>' +
    '</tr>';
 
    var member_template_no_photo = '<tr>' +
    '<td>' +
    '<input type="checkbox" class="xcheckgroup2 checkItem" name="chk" value="{{policeId}}">' +
    '</td>' +
    '<td>' +
    '{{name}}' +
    '</td>' +
    '<td>' +
    '{{no}}' +
    '</td>' +
    '<td>' +
    '未上传' +
    '</td>' +
    '</tr>';

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

    exports.initMembers = function(selPolcies){
        console.log(selPolcies);
        $.each(selPolcies,function(index,data){
            var sel = {
                policeId: data.detail.id,
                no: data.no,
                name: data.name,
                deviceId: data.deviceId,
                deviceNo: data.deviceNo
            };

            // if(!$.isEmptyObject(data.id)){
            //     sel['id'] = data.id;
            // }
            if(!$.isEmptyObject(data.photo) && '未上传' != data.photo){
                sel.photo=data.photo;
                template = Handlebars.compile(member_template_photo);
            }else{
                template = Handlebars.compile(member_template_no_photo);
            }
            $('#member_tableView').append(template(sel));                         
        });
    }

    function initMemberActions(){
        $('#captainName').on('click', function () {
            //弹出一个iframe层
            layer.open({
                type: 2,
                title: '警员信息查询',
                maxmin: false,
                shadeClose: true, //点击遮罩关闭层
                area: ['800px', '550px'],
                content: '../captain.html'
            });
        });
        $('#member_add').on('click', function () {

            //弹出一个iframe层
            layer.open({
                type: 2,
                title: '警员信息查询',
                maxmin: false,
                shadeClose: true, //点击遮罩关闭层
                area: ['800px', '500px'],
                content: '../member.html',
                btnAlign: 'c',
                btn: ['添加', '取消'],
                yes: function(index, layero){
                    //do something
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    var selPolcies = iframeWin.table.getSelectionData();
                    if(!$.isEmpty(selPolcies)){
                        var template = null;
                        $.each(selPolcies,function(index,data){
                            var sel = {
                                policeId: data.id,
                                no: data.no,
                                name: data.name,
                                deviceId: data.deviceId,
                                deviceNo: data.deviceNo
                            };

                            if(!$.isEmptyObject(data.photo) && '未上传' != data.photo){
                                sel.photo=data.photo;
                                template = Handlebars.compile(member_template_photo);
                            }else{
                                template = Handlebars.compile(member_template_no_photo);
                            }
                            // 添加不存在的警员
                            if($.isEmptyObject($.zui.store.pageGet(data.id))){
                                $.zui.store.pageSet(data.id,sel);
                                $('#member_tableView').append(template(sel));
                                layer.closeAll();
                            }                          
                        });
                        
                    }
                    // layer.close(index);
                },
                btn2: function () {
                    layer.closeAll();
                }
            });

            // var template = Handlebars.compile(member_template);
            // $('#house_tableView').append(template({}));
            // initAutocomplete($('#house_tableView tr').last());
        });

        $('#member_delete').on('click', function () {
            var sel = null;
            var isCheck = false;
            $('#member_tableView tr').each(function () {
                sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
                if (sel.is(':checked')) {
                    isCheck = true;
                }
            });
            if (!isCheck) {
                $.showErrorInfo('未选中成员信息');
            } else {
                $('#member_tableView tr').each(function (index) {
                    sel = $($(this).children('td:eq(0)').children('input[type="checkbox"]'));
                    if (sel.is(':checked')) {
                        console.log(sel.val());
                        $(this).remove();
                        $.zui.store.pageRemove(sel.val());
                    }
                });
            }
        });
    }

    function initSlelect() {
        seajs.use('../../app/common/ajax', function (ajax) {
            var dics = ['duty_type'];
            ajax.post('dic/info/findItemsBatch', dics, function (response) {
                var result = response.data;
                console.log(result);
                $.each(dics, function (index, data) {
                    if (!$.isEmpty(result[data])) {
                        if (data == 'duty_type') {
                            initTask(result[data])
                        }                                                                                          
                    }
                });
            });

        });
    }

    function initTask(data){
        $("#taskName").val(data[0].DIC_NAME);
        $.each(data, function (index, d) {
            $("#taskType").append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
        });
        $('#taskType').chosen({
            allow_single_deselect: true, 
            no_results_text: '没有找到', // 当检索时没有找到匹配项时显示的提示文本
            disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
            search_contains: true // 从任意位置开始检索
        }).on('change', function (evt, option) {
            $.each(data, function (index, d) {
                if (d.DIC_IDENT == option.selected) {
                    $("#taskName").val(d.DIC_NAME);
                }
            });
        });
    }
    exports.initValidation = function (photo, httpUrl) {
        $('#pageClose').on('click', function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#groupForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                captainName: {
                    required: true,
                    maxlength: 64
                },
                name: {
                    required: true,
                    maxlength: 64
                }
            },
            messages: {
                captainName: {
                    required: "请点击选择组长！"
                },
                name: {
                    required: "分组名称不能为空！"
                }
            }
        });

        var showFiles = [];
        if (!$.isEmpty(photo)) {
            showFiles.push({
                type: 'image/jpg',
                name: httpUrl + photo,
                url: httpUrl + photo
            });
        }

        check = $.XCheck({
            groupClass: ".xcheckgroup2"
        });

        initMemberActions();
        initSlelect();
    }
})