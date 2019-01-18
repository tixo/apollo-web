define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
    
    exports.initValidation = function (icon, httpUrl) {
        $('#pageClose').on('click', function () {
           
            window.location.href = './index.html';
        });
       
        //表单验证
        $("#dicForm").validate({
            debug: false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules: {
                dicIdent: {
                    required: true,
                    maxlength: 32,
                    remote:{
                        type:"POST",  
                        cache: false,
                        headers: top.authorization,                        
                        url: top.fhzxApolloApi+"/dictionary/info/remoteValidate", //请求地址  
                        data:{
                            dicIdent:function(){
                                return $('#dicIdent').val();
                            },
                            categoryId:function(){
                                return $.zui.store.get('pid');
                            }
                        }
                    }  
                },
                dicName: {
                    required: true,
                    maxlength: 32
                },
                sortting: {
                    isAge: true
                },                
                dicDesc: {
                    maxlength: 512
                }
            },
            messages: {
                dicIdent: {
                    required: "字典code不能为空！",
                    remote: "字典code重复！"
                },
               
                dicName: {
                    required: "字典名称不能为空！",
                }
               
            }
        });

    }

    var dicTreeData =[];
   
    //获取字典树结构数据
    function getTreeData() {
        var id = $.zui.store.get('pid');
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("dicCategory/info/findDictionaryTree/"+id, {}, function (response) {
                var result = response.data;
                if(result.code > 0 && !$.isEmptyObject(result.data)){
                    $("#parentIdName").val(result.data[0].name);
                    $("#parentIdent").val(result.data[0].id);
                }
            });
        });
    }
    getTreeData();

    var setting_tree = {
        check : {
            enable : true,
            chkStyle : "radio",
            radioType : "all"
        },
        data : {
            simpleData : {
                enable : true,
                rootPid : 0
            }
        },
        callback : {
            onCheck : zTreeOnCheck,
            onClick : zTreeOnClick
        }
    };

    function init_tree(data) {
        createTree();
        var ztree = $.fn.zTree.init($("#dropdown-menu-tree-fun"), setting_tree,
                data);
        // 选中某个节点
        var id = $("#parentIdent").val();
        var nodes = ztree.getNodeByParam("id", id, null);
        if (null != nodes) {
            nodes.checked = true;
            var name = nodes.name;
            $("#parentIdName").val(name);
        }
    }

    // $('#parentIdName').on('click',function() {
    //     var obj = document.getElementById("parentIdName");
    //     init_tree(dicTreeData);
    //     var input = $("#parentIdName");
    //     var width = input.outerWidth();
    //     var pos = GetObjPos(obj);
    //     //初始化之後 ztree樹自動展開
    //     var treeObj = $.fn.zTree.getZTreeObj("dropdown-menu-tree-fun");
    //     treeObj.expandAll(true);
    //     //初始化树
    //     if(null != obj){
    //         $('#dropdown-menu-display').css('left', pos.x + 'px').css('top',
    //                 pos.y + 'px').css('width', width - 2 + 'px');
    //         //ztree樹div
    //         $("#dropdown-menu-display").slideToggle(1);
    //     }
    // });


    // 树选中事件
    function zTreeOnCheck(event, treeId, treeNode) {
        var id = treeNode.id;
        var name = treeNode.name;
        $("#parentIdent").val(id);
        $("#parentIdName").val(name);
        $("#dropdown-menu-display").hide();
    };

    function zTreeOnClick(event, treeId, treeNode){
        if(treeNode.nocheck == false){
            zTreeOnCheck(event, treeId, treeNode);
        }
    }

    //创建树的显示
    function createTree() {
        var temp = document.getElementById("dropdown-menu-display");
        if (null == temp) {
            var dom = document.body;
            var div = document.createElement("div");
            div.id = "dropdown-menu-display";
            div.className = "dropdown-menu";
            var ul = document.createElement("ul");
            ul.id = "dropdown-menu-tree-fun";
            ul.className = "ztree";
            div.appendChild(ul);
            dom.appendChild(div);
        }
    };

    function CPos(x, y) {
        this.x = x;
        this.y = y;
    }
    //获取目标元素的位置
    function GetObjPos(ATarget) {
        var target = ATarget;
        var pos = new CPos(target.offsetLeft, target.offsetTop);
        var target = target.offsetParent;
        while (target) {
            pos.x += target.offsetLeft;
            pos.y += target.offsetTop;
            target = target.offsetParent
        }
        var input = $("#parentIdName");
        var height = input.outerHeight();
        pos.y = pos.y + height;
        return pos;
    }

    //点击其他位置让下拉框div收起
    $(document).on("click", function(e) {
        var ele = e ? e.target : window.event.srcElement;
        var id = $(ele).attr("id");
        if(id !== 'dropdown-menu-display'){
            id = $($(ele).parents("div")[0]).attr("id");
        }
        if (id !== 'dropdown-menu-display' && ele.id !== 'parentIdName') {
            $("#dropdown-menu-display").slideUp(1);
        }
    });

})