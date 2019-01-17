define(function (require, exports, module) {
    var $iframe = $('#ineterestRender');
    require('utilityForm');
    var ajax = require('../app/common/ajax');

    var seelctedNode = {};

    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: clickSelect
        }
    };

    var zNodes = [];
    /**
     * 加载对应大类页面
     * 
     * @param {字典值} dic 
     */
    function loadRight(request, selectedId) {
        var url = '';
        if (!$.isEmptyObject(request)) {
            url = top.frontHttpUrl + request;
            if (!$.isEmptyObject(selectedId)) {
                window.selectedId = selectedId;
                url = url + '?id=' + selectedId
            }

            console.log(url);
            $iframe.attr('src', url);
        }
    }

    function switchPage() {

    }

    function clickSelect(event, treeId, treeNode, clickFlag) {
        seelctedNode = treeNode;
        console.log(treeNode);
        //根节点选中 分页查询全部分组
        if (treeNode.id == 0) {
            loadRight('scheduling/force/group/index.html');
        } else {
            // 查询分组详情信息
            loadRight('scheduling/force/member/detail.html',treeNode.id);
        }
    }
    //模块默认初始化方法
    function initialization() {
        ajax.post('force/info/findGroupTree', {

        }, function (response) {
            var result = response.data;
            result.push({
                id: 0,
                name: "全部分组",
                open: true
            });

            zNodes = result;
            // 仅支持两级树结构
            $.fn.zTree.init($("#myTree"), setting, result);
            selectTree();
            loadRight('scheduling/force/group/index.html');
            window.refreshZtree = refreshAddZtree;
            window.getSlectedNode = getSlectedNode;
        });
    }
    initialization();

    function selectTree() {
        var zTree = $.fn.zTree.getZTreeObj("myTree");
        nodes = zTree.getNodes();
        zTree.selectNode(nodes[0], false, false);
    }

    function refreshAddZtree() {
        initialization();

        selectTree();
    }

    function getSlectedNode(){
        return seelctedNode;
    }

    function isIE() {
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (window.navigator.appName == "Microsoft Internet Explorer") {
            try {
                var version = userAgent.match(/msie ([\d.]+)/)[1];
                if (isNaN(version) == false)
                    return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    function changeFrameHeight() {
        var ifm = document.getElementById("ineterestRender");
        ifm.height = document.documentElement.clientHeight;
    }

    window.onresize = function () {
        changeFrameHeight();
    }

    //iframe加载完成后你需要进行的操作 
    if (isIE) {
        //IE浏览器
        $iframe[0].onload = function () {
            changeFrameHeight()
        }
    } else {
        $iframe[0].addEventListener('onload', function () {
            changeFrameHeight()
        });
    }
})