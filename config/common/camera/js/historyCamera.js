define(function(require, exports, module) {
	//var ajax = require("../../../scheduling/app/common/ajax.js");
	// zTree 参数配置，
	var stageUrl="";
	var setting = {
		check: {
			enable: true, //显示复选框
			chkboxType: {"Y": "ps","N": "ps"}
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
		videoClick();
	    //摄像头列表
	    //findCamera()
	});
	var zNodes;
	var axis = {axis:"yx",scrollButtons:{enable:true},theme:"3d"};
	function videoClick(){
		setTimeout(function(){
		    $("iframe",document).each(function(index, e) {
	    		$("#"+e.id).contents().find("video").click(function(i) {
	           		$("#"+e.dataset.id).addClass('checkbox-video').siblings().removeClass('checkbox-video');
	            });
	    	});
    	},1000);
	}
	function onClick(event, treeId, treeNode){
		$.showSuccessTipAndGo("视频加载中请稍等！");
		var ticket = treeNode.av_ticket;
		openTicket(ticket,treeNode.av_path);
	}
	function openTicket(ticket,name){
		$.ajax({
		    url: stageUrl+"/stream?av_ticket="+ticket,
		    type: "GET",
		    dataType:"json",
		    success: function(response) {
		    	console.log(response);
		    	if(response.res_code==0){
		    		var id = $(".checkbox-video")[0].id;
		    		$("#videoIframe"+id)[0].contentWindow.window.start_stream(name, ticket, stageUrl, response.data);
		    	    $("#videoIframe"+id)[0].contentWindow.window.flv_live();
		    	}
		    }
		});
	}
	function hisCameraSearchD(){
		var $checkedObj = $("input[name='cameraName']:checked");
		var checkCameraIndex = $checkedObj.val();
		var stage = $checkedObj[0].dataset.stage;
		var cameraType  = $checkedObj[0].dataset.cameratype;
        hisCameraSearch(checkCameraIndex,stage,cameraType);
	}
	
	function hisCameraSearch(name,stage,cameraType){
		//开启加载动画
	    parent.parent.ui.openLoading();
	    var item = {"stage":stage,"cameraType":cameraType};
		var url = window.getCameraBatchUrl(item);
		stageUrl = url[0];
       	var time = $("#inputSearch").val();
       	var timeArray = time.split("~");
        var urlStr = url[0]+"/camera/his?av_path="+name+"&begin_time="+timeArray[0]+"000&end_time="+timeArray[1]+"000";
        $.ajax({
		    url: urlStr,
		    type: "GET",
		    dataType:"json",
		    success: function(response) {
		    	console.log(response);
		    	//关闭加载动画
				parent.parent.ui.closeLoading();
		    	if(response.res_code==0){
		    		//开启加载动画
	    			parent.parent.ui.openLoading();
		    		getList(url[0]);
		    	}else{
		    		$.showErrorInfo("获取历史视频失败！");
		    	}
		    }
		});
       
       }
    function getList(urlStage){
    	$.ajax({
		    url: urlStage+"/camera/his/list",
		    type: "GET",
		    dataType:"json",
		    success: function(response) {
		    	//关闭加载动画
				parent.parent.ui.closeLoading();
		    	console.log(response);
		    	var childrenArray = [];
				$.each(response.data.streams, function(j,obj) {
					//av_path  av_ticket  begin_time 
					obj.id = obj.av_path;
					if(obj.begin_time!=null&&obj.begin_time!=""){
						obj.name = obj.begin_time+"至"+obj.end_time;
						childrenArray.push(obj);
					}
				});
				var treeNodes = {"id":"parent1","pid":"0","name":"历史录像","open":true};
				treeNodes.children = childrenArray;
				setting.check.enable=false;
				$.fn.zTree.init($("#video-list"), setting,treeNodes);
				$("#treeScrollbar").mCustomScrollbar(axis);
    }
		    });
       
       }
	function hisSxtSeach() {
		var value = $("#sxtSeach").val();
	    if (value.length > 0) {
	        var zTree = $.fn.zTree.getZTreeObj("video-list");
	        nodeList = zTree.getNodesByParamFuzzy("name", value);
	        updateNodes();
	    } else {
	        initialZtree();                
	    }              
	}
	function flvLoad(iframeId){
		$("#"+iframeId)[0].contentWindow.flv_load();
	}
	//查询失败返回
	function processFailed(error){
    	console.log(error);
	}
    //对外封装接口
    var homeVideo = {
       flvLoad:flvLoad,
       hisCameraSearch:hisCameraSearch,
       videoClick:videoClick,
       hisCameraSearchD:hisCameraSearchD
    }

    module.exports = homeVideo;
});