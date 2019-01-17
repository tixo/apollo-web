/**
 * 图层管理
 * Created by ljb 2017/12/25.
 */
define(function(require, exports, module) {

    var map = null;
    var layer = null;
    var url = null;
    var tempLayerID = null,
        url =services.queryThemeLayerUrl;
// 获取子图层状态信息
    function getLayersInfo() {
        var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(url);
        getLayersInfoService.events.on({ "processCompleted": getLayersInfoCompleted});
        getLayersInfoService.processAsync();
    }

//与服务器交互成功，得到子图层信息
    function getLayersInfoCompleted(getLayersInfoEventArgs) {
        if (getLayersInfoEventArgs.result) {
            {
                handleTreeData(getLayersInfoEventArgs.result.subLayers.layers,1);
               showWindow();
                $.fn.zTree.init($("#tree"), setting, treeNodes);
            }
        }
        createTempLayer();

    }
//图层组控制菜单的配置
    var setting = {
        view: {
            dblClickExpand: false,
            showLine: false,
            showIcon: true,
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable:true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: "0"
            }
        },
        callback: {
            beforeClick: function(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("tree");
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                    return false;
                }
            },
            onCheck: setLayerStatus
        }
    };

    var treeNodes = [];
    var layerID = 0;
//处理layers中的子图层信息为 ztree所需的数据格式
    function handleTreeData(layers){
        var length = layers.length;
        for(var i = 0; i<length; i++){
            var node = {};
            node.id = i+1;
            node.pId = 0 ;
            node.name = layers[i].caption;
            node.open = true;
            node.isChild = false;
            node.iconOpen="mymap/module/plugins/zTree/css/zTreeStyle/img/diy/1_open.png";
            node.iconClose="mymap/module/plugins/zTree/css/zTreeStyle/img/diy/1_close.png";
            //if(layers[i].visible){
            //    node.checked = true;
            //}
            node.checked = false;
            treeNodes.push(node);

            if(layers[i].subLayers.layers && layers[i].subLayers.layers.length>0){
                for(var j = 0; j< layers[i].subLayers.layers.length; j++){
                    var node = {};
                    node.id = (i+1)*10 + j;
                    node.pId = i+1 ;
                    node.name = layers[i].subLayers.layers[j].caption;
                    node.isChild = true;
                    node.layerID = j;
                    layerID++;
                    node.icon="mymap/module/plugins/zTree/css/zTreeStyle/img/diy/2.png";
                    //if(layers[i].subLayers.layers[j].visible){
                    //    node.checked = true;
                    //}
                    node.checked = false;
                    treeNodes.push(node);
                }
            }
        }

    }

//创建临时图层来初始化当前地图显示
    function createTempLayer() {
//子图层控制参数必设：url、mapName、SetLayerStatusParameters
        var layerStatusParameters = new SuperMap.REST.SetLayerStatusParameters();
        layerStatusParameters = getLayerStatusList(layerStatusParameters);

        var setLayerStatusService = new SuperMap.REST.SetLayerStatusService(url);
        setLayerStatusService.events.on({ "processCompleted": createTempLayerCompleted});
        setLayerStatusService.events.on({ "processFailed": createTempLayerFailed});
        setLayerStatusService.processAsync(layerStatusParameters);
    }

//获取当前地图子图层状态信息
    function getLayerStatusList(parameters) {
        for(var i = 0; i<treeNodes.length; i++){
            if(treeNodes[i].isChild){
                var layerStatus = new SuperMap.REST.LayerStatus();
                layerStatus.layerName = treeNodes[i].name;
                layerStatus.isVisible = false;
                parameters.layerStatusList.push(layerStatus);

            }
        }
//设置资源在服务端保存的时间，单位为分钟，默认为10
        parameters.holdTime = 30;
        return parameters;
    }

//与服务器交互成功，创建临时图层
    function createTempLayerCompleted(createTempLayerEventArgs) {
        tempLayerID = createTempLayerEventArgs.result.newResourceID;
//创建地图控件
        map =window.map;

//创建 TiledDynamicRESTLayer
        layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, 
        			{transparent: true, cacheEnabled: false, redirect: true, layersID: tempLayerID}, 
        			{maxResolution: "auto", bufferImgCount: 0,useCanvas:false,useCORS:true,}
        		);
        layer.bufferImgCount = 0;
        layer.events.on({"layerInitialized": addLayer});
    }

//显示错误信息
    function createTempLayerFailed(result){
        alert(result.error.errorMsg);
    }

    function addLayer() {
        //var center = new SuperMap.LonLat(117, 40);
        checkAll(false);//默认全部图层不勾选图层
        //checkLayersByNmae(["管线缓存"],true)
        map.addLayers([layer]);


        //map.setCenter(center, 0);
    }

//通过子图层layersID可见性控制
    function setLayerStatus() {
        var zTree = $.fn.zTree.getZTreeObj("tree"),
            checkCount = zTree.getCheckedNodes(true);
        var checkLength = checkCount.length;

//通过layersID 控制图层的显示和隐藏 目前iserver还有问题
        var str = "[0:";
        for(var i = 0; i<checkLength; i++){
            if(checkCount[i].isChild){
                if(i<checkLength){
                    str += (checkCount[i].pId -1).toString() +"."+ checkCount[i].layerID.toString();
                }
                if(i<(checkLength -1)){
                    str += ",";
                }
            }
        }

        str += "]";
//当所有图层都不可见时
        if(str.length<5)
        {
            str = "[]";
        }
        layer.params.layersID = str;
        layer.redraw();
    }

     function showWindow() {
       var str = "";
     str += '<div class="winTitle"  <span class="title_left">图层管理</span></div>'; //标题栏

     str += '<div class="winContent" style="overflow-y:auto;height:440px;">';
     str += '<ul id="tree" class="ztree"></ul>';
     str += '</div>';
     $("#popupWin").html(str);
     document.getElementById("popupWin").style.width = "220px";
     document.getElementById("popupWin").style.height = "472px";
     }

    function show(){
        $("#popupWin").css("display", "block");
    }
    function hide(){
        $("#popupWin").css("display", "none");
    }
    function checkAll(bool){
        var zTree = $.fn.zTree.getZTreeObj("tree")
        zTree.checkAllNodes(bool);
        setLayerStatus();
    }

    /*
     //window.pluginsAPI.layermanger.checkLayersByNmae(["病害体","管线"],true)
     //window.pluginsAPI.layermanger.checkLayersByNmae(["病害体"],false)
     */
    /**
     *
     * @param value 图层名称 数组
     * @param bool  图层是否打开
     */
    function checkLayersByNmae(values,bool)
    {
        var zTree = $.fn.zTree.getZTreeObj("tree")
        var node=[];
        for(i=0;i<values.length;i++)
        {
            node[i]=zTree.getNodeByParam("name", values[i]);
            zTree.checkNode(node[i], bool, true);
        }

        setLayerStatus();
    }


    //对外封装接口
    var layermanger = {
        getLayersInfo:getLayersInfo,
        show:show,
        hide:hide,
        checkLayersByNmae:checkLayersByNmae,
        checkAll:checkAll

    }
    module.exports = layermanger;
});