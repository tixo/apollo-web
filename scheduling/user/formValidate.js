define(['validate','validation','localization', 'utilityForm'], function (require, exports, module) {
    function setheaders(request) {
        if(!$.isEmptyObject(top.authorization)){
            request.setRequestHeader("userId", top.authorization.userId);
            request.setRequestHeader("userToken", top.authorization.userToken);
        }
    }

    exports.initValidation = function (photo,httpUrl) {
        $('#pageClose').on('click',function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#userForm").validate({
            debug:false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules:{
                loginName:{  
                    required:true,   
                    remote:{  
                        type: "POST",
                        cache: false,
                        headers: top.authorization,  
                        url: top.fhzxApolloApi + "user/info/remoteValidate", //请求地址  
                        beforeSend: function(request) {
                            setheaders(request);
                        },
                        data:{}  
                    }  
                },
                name: {
                    required: true,
                    maxlength: 255
                }
            },
            messages: {
                loginName:{  
                    required:"用户名必填",  
                    remote:"用户名已存在"  
                },name: {
                    required: "名称不能为空！"
                }
            } 
         });
         var showFiles = [];
        if(!$.isEmpty(photo)){
            showFiles.push({
                type: 'image/jpg',
                name: httpUrl+photo,
                url: httpUrl+photo
            });
        }

        $('#uploaderPhoto').uploader({
            url: top.fhzxApolloApi + '/user/info/upload',
            limitFilesCount: 1,
            headers:top.authorization,
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
                    $('#photo').val(response.data);
                } else {
                    return response.message;
                }
            }
        });
    }
    
    var roleList = [];
    //初始化角色下拉框
    function initRoleSelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("user/info/findAllRole", [], function (response) {
                $("#role").html('');
                var result = response.data;
                $.each(result, function (index, d) {
                    $("#role").append('<option value="' + d.id + '">' + d.name + '</option>');
                });
                var id = $.getParam('id');
                if(id != null){
                    ajax.post('user/info/findByPrimaryKey/'+id, [], function (response) {
                        var result = response.data;
                        if(result.code>0){
                            var role = result.data.roleList;
                            chose_mult_set_ini(role);
                        }
                        initRoleChosen();
                    });
                }else{
                    initRoleChosen();
                }
            });        
        });
    }

    initRoleSelect();

    //初始化chosen控件
    function initRoleChosen(){
        $("#role").chosen({
            disable_search_threshold: 10,
            no_results_text: "没有找到",
            width: "640px"
        }).on('change', function (evt, option) {
            if($.isEmptyObject(option)){
                roleList = [];
            }else{
                //console.log(option);
                //选中
                if(!$.isEmptyObject(option.selected)){
                    if(!$.isArray(roleList) || $.isEmptyObject(option)){
                        roleList = [];
                    }
                    roleParam=$.unique($.merge(roleList, [option.selected]));
                }
                //取消选中 
                if(!$.isEmptyObject(option.deselected)){
                    var itemIndex = $.inArray(option.deselected,roleList);
                    if(-1 != itemIndex){
                    roleList.splice(itemIndex, 1);
                    }
                }
            }
        });
    }

    // 多选 select 数据初始化(回显)
    function chose_mult_set_ini(data) {
        $.each(data,function(index,role){
            roleList.push(role.id);
        });
        
        var length = roleList.length;
        var value = '';
        for (i = 0; i < length; i++) {
            value = roleList[i];
            $("#role option[value='" + value + "']").attr('selected', 'selected');
        }
        $('#role').trigger("liszt:updated");
    }

    //把选中的角色封装到params中
    exports.getParams = function (params) {
        params.roleList = [];
        $.each(roleList,function(index,data){
            var role = {
                id:data
            }
            params.roleList.push(role);
        });
    }

})