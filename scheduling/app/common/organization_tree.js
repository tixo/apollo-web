    var orgTreeData =[];
   
    //获取组织机构树结构数据
    function getTreeData() {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("organization/info/findOrgTree", {}, function (response) {
                orgTreeData = response.data;
                //初始化单位下拉树
                init_tree(orgTreeData);
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
                idKey : "id", //主键id
                pIdKey : "parentId",
                name : "name",
                enable : true
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
        var orgKey = $("#unitId").val();
        var nodes = ztree.getNodeByParam("orgKey", orgKey, null);
        if (null != nodes) {
            nodes.checked = true;
            var name = nodes.name;
            $("#unit").val(name);
        }
    }

    
    $('#unit').on('click',function() {
        var obj = document.getElementById("unit");
        
        var input = $("#unit");
        var width = input.outerWidth();
        var height = input.outerHeight();
        var pos = GetObjPos(obj);
        //初始化之後 ztree樹自動展開
        var treeObj = $.fn.zTree.getZTreeObj("dropdown-menu-tree-fun");
        treeObj.expandAll(true);
        //初始化树
        if(null != obj){
            $('#dropdown-menu-display').css('left', pos.x + 'px').css('top',
                    pos.y + height + 'px').css('width', width - 2 + 'px');
            //ztree樹div
            $("#dropdown-menu-display").slideToggle(1);
        }
    });

    // 树选中事件
    function zTreeOnCheck(event, treeId, treeNode) {
        var id = treeNode.id;
        var key = treeNode.orgKey;
        var name = treeNode.name;
        findDepartment(id,"");
        $("#unit").val(name);
        $("#unitId").val(key);
        $("#dropdown-menu-display").hide();
    };

    function zTreeOnClick(event, treeId, treeNode){
        if(treeNode.nocheck == false){
            zTreeOnCheck(event, treeId, treeNode);
        }
    }

    //初始化部门下拉列表，如果有值就回显
    function findDepartment(id,val){
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post("organization/info/findByUnitId/"+id, {}, function (response) {
                var dept = response.data;
                $("#departmentId").html('');
                $.each(dept,function(index,obj){
                    $("#departmentId").append('<option value="' + obj.orgKey + '">' + obj.name + '</option>');
                });
                $("#departmentId option[value='"+val+"']").attr("selected","selected");
            });
        });
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
        if (id !== 'dropdown-menu-display' && ele.id !== 'unit') {
            $("#dropdown-menu-display").slideUp(1);
        }
    });