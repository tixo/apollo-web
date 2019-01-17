define(function(require, exports, module) {
	var ajax = require("../../../scheduling/app/common/ajax.js");
	var _jk = require('../../../config/common/utils.js');
	var historyCamera = require('../../../config/common/camera/js/historyCamera.js');
	// zTree 参数配置，
	var setting = {
		check: {
			enable: true, //显示复选框
            chkboxType:  { "Y": "", "N": "" },
            chkStyle: "radio",  //单选框
            radioType: "all"   //对所有节点设置单选
		},
		data:{
	            simpleData : {
					enable : true
				}
       		},
		callback: {
			beforeClick: function(treeId, treeNodes) {
				//用于捕获 勾选 或 取消勾选 之前的事件回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选
			},
			onClick: onClick,
			onCheck: function(event, treeId, treeNodes) {
				return true;
			},
			onExpand: function(event, treeId, treeNodes) {
			}
		}
	};
	$(document).ready(function() {
	    historyCamera.videoClick();
	    //摄像头列表
	    findCamera()
	    _jk.initTime("inputSearch");
	});
	var zNodes;
	var axis = {axis:"yx",scrollButtons:{enable:true},theme:"3d"};
	function findCamera(){
		ajax.post("/api/right/findCamera",{},function(response){
			var data = response.data.data;
        	data.splice(1,1);
			data.splice(1,1);
			$.fn.zTree.init($("#video-Address"), setting,data);
			zNodes = data;
			setting.check.enable=false;
			$.fn.zTree.init($("#video-list-now"), setting,data);
			$("#treeScrollbar-now").mCustomScrollbar(axis);
			$("#treeScrollbar").mCustomScrollbar(axis);
			$("#radioAddress").mCustomScrollbar(axis);
 		},processFailed);
	}
	function onClick(event, treeId, treeNode){
		if(treeId=="video-Address"){
			return;
		}
		$.showSuccessTipAndGo("视频加载中请稍等！");
		var id = $(".checkbox-video")[0].id;
		window.clearIntervalCameraFunOne(id);
		if(treeNode.icon!=undefined){
			if(!$.isEmptyObject(treeNode.cameraIndex)){
				var url = window.getCameraBatchUrl(treeNode);
				$("#videoIframe"+id)[0].contentWindow.window.openStream(treeNode.cameraIndex,url,2,id);
	    		//加载视频流
	    	}else{
	    		$.showErrorInfo("没有对应的视频信息！");
	    	}
		}
	}
	var nodeList=[],ztreeId="";
	///根据文本框的关键词输入情况自动匹配树内节点 进行模糊查找 车辆
	function autoMatch(ztreeIdParam) {
		if("video-Address"==ztreeIdParam){
			setting.check.enable=true;
		}
		ztreeId = ztreeIdParam;
		var value = $("#"+ztreeIdParam+"Seach").val();
	    if (value.length > 0) {
	        var zTree = $.fn.zTree.getZTreeObj(ztreeId);
	        nodeList = zTree.getNodesByParamFuzzy("name", value);
	        updateNodes();
	    } else {
	        initialZtree();                
	    }              
	}
	//根据查询的结果更新ztree 车辆
	function updateNodes() {
	   var zTree = $.fn.zTree.getZTreeObj(ztreeId);
	   var allNode = zTree.transformToArray(zTree.getNodes());
	   zTree.hideNodes(allNode);
	   for(var n in nodeList){
	      findParent(zTree,nodeList[n]);
	      zTree.showNodes(nodeList[n].children);
	   }
	   zTree.showNodes(nodeList);
	}
	//根据查询的结果查找当前节点的父节点 车辆
	function findParent(zTree, node) {   
		zTree.expandNode(node, true, false, false);   
		var pNode = node.getParentNode();  
		if(pNode != null) {
			nodeList.push(pNode);    
			findParent(zTree, pNode);   
		}       
	}
	//还原zTree的初始数据 车辆
	function initialZtree() {
	    $.fn.zTree.init($("#"+ztreeId), setting, zNodes);
	}
	//加载刷新
	function flvLoad(iframeId){
		$("#"+iframeId)[0].contentWindow.flv_load();
	}
	//历史视频搜索
	function hisCameraSearch(){
		var treeObj = $.fn.zTree.getZTreeObj("video-Address");
        var nodes = treeObj.getChangeCheckedNodes();
        if(nodes.length==0 || nodes[0].icon==undefined){
        	$.showSuccessTipAndGo("请选择摄像头！");
        	return;
        }
		historyCamera.hisCameraSearch(nodes[0].cameraIndex,nodes[0].stage,nodes[0].cameraType);
	}
	//历史视频
	function hisCameraShow(){
		window.clearIntervalCameraFun();
		$("#history").show();
		$(".no").hide();
		$("#now").hide();
		$("iframe",document).each(function(index, e) {
	    	$("#"+e.id).attr('src', "../../config/common/camera/cell-his.html");
	    });
	    historyCamera.videoClick();
	}
	//实时视频
	function hisCameraHide(){
		$("#history").hide();
		$("#now").show();
		$(".no").show();
		$("iframe",document).each(function(index, e) {
	    	$("#"+e.id).attr('src', "../../config/common/camera/camera.html");
	    });
		historyCamera.videoClick();
	}
	//查询失败返回
	function processFailed(error){
    	console.log(error);
	}
    //对外封装接口
    var homeVideo = {
       autoMatch:autoMatch,
       flvLoad:flvLoad,
       hisCameraSearch:hisCameraSearch,
       hisCameraShow:hisCameraShow,
       hisCameraHide:hisCameraHide
    }

    module.exports = homeVideo;
});