define(['validate','validation','localization', 'utilityForm'], function (require, exports, module) {

    function setheaders(request) {
        if(!$.isEmptyObject(top.authorization)){
            request.setRequestHeader("userId", top.authorization.userId);
            request.setRequestHeader("userToken", top.authorization.userToken);
        }
    }
    exports.initValidation = function () {
        
        $('#pageClose').on('click',function () {
            window.location.href = './index.html';
        });
        //表单验证
        $("#roleForm").validate({
            debug:false, //调试模式，即使验证成功也不会跳转到目标页面
            focusInvalid: false, //当为false时，验证无效时，没有焦点响应  
            onkeyup: false,
            errorClass: "alert alert-danger",
            rules:{
                indent: {
                    required: true,
                    maxlength: 32,
                    remote:{  
                        type: "POST",
                        cache: false,
                        headers: top.authorization,  
                        url: top.fhzxApolloApi + "role/info/remoteValidate", //请求地址  
                        beforeSend: function(request) {
                            setheaders(request);
                        },
                        data:{}  
                    }  
                },
                name: {
                    required: true,
                    maxlength: 32
                },
                remark: {
                    maxlength: 256
                }
            },
            messages: {
                indent: {
                    required: "角色标识不能为空！",
                    remote: "角色标识已存在！"
                },name: {
                    required: "角色名称不能为空！"
                }
            } 
         });
    }
    
    //ztree初始化参数
    var setting = {
        check : {
            enable : true,
            chkStyle : "checkbox",
            radioType : "all"
        },
        data: {
            simpleData : {
				idKey : "id", //主键id
				pIdKey : "parentId",
				name : "name",
				enable : true
			}
        },
        callback: {
            onClick: clickSelect,
            onCheck: zTreeOnCheck
        }
    };

    //ztree初始化方法
    function initTree(){
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('role/info/findAllMenu', {}, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.fn.zTree.init($("#treeDemo"), setting, result);
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    treeObj.expandAll(true);
                    var id = $.getParam('id');
                    if(id != null){
                        var checkMenu = $.zui.store.get("checkMenu");
                        for(var i=0;i<checkMenu.length;i++){
                            var nodes = treeObj.getNodesByParam("id", checkMenu[i], null);
                            treeObj.checkNode(nodes[0],true,false,false);
                        }
                    }else{
                        for(var i = 0; i<result.length;i++){
                            $.zui.store.set(result[i].id,[]);
                        }
                    }
                }
            });         
        });
    }
    initTree();

    //ztree点击树节点绑定事件
    function clickSelect(event, treeId, treeNode, clickFlag) {
        var dom = document.getElementById("buttonArea");
        dom.innerHTML = "";
        var action = treeNode.action;
        if(action.length>0){
            var div = document.createElement("div");
            div.style = "margin-top:3px";
            var span = document.createElement("span");
            span.textContent = treeNode.name;
            span.style = "font-size:12px";
            div.appendChild(span);
            dom.appendChild(div);
            var ul = document.createElement("ul");
            var result = $.zui.store.get(treeNode.id);
            for(var i = 0 ; i < action.length ; i++){
                var li = document.createElement("li");
                var button = document.createElement("input");
                button.type = "checkbox";
                button.id = action[i].id;
                button.mid = treeNode.id;
                var index = $.inArray(action[i].id, result);
                if(-1 != index){
                    button.checked = true;
                }
                button.style = "margin-left:5px";
                var span = document.createElement("span");
                span.textContent = action[i].name;
                span.style = "font-size:12px";
                li.appendChild(button);
                li.appendChild(span);
                ul.appendChild(li);
            }
            dom.appendChild(ul);
        }
    }

    //ztree点击checkbox绑定事件
    function zTreeOnCheck(event, treeId, treeNode){
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var CheckedNodes = treeObj.getCheckedNodes(true);
        var checkMenu = [];
        for(var i = 0;i<CheckedNodes.length;i++){
            checkMenu.push(CheckedNodes[i].id);
        }
        $.zui.store.set("checkMenu",checkMenu);
    }

    //给复选框绑定事件，每次勾选时 把结果存储到store中
    $(document).on('click','input[type="checkbox"]',function (dom){
        var checkbox = dom.currentTarget;
        var menuId = $(checkbox).prop("mid");
        var actionId = $(checkbox).attr("id");
        var flag = $(checkbox).prop("checked");
        var result = $.zui.store.get(menuId);
        if(!result){
            result = [];
        }
        if(flag){
            //选中
            result.push(actionId);
            result = $.unique(result);
            $.zui.store.set(menuId, result);
        }else{
            //删除选中
            var index = $.inArray(actionId, result);
            if (-1 != index) {
                result.splice(index, 1);
                $.zui.store.set(menuId, result);
            }
        }
    });
})