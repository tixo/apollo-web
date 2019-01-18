define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    

    exports.initValidation = function () {
        $('#pageClose').on('click', function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#menuForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                name: {
                    required: true,
                    maxlength: 32
                },
                type: {
                    required: true
                },
                sort: {
                    required: true,
                    digits:true
                },
                resKey: {
                    remote:{  
                        type:"POST",  
                        cache: false,
                        headers: top.authorization,                        
                        url: top.fhzxApolloApi+"/menu/info/remoteValidate", //请求地址  
                        data:{}  
                    }
                  
                }
            },
            messages: {
                type: {
                    required: "菜单类型不能为空！"
                },
                name: {
                    required: "菜单姓名不能为空！"
                },
                sort: {
                    required: "菜单排序不能为空！"
                },
                resKey: {
                    remote:   "菜单标识已存在!"
                }
            }
        });
        }
        
    var parentId = '';
    //初始化下拉框
    function initMenuSelect() {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("menu/info/findAllMenu", [], function (response) {
                var result = response.data;
                $.each(result, function (index, d) {
                    $("#menu").append('<option value="' + d.id + '">' + d.name + '</option>');
                });
                var id = $.getParam('id');
                
                if(id != null){
                    ajax.post('menu/info/findByPrimaryKey/'+id, [], function (response) {
                        var result = response.data;
                        if(result.code>0){
                            var parentId = result.data.parentId;
                            chose_mult_set_ini(parentId);
                        }
                        initMenuChosen();
                    });
                }else{
                    initMenuChosen();
                }
            });        
        });
    }
    initMenuSelect();

    //初始化chosen控件
    function initMenuChosen(){
        $("#menu").chosen({
            disable_search_threshold: 10,
            no_results_text: "没有找到",
            width: "640px"
        }).on('change', function (evt, option) {
            if($.isEmptyObject(option)){
                parentId = '';
            }else{
                
                //选中
                if(!$.isEmptyObject(option.selected)){
                    if($.isEmptyObject(option)){
                        parentId = '';
                    }
                    parentId=option.selected;
                }
               
            }
        });
    }


    // select 数据初始化(回显)
    function chose_mult_set_ini(parentId) { 
        parentId=parentId;
 
        $("#menu option[value='" + parentId + "']").attr('selected', 'selected');
        
        $('#menu').trigger("liszt:updated");
    }

    
    

        
    
})