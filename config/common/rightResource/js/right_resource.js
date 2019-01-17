/**
 * 右侧资源公共js
 * @author zhangai
 */
define(function(require, exports, module) {
	var imgPath = services.frontHttpUrl+'config/common/rightResource/img/';
	var _bottom = "",_top = "";//右侧资源切换全局变量
	var policeResData = {};//警用资源添加时存数据   来删除标记点
	var XQDData = {};//警用资源添加时存数据   来删除标记点
	var _ajax = require('../../../../scheduling/app/common/ajax.js');
	var _jk = require('../../../../config/common/utils.js');
 	//重点人员
 	var keyPersonnel = require('../../../../config/common/rightResource/js/key_personnel.js');
 	var video = require('../../../../config/common/rightResource/js/video.js');
 	function initParam(mapEvent,sceneEvent,mapCut,mapTools){
 		rightResource.mapEvent = mapEvent;
		rightResource.sceneEvent = sceneEvent;
		rightResource.markerLayer = rightResource.mapEvent.mapInit.mapContent.markerLayer;
		rightResource.mapCut = mapCut;
		rightResource.mapTools = mapTools;
		keyPersonnel.initKeyPersonnel(rightResource.sceneEvent,setting);
		keyPersonnel.ztreeKeyPersonnel();
 	}
 	function initRightResource(mapEvent,sceneEvent,mapCut,mapTools) {
 		initParam(mapEvent,sceneEvent,mapCut,mapTools);
		initBind();
		video.initVideo(sceneEvent,mapEvent,mapCut);
		findResource();
	}
 	function initBind(){
		//右侧资源标签切换
		$(".police-select").each(function() {
			$(this).find("a").click(function() {
				var select = $(this).parents('.police-select');
				if(select.hasClass("dest")) {
					select.removeClass("dest").animate({
						right: -180
					}, 500);
					select.css({"top":_top+"px","z-index":"999"});
					//切换其它的
				} else if(select.siblings().hasClass("dest")) {
					var top = parseInt(select.css("top").replace("px",""));
					$(".dest").css({"top":_top+"px","z-index":"999"});
					_top = top;
					select.siblings().removeClass("dest").animate({
						right: -180
					}, 500);
					select.addClass("dest").animate({
						right: 0
					}, 500);
					_bottom = parseInt(select.css("bottom").replace("px",""));
					_top = parseInt(select.css("top").replace("px",""));
					if(_bottom<50){
						select.css({"top":(top+_bottom-50)+"px","z-index":"899"});
					}	
				} else {
					select.addClass("dest").animate({
						right: 0
					}, 500);
					_bottom = parseInt(select.css("bottom").replace("px",""));
					_top = parseInt(select.css("top").replace("px",""));
					if(_bottom<50){
						var top = parseInt(select.css("top").replace("px",""));
						select.css({"top":(top+_bottom-50)+"px","z-index":"899"});
					}			
				}
			});
		});
		//时间控件注册
		$('#datetimepickerStart').datetimepicker({format:"Y-m-d H:i"});
		$('#datetimepickerEnd').datetimepicker({format:"Y-m-d H:i"});
		$.datetimepicker.setLocale('ch');//设置中文
		//资源增加滚动轴
		var axis = {axis:"yx",
					scrollButtons:{enable:true},
					theme:"3d"
		};
		$(".treeScrollbar").mCustomScrollbar(axis);
		//初始化重点区域树
		$.ajax({
			url: "../../config/common/rightResource/js/flyroute_data.json", //json文件位置
			type: "get", //请求方式为get
			dataType: "json",
			success: function(data) {
				//初始化树
				setting.check.enable=false;
				$.fn.zTree.init($("#treeKeyArea"), setting, data.dataKeyArea);
			},
			error: function() {
				alert('加载失败！');
			}
		});
		//警用资源注册点击处理事件
		$("#treePoliceRes").each(function() {
			$(this).find("input").click(function() {
				if(this.checked){//选中
					if("bjz"==this.id){
						selectedBjz();
					}else{
						selectedRec(this.name,this.dataset.img);
					}
				}else{
					$.each(policeResData[this.name], function(i,item) {
						removeMarker(item.attributes.ID);
					});
				}
			});
		});
	};
	// zTree 参数配置，
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
			onClick: function(event, treeId, treeNodes) {
				if("treeKeyArea"==treeId){
					loadfly(treeNodes);
				}
				return true;
			},
			onCheck: onCheck,
			onExpand: function(event, treeId, treeNodes) {
			}
		}
	};
	//获取资源
	function findResource(){
		findPolice();
		findCar();
		findCamera();
		findInteresPoint();
	}
	//获取资源详情
	function findDetail(treeId,obj){
		obj.treeId = treeId;
		switch(treeId) {
			case "treePolice":
				findPoliceDetail(obj);
				break;
			case "treePoliceCar":
				findCarDetail(obj);
				break;
			case "treeVideo":
				findVideoDetail(obj);
				break;
			case "zTreeKeyPersonnel":
				findKeyPersonnelDetail(obj);
				break;
		}
	}
	//警员
	function findPolice(){
		_ajax.post("/api/right/findPolice",{},function(response){
			var date = response.data.data;
			setting.check.enable=true;
			$.fn.zTree.init($("#treePolice"), setting,date );
 		},processFailed);
	}
	var zNodes;
	//警车
	function findCar(){
		_ajax.post("/api/right/findCar",{},function(response){
			var data = response.data.data;
			setting.check.enable=true;
			zNodes = data;
			$.fn.zTree.init($("#treePoliceCar"), setting,data);
 		},processFailed);
	}
	var nodeList=[];
	///根据文本框的关键词输入情况自动匹配树内节点 进行模糊查找 车辆
	function autoMatch() {
		var value = $("#policeCarSeach").val();
	    if (value.length > 0) {
	        var zTree = $.fn.zTree.getZTreeObj("treePoliceCar");
	        nodeList = zTree.getNodesByParamFuzzy("name", value);
	        updateNodes();
            nodeList = zTree.getNodesByFilter(filter);
	    } else {
	        initialZtree();                
	    }              
	}
	//根据查询的结果更新ztree 车辆
	function updateNodes() {
	   var zTree = $.fn.zTree.getZTreeObj("treePoliceCar");
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
	    $.fn.zTree.init($("#treePoliceCar"), setting, zNodes);
	}
	//视频
	function findCamera(){
		_ajax.post("/api/right/findCamera",{},function(response){
			var data = response.data.data;
			data.splice(1,1);
			data.splice(1,1);
			setting.check.enable=true;
			$.fn.zTree.init($("#treeVideo"), setting,data);
 		},processFailed);
	}
	//警员详情
	function findPoliceDetail(obj){
		_ajax.post("/api/right/findPoliceDetail/"+obj.id,{},function(response){
			var data = response.data.data;
			if(data!=null && data.X!=undefined){
			    data.img = obj.img;
			    addMarker(data,obj.treeId);
		    }
 		},processFailed);
	}
	//警车详情
	function findCarDetail(obj){
		_ajax.post("/api/right/findCarDetail/"+obj.id,{},function(response){
			var data = response.data.data;
			if(data!=null){
				data.name = obj.name;
				data.img = obj.img;
				addMarker(data,obj.treeId);
			}
		},processFailed);
	}
	//视频详情
	function findVideoDetail(obj){
		var type = obj.cameraType;
    	if(type.indexOf("球机")!=-1){
    		obj.img = "map-video1"+obj.stage+".png";
    	}else{
    		if(obj.stage==3 && type.indexOf("4G")!=-1){
    			obj.img ="map-4G.png"
    		}else{
    			obj.img = "map-video2"+obj.stage+".png";
    		}
    	}
		addMarker(obj,obj.treeId);
	}
	//重点人员详情
	function findKeyPersonnelDetail(obj){
		obj.id = obj.NUMBER_USER;
		addMarker(obj,obj.treeId);
	}
	//兴趣点
	function findInteresPoint(){
		_ajax.get("api/interest/findAllType",{},function(response){
			var data = response.data.data;
			selectedXQD(data);
 		});
	}
	//兴趣点详情
	function findInteresPointDetail(obj){
		_ajax.get("api/interest/findDetail?classify="+obj.dataset.classify+"&type="+obj.dataset.type,{},function(response){
			var data = response.data.data;
			structureInteresPointDetail(data,obj);
 		});
	}
	/**
 	* 警用资源勾选某个资源加载数据函数  v
 	* @param type 警用资源类型
 	* @param mapImg 地图显示图标名称
 	*/
 	function selectedXQD(data){
 		var dataHtml = "";
		$.each(data, function(i,item) {
			dataHtml+='<div class="xqud">';
			dataHtml+='<p><span><img src="../../config/common/rightResource/img/top.png"/></span>'+item.name+'</p>';
        	dataHtml+='<ul class="jige">';
    		$.each(item.type, function(key,obj) {
    			dataHtml+='<li>';
            		dataHtml+='<span class="rec"><input type="checkbox" name="'+obj.name+'" data-name="'+item.name+'" data-type="'+obj.id+'" data-classify="'+item.id+'" data-img="'+obj.icon+'"/></span>';	
            		dataHtml+='<span class="rec"><img src="'+obj.icon+'"/></span>';
            		dataHtml+='<span class="rec">'+obj.name+'</span>';
            	dataHtml+='</li>';
            });
        	dataHtml+='</ul>';
        	dataHtml+='</div>';
        });
        $("#interesPointScrollbar").html(dataHtml);
        $("#interesPointScrollbar").mCustomScrollbar();
 		$(".xqud").find("p").click(function() {
		    $(this).siblings().toggle();
		});
		//兴趣点注册点击处理事件
		$("#interesPointScrollbar").each(function() {
			$(this).find("input").click(function() {
				if(this.checked){//选中
					findInteresPointDetail(this);
				}else{
					$.each(XQDData[this.name], function(i,item) {
						//删除marker
						removeMarker(item.id);
					});
				}
			});
		});
 	}
 	 //构造兴趣点详情			
	function structureInteresPointDetail(detailArray,obj){
		var newDetailArray = [];
		$.each(detailArray, function(i,detail) {
			detail.X = detail.longitude;
		    detail.Y = detail.latitude;
			detail.classify = obj.dataset.name;
			detail.img = obj.dataset.img;
			detail.xqd = "xqd";
			/*detail.img = "xqd/"+ "gyqy.png";*/
			newDetailArray.push(detail);
			addMarker(detail,"XQDRes");
		});
		XQDData[obj.name] = newDetailArray;
    }
	function selectedBjz(){
		_ajax.post('/alarm/pillar/findAll', {}, function(response) {
        	var data = response.data;
        	var type = "校园报警终端";
        	$.each(data,function(i,pillarInfo){
				pillarInfo.img = "map-bjz.png";
        		var params = pillarInfo.params;
                var arry = params.split("|");
                pillarInfo.cameraIndex = arry[0];
                pillarInfo.stage = arry[1];
                pillarInfo.X = _jk.lonlat(pillarInfo.mapDimension);
                pillarInfo.Y = _jk.lonlat(pillarInfo.mapLongitude);
                var time = _jk.RiQi(pillarInfo.createTime);
                pillarInfo.time = time;
                pillarInfo.cameraType = "球机";
                pillarInfo.type = type;
                pillarInfo.popupId = "bjzPopup";
                pillarInfo.eID = pillarInfo.id;
                pillarInfo.attributes = {"ID":pillarInfo.id};
    	        addMarker(pillarInfo,"bjzPopup");
        	});
        	debugger
        	policeResData[type] = data;
        },processFailed);
	}
	/**
	 * 警用资源勾选某个资源加载数据函数  v
	 * @param type 警用资源类型
	 * @param mapImg 地图显示图标名称
	 */
	function selectedRec(type, mapImg) {
	    var config = {
	        dataName: "HTC02:警用资源",
	        sql: "type = '" + type + "'",
	        url: services.queryUrl,
	        successCallback: onQueryRec,
	        failCallback: processFailed
	    };
	    rightResource.sceneEvent.supermap3DUtils.query3DUtil.getSqlBydata(config);
	    //查询成功返回结果函数      
	    function onQueryRec(queryEventArgs) {
	        var selectedFeatures = queryEventArgs.result.features;
	        policeResData[type] = selectedFeatures;
	        $.each(selectedFeatures, function(i, item) {
	            item = item.attributes;
	            item.img = "map-" + mapImg;
	            item.X = parseFloat(item.X);
	            item.Y = parseFloat(item.Y);
	            item.id = item.ID;
	            //2维增加标记点 并增加单击事件气泡窗口
	            addMarkerClick("policeResources", item);
	            //3维增加标记点 并增加气泡窗口
	            add3DMarker(item, "map-" + mapImg, "policeResPopup");
	        });
	    }
	}
	//查询失败返回
	function processFailed(error){
    	console.log(error);
	}
	/**
	 * 沿线飞行方法
	 */
	var flyManager;
	var timeoutID = null;
	var stopArrived = false;
	var timeoutIDP = null;
	function loadfly(treeNode) {
		flyManager && flyManager.stop();
		flyManager = null;
		timeoutID = null;
	    stopArrived = false;
	    timeoutIDP = null;
		$('#pause').hide();
		$('#play').show();
	    rightResource.mapCut.cut3D();
	    $('.fly-panel').show();
	    //$('.flytitle').html('飞行标题');
	    var viewer = rightResource.sceneEvent.supermap3DUtils.sceneUtil.viewer;
	    var scene = viewer.scene;
	    scene.globe.depthTestAgainstTerrain = false;
	    var camera = scene.camera;
	    var routes = new rightResource.sceneEvent.supermap3DUtils.sceneUtil.cesium.RouteCollection();
	    //添加fpf飞行文件
	    var fpfUrl = services.frontHttpUrl+"config/common/rightResource/flyFpf/"+treeNode.value;
	    routes.fromFile(fpfUrl);
	    //初始化飞行管理
	    flyManager = new rightResource.sceneEvent.supermap3DUtils.sceneUtil.cesium.FlyManager({
	        scene: scene,
	        routes: routes
	    });
	    //注册站点到达事件
        flyManager.stopArrived.addEventListener(function(routeStop){
        	stopArrived = true;
        	//打开视频
        	var index = (routeStop.index)-1;
        	if(treeNode.cameraList[index]!=undefined && routeStop.waitTime!=0){
        		var dataStr = JSON.stringify(treeNode.cameraList[index]);
        		video.openVideo(dataStr);
        	}
        	var waitTime = routeStop.waitTime*1000;
        	//进入站点根据停留时间停留飞行状态
        	timeoutID = setTimeout(function(){
        		stopArrived = false;
        	},waitTime);
        	//站点暂停飞行的开始定时
        	timeoutIDP = setTimeout(function(){
        		if(stopArrived){
        			flyManager && flyManager.pause();
        		}else{
        			//关闭视频
	        		window.clearIntervalCameraFun();
	        		layer.closeAll();
        		}
        		$('#play').attr("title","开始飞行");
        		stopArrived = false;
        	},waitTime+50);
        });
       /* if(flyManager.readyPromise){
            //生成飞行文件中的所有站点列表
            rightResource.sceneEvent.supermap3DUtils.sceneUtil.cesium.when(flyManager.readyPromise,function(){
                var allStops = flyManager.getAllRouteStops();
                var menu = document.getElementById('stopList');
                var flyLine =[];
            });
        }*/
	}
	//开始
	  $('#play').click(function() {
		  	if(stopArrived){
		  		return;
		  	}else{
		  		//关闭视频
        		window.clearIntervalCameraFun();
        		layer.closeAll();
		  	}
	        flyManager && flyManager.play();
	        $('#play').hide();
	        $('#pause').show();
	    });
		//暂停
	    $('#pause').click(function() {
	    	if(stopArrived){
	    		clearTimeout(timeoutID);
	    		$('#play').attr("title","停留15秒之后点击开始继续飞行");
	    	}else{
	    		flyManager && flyManager.pause();
	    	}
	    	$('#pause').hide();
		    $('#play').show();
	    });
	    //停止
	    $('#stop').click(function() {
	    	clearTimeout(timeoutIDP);
	        flyManager && flyManager.stop();
	        $('#pause').hide();
	        $('#play').show();
	    });
	    $("#closeFly").click(function() {
	        $(".fly-panel").hide();
	        flyManager && flyManager.stop();
	        $('#pause').hide();
	        $('#play').show();
	    })
  /**
 	* ztree复选框点击回调函数
 	* @param treeId 
 	* @param treeNodes 选中node
 	*/
	function onCheck(event, treeId, treeNodes) {
		resType(treeId);
		getChildren(treeId,treeNodes);
	}
	/**
 	* 选择树复选框2、3维坐标maker标记添加 取消
 	* @param treeId //哪一类资源
 	* @param treeNode //ztree选中node
 	*/
	function getChildren(treeId,treeNode) {
		var type = resType(treeId);
		if(treeNode.isParent) {//点击父节点时
			for(var obj in treeNode.children) {
				if(!treeNode.children[obj].isParent) {
					if(treeNode.children[obj].checked) {
						var node = treeNode.children[obj]; 
						node.img = "map-"+type[0];
						findDetail(treeId,node);
						/*rightResource.mapTools.setMap3DCenter();*/
					} else {
						removeMarker(treeNode.children[obj].id);
						//关闭轨迹
						historyTrack.closeOrbit();
					}
				} else {
					getChildren(treeId,treeNode.children[obj]);
				}
			}
		} else {//根节点  设置中心
			if(treeNode.checked) {
				treeNode.img = "map-"+type[0];
				findDetail(treeId,treeNode);
				rightResource.mapTools.setMap3DCenter();
			} else {
				removeMarker(treeNode.id);
				historyTrack.closeOrbit();
			}
		}
	}
	//添加标记2、3 维
	function addMarker(obj,treeId){
		var type = resType(treeId);
		if(_jk.Object.notNull(obj.X) &&_jk.Object.notNull(obj.Y)){
			obj.X= _jk.lonlat(obj.X);
		    obj.Y = _jk.lonlat(obj.Y);
			obj.attr = obj.id;
			if(obj.dataAttr!=undefined){
            	 delete obj.dataAttr;//删除属性
            }
			var dataAttr = JSON.stringify(obj);
			obj.dataAttr = dataAttr;
			//2维增加标记点 并增加气泡窗口
			addMarkerClick(treeId,obj);
			//3维增加标记点 并增加气泡窗口
			add3DMarker(obj,obj.img,type[1]);
		}
	}
	/**
 	* 2维标记添加单击事件
 	* @param treeId //ztree id
 	* @param item//气泡显示内容对象
 	*/
	
	function addMarkerClick(treeId,item) {
		var popupTemId = resType(treeId);
		if("videoPopup"==popupTemId[1]){
	    	var type = item.cameraType;
	    	if(type!=undefined){
		    	if(type.indexOf("球机")!=-1){
		    		item.img = "map-video1"+item.stage+".png";
		    	}else{
		    		if(item.stage==3 && type.indexOf("4G")!=-1){
		    			item.img ="map-4G.png"
		    		}else{
		    			item.img = "map-video2"+item.stage+".png";
		    		}
		    	}
	    	}
	    }
		var img = imgPath+item.img;
		var n = 20,h=29;
		if(item.xqd!=undefined){
			img=item.img;
			n = 25;
			h = 25;
		}
		var size = new SuperMap.Size(n, h);
		var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
		var lonLat = new SuperMap.LonLat(item.X, item.Y);
	    var marker = new SuperMap.Marker(lonLat, new SuperMap.Icon(img, size, offset));
	    marker.attr = item.id;
		rightResource.markerLayer.addMarker(marker);
		//例如点击marker弹出popup 
		marker.events.on({
			"click": openInfoWin,
			"scope": marker
		});
		var zhoubian;
		if(item.zhoubian!=undefined){
			zhoubian=1;
			$('#zhoubian' + item.id ).bind('click', function() {
				 var current = $(".z-card").html();
	    		if ("三维" == current) {
	    			var mScene = rightResource.sceneEvent.supermap3DUtils.sceneUtil;
					var cameraConfig = {
			            x: item.X * 1,
			            y: item.Y * 1,
			            height: item.Y * 1 + 900,
			            heading: 0.0002141084319855795,
			            pitch: -1.5707953113269526,
			            roll: 0,
			            type: "flyto"
			        }
			        mScene.resetCenter(cameraConfig);
	    			open3DPopupWin(mScene.getEntityById(item.id));
	    		}else{
	    			openInfoWin();
	    		}
	        });
		}
		//单击事件回调函数
		function openInfoWin() {
			//打开关闭轨迹
			historyTrack.closeOrbit();
			//关闭查看那视频窗口
			video.closeVideo();
			rightResource.mapEvent.mapInit.pluginsAPI.popup.clearPopup();
			rightResource.mapEvent.mapInit.mapAPI.map.setCenter(lonLat);
			var marker = this;
			var popupTemId = resType(treeId);
		    var contentHTML = template(popupTemId[1], { content: item });
	        var config = { x: item.X, y: item.Y, contentHTML: contentHTML, width: 302, offsetX: 0, offsetY: -40, center: false };
	        rightResource.mapEvent.mapInit.pluginsAPI.popup.showPopup(config);
	        rightResource.mapEvent.mapInit.pluginsAPI.popup.changePosition();
	        if(item.classify!=undefined){
	        	$("#interesPointDetail").mCustomScrollbar();
	        }
	        if(zhoubian==1){
	        	$(".jilu-tiao").show();
	        }
		}
	}
	/**
 	* 移除2、3维标记
 	* @param id //maker attr id
 	*/
    function removeMarker(id) {
    	//删除2维标记
        for(var i = 0; i < rightResource.markerLayer.markers.length; i++) {
			if(rightResource.markerLayer.markers[i].attr === id) {
				rightResource.markerLayer.removeMarker(rightResource.markerLayer.markers[i]);
				//删除3维标记
				rightResource.sceneEvent.supermap3DUtils.sceneUtil.clearEntityById(id);
			}
		}
	}
	/**
	 * 右侧资源地图坐标图标  树结构图标根据不同分类获取
	 * @param type //哪一类资源
	 */
	function resType(type) {
	    var result = new Array();
	    var nodeImg = "",
	        popupTemId = "";
	    switch (type) {
	        case "treePolice":
	            nodeImg = "police.png";
	            popupTemId = "policePopup";
	            break;
	        case "treePoliceCar":
	            nodeImg = "police-car.png";
	            popupTemId = "policeCarPopup";
	            break;
	        case "policeResources":
	            popupTemId = "policeResPopup";
	            break;
	        case "treeVideo":
	            nodeImg = "video.png";
	            popupTemId = "videoPopup";
	            break;
	        case "treeKeyArea":
	            nodeImg = "location.png";
	            break;
	        case "XQDRes":
	            popupTemId = "XQDPopup";
	            break;
            case "zTreeKeyPersonnel":
                nodeImg = "location.png";
            	popupTemId = "keyPersonnelPopup";
            	break;
        	case "bjzPopup":
	            nodeImg = "bjz.png";
	            popupTemId = "bjzPopup";
	            break;
	    }
	    result[0] = nodeImg;
	    result[1] = popupTemId;
	    return result;
    }
		/**
 	* 坐标更新 定时函数
 	*/
	function updateMaker() {
		var treePolice = $.fn.zTree.getZTreeObj("treePolice");
		var treeCarPolice = $.fn.zTree.getZTreeObj("treePoliceCar");
		if(treePolice!=null){
			var checkedNodes = treePolice.getCheckedNodes();
			$.each(checkedNodes, function(i, item) {
				if(!item.isParent) {
					removeMarker(item.id);
					findDetail("treePolice",item);
				}
			});
		}
		if(treeCarPolice!=null){
			var checkedCarNodes = treeCarPolice.getCheckedNodes();
			$.each(checkedCarNodes, function(i, item) {
				if(!item.isParent) {
					removeMarker(item.id);
					findDetail("treePoliceCar",item);
				}
			});
		}
	}
	//定时任务
	setInterval(updateMaker, 170000);
/***********************警员 车辆轨迹***************************************************************************/
	var mId,features = [];
	var historyTrackParm,time,trackXY=[],entityArray = [];;
	var historyTrack = {
		//轨迹播放
		trackStart:function(){
			if(features.length==0){
				return;
			}
			var current = $(".z-card").html();
	 		if(current=="三维"){
	 			changePosition(trackXY);
	 			rightResource.mapEvent.historyTrack.trackStop();
	 		}else{
	 			removeTackEntity();
	 			rightResource.mapEvent.historyTrack.trackStart();
	 		}
		},
		//轨迹快进快退
		track:function(type){
			 var current = $(".z-card").html();
			if(current=="三维"){
				return;
			}
			var num = parseInt($("#sudu").html());
			//快进
			if(type==1){
				num++;
				rightResource.mapEvent.historyTrack.trackIncrease();
			}else{
				if(num > 1){
					num--;
					rightResource.mapEvent.historyTrack.trackDecrease();
				}
			}
			$("#sudu").html(num);
		},
		//轨迹播放停止
		trackStop:function(obj){
			$("#sudu").html("1");
			rightResource.mapEvent.historyTrack.trackStop();
			removeTackEntity();
		},	
		//选择时间查询轨迹
		selectOrbit:function(name){
			//时间差
			var startDate =  $("#datetimepickerStart").val();
			var endDate =  $("#datetimepickerEnd").val();
			if(startDate==""&&endDate==""){
				return;
			}
			time = _jk.dateDif(startDate,endDate,null);
			if(time == 1){
				alert("结束时间小于开始时间，请重新选择！");
				return;
			}
			$("#totalDate").html(time[0]);
			var policeName = $("#nowName").html();
			if("警员"==name || policeName.indexOf("警员")!=-1){
				findPoliceTrack(mId,startDate,endDate);
			}else{
				findCarTrack(mId,startDate,endDate);
			}
		},
		/**
	 	* 轨迹按钮调用函数 打开轨迹播放面板
	 	* @param id//轨迹对象id
	 	*/
		openOrbit:function(obj,id,type) { 
			//rightResource.mapCut.cut2D();
			//clearInterval(iCount);
			rightResource.mapEvent.mapInit.pluginsAPI.popup.clearPopup();
			$("#nowName").html($(obj).data("name")+" : "+$(obj).data("value"));
			$(".guiji-panel").show();
			$("#guijiImg").html(type);
			mId = id;
			var today = new Date();
			var oneday = 1000 * 60 * 60 * 2;
			var yesterday = new Date(today - oneday);
			//默认显示前2个小时轨迹
			$("#datetimepickerStart").val(yesterday.Format("yyyy-MM-dd HH:mm"));
			$("#datetimepickerEnd").val(today.Format("yyyy-MM-dd HH:mm"));
			historyTrack.selectOrbit($(obj).data("name"));
		},
	 	//关闭轨迹播放面板  并清除播放数据及地图轨迹路线
		closeOrbit:function(search){
			$("#sudu").html("1");
			$(".time-col ").css("width","0%");
			if(search==undefined){
				$(".guiji-panel").hide();
				$("#datetimepickerStart").val("");
			    $("#datetimepickerEnd").val("");
			    $("#bfDate").html("00:00");
			    $("#totalDate").html("00:00");
			}
			if(rightResource.mapEvent.historyTrack!=undefined){
				rightResource.mapEvent.historyTrack.trackClear();
				rightResource.mapEvent.mapInit.mapContent.vectorLayer.removeFeatures(features);	
				var viewer = rightResource.sceneEvent.supermap3DUtils.sceneUtil.viewer;
				removeTackEntity();
				var scene = rightResource.sceneEvent.supermap3DUtils.sceneUtil;
				scene.clearEntityById("stPoint");
				scene.clearEntityById("edPoint");
				scene.clearEntityById("3Dpolyline");
			}
		}
	}
	/**
 	* 获取轨迹 	警员轨迹
 	* @param id//轨迹对象id
 	* @param startDate//查询轨迹开始时间
 	* @param endDate//查询轨迹结束时间
 	*/
	function findPoliceTrack(id,startTime,endTime){
		var obj = {
		    "endTime": endTime+":00",
		    "id": id,
		    "startTime": startTime+":00"
		};
		_ajax.post("/api/right/findPoliceTrack",obj,function(response){
			var historyT = response.data.data;
			if(historyT!=null){
				historyTrack.closeOrbit("search");
			    createLines(rightResource.mapEvent.mapInit.mapContent.vectorLayer,historyT);
		    }
 		},processFailed);
	}
	/**
 	* 获取轨迹 	警车轨迹
 	* @param id//轨迹对象id
 	* @param startDate//查询轨迹开始时间
 	* @param endDate//查询轨迹结束时间
 	*/
	function findCarTrack(id,startTime,endTime){
		var obj = {
		    "endTime": endTime+":00",
		    "id": id,
		    "startTime": startTime+":00"
		};
		_ajax.post("/api/right/findCarTrack",obj,function(response){
			var historyT = response.data.data;
			if(historyT!=null){
				historyTrack.closeOrbit("search");
			    createLines(rightResource.mapEvent.mapInit.mapContent.vectorLayer,historyT);
		    }
 		},processFailed);
	}
	function initTracks(){
		var guijiImg = $("#guijiImg").html();
		var json = {
            mapUtil: rightResource.mapEvent.mapInit, //地图相关操作对象，在map_init.js下面
          	animatorVector: rightResource.mapEvent.mapInit.mapContent.animatorVector, //动态图层（必需参数）
            trackdata:historyTrackParm, //轨迹数据（必需参数）
            drawfeaturestart: drawfeaturestart,  //每次绘制在当前时间节点内的feature时触发的回调函数（必需参数）
            iconStyle: {   //矢量要素style（可选参数）
          	externalGraphic: imgPath+guijiImg+'.png', //图片地址
           	graphicWidth: 20, //图片宽度
           	graphicHeight: 29,
           	allowRotate:true
           }
        };
		rightResource.mapEvent.historyTrack.initTracks(json);
	}
	//轨迹播放回调函数
	function drawfeaturestart(obj){
		var length = historyTrackParm.length;
		var share = time[1]/length;
		var cs = obj.attributes.TIME+1;
		var now = cs*share;
		var time1 = _jk.dateDif(null,null,now);
		var col = 100*(time1[1]/time[1]);
		$("#bfDate").html(time1[0]);
		$(".time-col").css("width",col+"%");
	}
	//三维
	function removeTackEntity(){
		var viewer = rightResource.sceneEvent.supermap3DUtils.sceneUtil.viewer;
		for(var i=0; i<entityArray.length; i++){
			var ent = entityArray[i];
			ent.availability._animation.event.removeEventListener(Cesium.Entity.prototype.myListener,ent);
			viewer.entities.remove(ent);
		}
		entityArray = [];
	}
	function changePosition(datas) {
		var viewer = rightResource.sceneEvent.supermap3DUtils.sceneUtil.viewer;
		removeTackEntity();
		viewer.camera.flyTo({
		    destination : Cesium.Cartesian3.fromDegrees(datas[0].X, datas[0].Y,900),
		    complete: function(){
		    	//飞行到指定地点后的回调函数
		    	callbackComplete(datas,viewer);
		    }
		});
	}
	function callbackComplete(datas,viewer){
		var length = datas.length;
		Cesium.Entity.prototype.myListener = function(nStage) {
			var obj = this.availability._animation.item;
			viewer.camera.setView({
			    destination : Cesium.Cartesian3.fromDegrees(obj.X*1, (obj.Y-0.002)*1,700),
				orientation : {
			    	heading: 0.0002141084319855795,
			        pitch: -7.0000953113269526,
			        roll : 0
			    }
			});
			var billboard = this.billboard;
            var length = historyTrackParm.length;
			var share = time[1]/length;
			var cs = this.availability._animation.step;
			var now = cs*share;
			var time1 = _jk.dateDif(null,null,now);
			var col = 100*(time1[1]/time[1]);
			$("#bfDate").html(time1[0]);
			$(".time-col").css("width",col+"%");
        }
	  for (var i = 0; i < length; ++i) {
        	var obj = datas[i];
            var evt = new Cesium.Event();
            var animationObj = {
                type: 'time',
                stepsRange: {
                    start: 0,
                    end: length
                },
                trails: 1,
                duration: length+1000,
                event:evt,
                step:i,
                item:obj
            };
            entityArray[i] = viewer.entities.add({
                position : Cesium.Cartesian3.fromDegrees(obj.X, obj.Y,490),
                nameID:i,
                availability : new Cesium.TimeIntervalCollection(null,animationObj),
                billboard :{
                    image : '../../config/common/rightResource/img/map-police-car-gj.png',
                    width:20,
                    height:29
                }
            });
           evt.addEventListener(Cesium.Entity.prototype.myListener, entityArray[i]);
        }
	}
	
	function computeCirclularFlight(lon, lat, radius) {
	    var property = new Cesium.SampledPositionProperty();
	    var startAngle = Cesium.Math.nextRandomNumber() * 360.0;
	    var endAngle = startAngle + 360.0;
	
	    var increment = (Cesium.Math.nextRandomNumber() * 2.0 - 1.0) * 10.0 + 45.0;
	    for (var i = startAngle; i < endAngle; i += increment) {
	        var radians = Cesium.Math.toRadians(i);
	        var timeIncrement = i - startAngle;
	        var time = Cesium.JulianDate.addSeconds(start, timeIncrement, new Cesium.JulianDate());
	        var position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 1750);
	        property.addSample(time, position);
	    }
	    return property;
	}
	//绘制轨迹线
	function createLines(vectorLayer,datas){
		var pointFeatures = [], lineFeatures=[];
		var lines3D = [];
		historyTrackParm = [];
		if(datas.length!=0){
			$.each(datas, function(i,item) {
			item.X = _jk.lonlat(item.X);
		    item.Y = _jk.lonlat(item.Y); 
		    lines3D.push(item.X);
		    lines3D.push(item.Y);
		    lines3D.push(500);
		    var xy = {"x":item.X,"y":item.Y};
		    historyTrackParm.push(xy);
			var	point = new SuperMap.Geometry.Point(item.X, item.Y);
			if(i==0){
                var startP = new SuperMap.Feature.Vector(point);
                startP.style={
                    graphic: true,
                    graphicWidth: 40,
                    graphicHeight: 40,
                    graphicYOffset: -40,
                    externalGraphic: "../../assets/img/main_html/marker/stPoint.png"  //起点图片
                };
                pointFeatures.push(startP);
                item.id = "stPoint";
                item.img = "stPoint.png";
                add3DMarker(item, "stPoint.png", "trackPoint");
            }else if(i==datas.length-1){
                var endP = new SuperMap.Feature.Vector(point);
                endP.style={
                    graphic: true,
                    graphicWidth: 40,
                    graphicHeight: 40,
                    graphicYOffset: -40,
                    externalGraphic: "../../assets/img/main_html/marker/edPoint.png" //终点图片
                };
                pointFeatures.push(endP);
                item.id = "edPoint";
                item.img = "edPoint.png";
                add3DMarker(item, "edPoint.png", "trackPoint");
            }
				lineFeatures.push(point);
		});
		var geometryL = new SuperMap.Geometry.LineString(lineFeatures);
        var line = new SuperMap.Feature.Vector(geometryL);
        line.style={
            fill: true,
            strokeColor: "#1296db",
            strokeWidth: 3,
            strokeOpacity: 1
        };
    	lineFeatures.push(line);
		features = lineFeatures.concat(pointFeatures);
		pointFeatures = [], lineFeatures=[];
        vectorLayer.addFeatures(features);
        initTracks();
        trackXY = datas; 
        rightResource.sceneEvent.supermap3DUtils.sceneUtil.addEntityPolyline(lines3D,"3Dpolyline");
		}
	}
/*****************************三维****************************************/
	//3维增加标记
	function add3DMarker(item, imgName, popupIdValue) {
	    item.popupId = popupIdValue;
	    if("videoPopup"==popupIdValue){
	    	var type = item.cameraType;
	    	if(type!=undefined){
		    	if(type.indexOf("球机")!=-1){
		    		item.img = "map-video1"+item.stage+".png";
		    	}else{
		    		if(item.stage==3 && type.indexOf("4G")!=-1){
		    			item.img ="map-4G.png"
		    		}else{
		    			item.img = "map-video2"+item.stage+".png";
		    		}
		    	}
	    	}
	    }
	    var img = imgPath+item.img;
	    var n = 22,h=29;
		if(item.xqd!=undefined){
			img=item.img;
			n = 25;h = 25;
		}else if("trackPoint"==popupIdValue || item.img.indexOf("Point")!=-1){
			n = 40;h = 40;
		}
	    var config = { eID: item.id, url: img, width: n, height: h, x: item.X*1, y: item.Y*1, z: 490+item.Y*1, attributes: item };
	    rightResource.sceneEvent.supermap3DUtils.sceneUtil.addEntityBillboard(config);
	}
	//三维气泡
	function open3DPopupWin(entity) {
		var img = entity._billboard.attributes.img;
		if(img.indexOf("3D")!=-1){
			return;
		}
	    $("#myFrameId").contents().find("#case" + entity._billboard.attributes.id).addClass('list-selected').siblings().removeClass('list-selected');
	    //关闭查看那视频窗口
	    video.closeVideo();
	    var zhoubian;
	    if (entity._billboard.attributes.zhoubian != undefined) {
	        zhoubian = 1;
	    }
	    var mScene = rightResource.sceneEvent.supermap3DUtils.sceneUtil;
	    var scenePopup = rightResource.sceneEvent.supermap3DUtils.popup3DUtil;
	    var cartesian3 = mScene.cesium.Cartesian3.fromDegrees(entity._billboard.attributes.X*1, entity._billboard.attributes.Y*1, 490);
	    var _3DPopupConfig = {
	        tempId: entity._billboard.attributes.popupId,
	        singlePopup: true,
	        cartesian3: cartesian3,
	        data: { content: entity._billboard.attributes },
	        width: 200,
	        height: 179,
	        offsetX: 0,
	        offsetY: -30,
	        supermap3DUtils: rightResource.sceneEvent.supermap3DUtils
	    };
	    scenePopup.showPopup(_3DPopupConfig);
	    if(entity._billboard.attributes.classify!=undefined){
        	$("#interesPointDetail").mCustomScrollbar();
        }
	    if (zhoubian == 1) {
	        $(".jilu-tiao").show();
	    }
	}
	Date.prototype.Format = function (fmt) {    
    var o = {    
        "M+": this.getMonth() + 1, //月份     
        "d+": this.getDate(), //日     
        "H+": this.getHours(), //小时     
        "m+": this.getMinutes(), //分     
        "s+": this.getSeconds(), //秒     
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度     
        "S": this.getMilliseconds() //毫秒     
    };    
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));    
	    for (var k in o)    
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));    
	    return fmt;    
	}
	var rightResource = {
		initRightResource:initRightResource,
		historyTrack:historyTrack,
		video:video,
		/*fly:fly,*/
		open3DPopupWin:open3DPopupWin,
		autoMatch:autoMatch,
		addMarkerClick:addMarkerClick,
		add3DMarker:add3DMarker,
		findInteresPoint:findInteresPoint,
		initParam:initParam
	};
	module.exports = rightResource;
});