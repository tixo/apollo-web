define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {

    exports.initValidation = function (photo, httpUrl) {
        $('#pageClose').on('click', function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#sysForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                appNo: {
                    required: true,
                    maxlength: 64
                },
                name: {
                    required: true,
                    maxlength: 128
                },
                icon: {
                    maxlength: 64
                },
                sysColor: {
                    maxlength: 128
                },
                sysIndex: {
                    required: true,
                    maxlength: 500
                },
                sysOrder: {
                    maxlength: 64,
                    digits: true
                },
            },
            messages: {
                appNo: {
                    required: "系统应用编号不能为空！"
                },
                name: {
                    required: "系统应用名称不能为空！"
                },
                sysIndex: {
                    required: "主页地址不能为空！"
                },
                sysOrder: {
                    digits: "只能输入数字！"
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

        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/police/info/upload',
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
            staticFiles: showFiles,
            responseHandler: function (responseObject, file) {
                var response = JSON.parse(responseObject.response);
                // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
                if (1 == response.code) {
                    $('#icon').val(response.data);
                } else {
                    return response.message;
                }
            }
        });
    }



    var menuList = [];
    //初始化菜单下拉框
    function initMenuSelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("menu/info/findByCondition", {
                type: 0,
                isFrontShow: 1
            }, function (response) {
                var result = response.data;
                $.each(result, function (index, d) {
                    $("#menu").append('<option value="' + d.id + '">' + d.name + '</option>');
                });
                var id = $.getParam('id');

                if (id != null) {
                    ajax.post('sys/info/findByPrimaryKey/' + id, [], function (response) {
                        var result = response.data;
                        if (result.code > 0) {
                            var menu = result.data.menuList;
                            chose_mult_set_ini(menu);
                        }
                        initMenuChosen();
                    });
                } else {
                    initMenuChosen();
                }
            });
        });
    }
    initMenuSelect();

    //初始化chosen控件
    function initMenuChosen() {
        $("#menu").chosen({
            disable_search_threshold: 10,
            no_results_text: "没有找到",
            width: "640px"
        }).on('change', function (evt, option) {
            if ($.isEmptyObject(option)) {
                menuList = [];
            } else {
                //console.log(option);
                //选中
                if (!$.isEmptyObject(option.selected)) {
                    if (!$.isArray(menuList) || $.isEmptyObject(option)) {
                        menuList = [];
                    }
                    menuParam = $.unique($.merge(menuList, [option.selected]));
                }
                //取消选中 
                if (!$.isEmptyObject(option.deselected)) {
                    var itemIndex = $.inArray(option.deselected, menuList);
                    if (-1 != itemIndex) {
                        menuList.splice(itemIndex, 1);
                    }
                }
            }
        });
    }

    // 多选 select 数据初始化(回显)
    function chose_mult_set_ini(data) {
        $.each(data, function (index, menu) {
            menuList.push(menu.id);
        });

        var length = menuList.length;
        var value = '';
        for (i = 0; i < length; i++) {
            value = menuList[i];
            $("#menu option[value='" + value + "']").attr('selected', 'selected');
        }
        $('#menu').trigger("liszt:updated");
    }

    //把选中的角色封装到params中
    exports.getParams = function (params) {
        params.menuList = [];
        $.each(menuList, function (index, data) {
            var menu = {
                id: data
            }
            params.menuList.push(menu);
        });
    }
})