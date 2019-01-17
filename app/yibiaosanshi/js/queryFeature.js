define(function(require, exports, module) {
	var cartesian3;
	var  scene,supermap3DUtils,ajax;
	var buildingNames = parent.window.globalConstant.singleDataBuildingNames;
	var JK = require('../../../config/common/utils.js');
	//开始  *** 设置单体数据，激活模型选择事件方法
    function queryFeature(_scene,_supermap3DUtils,_ajax) {
    	scene = _scene;
		supermap3DUtils = _supermap3DUtils;
		ajax = _ajax;
        //获取所有的非影像图层
        var layers = scene.viewer.scene.layers._layers._array;
        if (layers.length > 0) {
            for (item in layers) {
            	if(layers[item]._name=="layere@HTC02"){
            		var config = {
	                    layers: layers[item],
	                    dataUrl: services.queryUrl,
	                    dataSourceName: 'HTC02',
	                    dataSetName: 'layere',
	                    keyWord: 'SmID'
	                };
	                scene.setQueryParam(config);
            	}else if(layers[item]._name.indexOf("Building")!=-1){
            		$.each(buildingNames, function(i,building) {
            			if(layers[item]._name==building.hx){
            				var config = {
			                    layers: layers[item],
			                    dataUrl: services.queryUrl,
			                    dataSourceName: 'HTC02',
			                    dataSetName: building.data,
			                    keyWord: 'SmID'
			                };
			                scene.setQueryParam(config);
            			}
            		});
            	}else if(layers[item]._name.indexOf("sxt@摄像头")!=-1){
            		var config2 = {
	                    layers: layers[item],
	                    dataUrl: services.queryUrl,
	                    dataSourceName: 'HTC02',
	                    dataSetName: 'sxt',
	                    keyWord: 'SmID'
	                };
	                scene.setQueryParam(config2);
            	}else if(layers[item]._name.indexOf("bjz")!=-1){
            		var config2 = {
	                    layers: layers[item],
	                    dataUrl: services.queryUrl,
	                    dataSourceName: 'HTC02',
	                    dataSetName: 'bjz',
	                    keyWord: 'SmID'
	                };
	                 scene.setQueryParam(config2);
            	}
            }
        }
    }
    function getBjz(parentId){
    	ajax.get('/alarm/pillar/findByNo/'+parentId, {}, function (response) {
    		if(response.data!=null){
    			var pillarInfo = response.data.data;
	            var params = pillarInfo.params;
	            var arry = params.split("|");
	            pillarInfo.cameraIndex = arry[0];
	            pillarInfo.stage = arry[1];
	            pillarInfo.X = JK.lonlat(pillarInfo.mapDimension);
	            pillarInfo.Y = JK.lonlat(pillarInfo.mapLongitude);
	            pillarInfo.installationAddress = pillarInfo.address;
	            var time = JK.RiQi(pillarInfo.createTime);
	            pillarInfo.time = time;
	            pillarInfo.cameraType = "球机";
	            pillarInfo.type = "报警柱";
			    window.cameraLists = [pillarInfo];
		        layer.open({
				    type: 2,
				    title: '视频播放',
				    skin: 'layui-bg-blue',
				    shade: 0,
				    maxmin: true,
				    shadeClose: false, 
				    area: ['709px', '365px'],
				    content:'../../config/common/camera/multichannelCamera.html',
				    cancel: function() {
				    	window.clearIntervalCameraFun();
		            }
				 });
    		}
    	},processFailed);
    		
    }
    //九小场所查询气泡
    function getDanpu(result){
    	cartesian3 = result.scenePos;
    	var config02 = {
            dataName: "HTC02:" + "jxcs",
            sql:"BuildingID = '"+result._feature.BUILDINGID+"'",
            url: services.queryUrl,
            successCallback:function(queryEventArgs){
            	var attributes ={};
            	if(queryEventArgs.result.features.length>0){
            		attributes = queryEventArgs.result.features[0].attributes;
            		attributes.TEL =  parseFloat(attributes.TEL);
            	}
            	var config01 = {
		            supermap3DUtils: supermap3DUtils,
		            tempId: "jxcsPopup",
		            singlePopup: true,
		            cartesian3: cartesian3,
		            offsetX: 0,
		            offsetY: -30,
		            data: {
		                content:attributes
		            }
		       };
	        supermap3DUtils.popup3DUtil.showPopup(config01);
            },
            failCallback: processFailed  
        };
        //所使用的是：query.js的getSqlBydata方法   数据查询方法
        supermap3DUtils.query3DUtil.getSqlBydata(config02);
    }
    function getCameraInfo(parentId){
    	successCamera(parentId);
    	/*var config02 = {
            dataName: "HTC02:" + "sxt",
            sql:"ParentID = '"+parentId+"'",
            url: services.queryUrl,
            successCallback:successCamera,
            failCallback: processFailed  
        };
        //所使用的是：query.js的getSqlBydata方法   数据查询方法
        supermap3DUtils.query3DUtil.getSqlBydata(config02);*/
    }
    function successCamera(parentId){
    	/*var far = queryEventArgs.result.features;
    	var height = queryEventArgs.originResult.features[0].geometry.boundingBox.upper.z;
    	$.each(far, function(i,item) {
    		item = item.data;
    		var config = { eID: "sxtImg"+i, url: services.frontHttpUrl+'config/common/rightResource/img/camera-lu'+(i+1)+'.png', width: 25, height: 25, x: parseFloat(item.LONGITUDE), y: parseFloat(item.LATITUDE), z:height+0.02};
			scene.addEntityBillboard(config);
    	});*/
    	//chaxun
    	ajax.post('api/home/findCameraByCondition', {poleNo:parentId}, function (response) {
		    window.cameraLists = response.data;
	        layer.open({
			    type: 2,
			    title: '视频播放',
			    skin: 'layui-bg-blue',
			    shade: 0,
			    maxmin: true,
			    shadeClose: false, 
			    area: ['709px', '365px'],
			    content:'../../config/common/camera/multichannelCamera.html',
			    cancel: function() {
			    	window.clearIntervalCameraFun();
		            /*$.each(far, function(i,item) {
		            	try{
		            		scene.clearEntityById("sxtImg"+i);
		            	}catch(e){
		            		return true;
		            	}
			    	});*/
	            }
			 });
		},processFailed);
    }
    /**
     * 点击整栋楼后查询建筑物信息
     * @param {Object} result
     */
    var BuildingCode = ""
    function getBuildingMessage(result){
    	BuildingCode = result._feature.BUILDINGID;
    	cartesian3 = result.scenePos;
		ajax.get("/api/structure/findByStructure?structureNo="+BuildingCode,{},function(response){
    		var building = response.data.data;
    		if(building==null){
    			building={};
    			building.objStr = "";
    		}else{
    			building.objStr = JSON.stringify(building);
				floorShow(building.floorCount,BuildingCode);
    		}
	    	var config01 = {
	            supermap3DUtils: supermap3DUtils,
	            tempId: "featurePopupBuilding",
	            singlePopup: true,
	            cartesian3: cartesian3,
	            offsetX: 0,
	            offsetY: -30,
	            data: {
	                content:building
	            }
	       };
	       supermap3DUtils.popup3DUtil.showPopup(config01);
	 	},processFailed);
    }
    /**
     * 点击楼层后查询实有单位信息
     * @param {Object} result
     */
    function getDanweiInfo(result){
    	var feature = result._feature;   //获取数据
		cartesian3 = result.scenePos;
		getFloor(feature.FLOORID);
    };
    function getFloor(floorNo){
    	var buildingCode = floorNo.substr(0,10);
    	ajax.get("/api/structure/findByStructure?structureNo="+buildingCode+"&floorNo="+floorNo,{},function(response){
				var data = response.data.data;
				if(data==null){
					data = {};
					data.objStr="";
					data.floor = "";
					data.house = [];
				}else{
					data.objStr = JSON.stringify(data);
			    	floorShow(data.floorCount,floorNo);
			    	$.each(data.floor, function(i,item) {
			    		if(floorNo == item.no){
			    			data.floor = item;
			    			return;
			    		}
			    	});
				}
		    	var config01 = {
		            supermap3DUtils: supermap3DUtils,
		            tempId: "featurePopup",
		            singlePopup: true,
		            cartesian3: cartesian3,
		            offsetX: 0,
		            offsetY: -30,
		            data: {
		                content:data
		            }
		        };
		        supermap3DUtils.popup3DUtil.showPopup(config01);
		},processFailed);
    }
    function floorShow(floorCount,floorNo){
    	var chucun = "";
    	BuildingCode = floorNo.substr(0,10);
    	for(var i = 1; i<= floorCount; i++){
    	 	chucun +='<li data-attr="'+i+'"  onClick="mbuilding.queryFeature.duiyinglou(event,this)">F'+i+'</li>';
    	}
    	$(".louceng-box").show();
    	$(".louceng-ctn ul").html(chucun);  //右侧楼层
    	if(floorNo.length>8){
    		//对应右侧楼层选中状态
    		$(".louceng-ctn ul li").eq(floorNo.substr(10,12)-1).addClass("actv").siblings().removeClass("actv");
    	}
    }
    //点击右侧楼层对应楼体楼层显示高亮
    function duiyinglou(event,obj){
    	$(obj).addClass("actv").siblings().removeClass("actv");
    	var floor = $(event.currentTarget).attr("data-attr");
    	var floorCode = "";
    	if(floor.length==1){
    		floorCode = BuildingCode+"0"+floor;
    	}else{
    		floorCode = BuildingCode+""+floor;
    	}
    	queryFloorLayerRight(floorCode);
    }
    //点击整栋后选中整栋楼
    $("#top-btn").click(function(){
    	var num = 1;
    	for(var i=1;i<=4;i++){
    		var configBtnBuilding = {
	            dataName: "HTC02:" + "Building"+i,
	            sql:"BuildingID='"+BuildingCode+"'",
	            url: services.queryUrl,
	            buildingNum:"Building_"+i,
	            successCallback:function(queryEventArgs){
	            	zhengdong(queryEventArgs,"Building_"+num);
	            	num+=1;
	            },
	            failCallback: processFailed  
	        };
	        //所使用的是：query.js的getSqlBydata方法   数据查询方法
	        supermap3DUtils.query3DUtil.getSqlBydata(configBtnBuilding);
    	}
    });
    //选中整栋楼的回调函数
    function zhengdong(queryEventArgs,buildingNum){
    	if(queryEventArgs.result.features.length==0){
    		return;
    	}
        var attribute = queryEventArgs.result.features[0].data;
        setBuildingSelected(attribute.SMID,buildingNum);
    	var cartesian3 =  scene.cesium.Cartesian3.fromDegrees(attribute.SMSDRIW * 1, attribute.SMSDRIN * 1, 500);
    	ajax.get("/api/structure/findByStructure?structureNo="+BuildingCode,{},function(response){
    		var building = response.data.data;
			building.objStr = JSON.stringify(building);
	    	var config01 = {
	            supermap3DUtils: supermap3DUtils,
	            tempId: "featurePopupBuilding",
	            singlePopup: true,
	            cartesian3: cartesian3,
	            offsetX: 0,
	            offsetY: -30,
	            data: {
	                content:building
	            }
	       };
	       supermap3DUtils.popup3DUtil.showPopup(config01);
	    },processFailed);
    }
    //点击建筑物，建筑层的实有房屋　实有人口　实有单位　弹出右侧气泡
    function modalRight(thisObj,obj) {
    	$(".popup02-right-box").show();
    	var rightid = thisObj.dataset.rightid;
    	$("#"+rightid+"RightTitle").html(thisObj.innerText);
    	$("#maxName").html(thisObj.innerText);
    	var popId = gePopId(thisObj.innerText);
   		var contentHTML = template(popId+"ListPopup", {
	      list: obj[popId]
	    });
        $("#"+rightid).html(contentHTML);
       	$("#fada-data-ctn").html("<table class='fangda-tab'>"+contentHTML+"</table>");
       	$("#fada-data-ctn").mCustomScrollbar();
   	}
    /**
	 * 点击右侧楼层查询楼层图层数据并定位
	 */
	function queryFloorLayerRight(floorCode){
		var config = {
	        dataName: "HTC02:" + "layere",
	        sql: "FloorID='"+floorCode+"'",
	       /* sql: "BuildingID='"+floorCode+"'",*/
	        url: services.queryUrl,
	        successCallback: function(resultEvent){
	        	if(resultEvent.result && resultEvent.result.features.length>0){
	        		var feature = resultEvent.result.features[0];
	        		//设置模型被选中
	        		setFloorSelected(feature.attributes.SMID);
	        		//重新定位到所选中的楼层
	        		/*var cameraConfig = {
			            x: feature.attributes.LONGITUDE * 1,
			            y: feature.attributes.LATITUDE * 1 ,
			            height: feature.attributes.LATITUDE  * 1 + 900,
			            heading: 0.0002141084319855795,
			            pitch: -1.5707953113269526,
			            roll: 0,
			            type: "flyto"
			        }
			        scene.resetCenter(cameraConfig);*/
			        cartesian3 = scene.cesium.Cartesian3.fromDegrees(feature.attributes.LONGITUDE* 1, feature.attributes.LATITUDE* 1, 500);
			        getFloor(floorCode);
	        	}
	        },
	        failCallback: processFailed
	    };
	    //所使用的是：query.js的getSqlBydata方法   数据查询方法
	    supermap3DUtils.query3DUtil.getSqlBydata(config);
	}
	/**
	 * 设置楼层维选中状态
	 * @param {Object} smid
	 */
	function setFloorSelected(smid){
		var layers = supermap3DUtils.sceneUtil.scene.layers._layers._array;
		for(var i=0; i<layers.length; i++){
			if(layers[i]._name == parent.window.globalConstant.singleDataLayerNames){
				layers[i].setSelection(smid);
			}
		}
	}
	/**
	 * 设置建筑物选中状态
	 * @param {Object} smid
	 */
	function setBuildingSelected(smid,buildingNum){
		var layers = supermap3DUtils.sceneUtil.scene.layers._layers._array;
		for(var i=0; i<layers.length; i++){
			if(layers[i]._name.indexOf(buildingNum)!=-1){
				layers[i].setSelection(smid);
			}
		}
	}
	//全局气泡页面放大
	function fangda(){
		$(".modal-fangda").show();
		$(".modal-fangda-clear").click(function(){
        	$(".modal-fangda").hide();
        });
	}
	//全局二级气泡点击关闭方法
	function rightModalClear(){
	    $(".popup02-right-box").hide();
	}
	function closeBuilding(){
		supermap3DUtils.popup3DUtil.closeAllPopup();
		$(".louceng-box").hide();  
	}
	function gePopId(name){
    	var popId = "";
		switch(name) {
			case "实有人口":
				popId = "population";
				break;
			case "实有房屋":
				popId = "house";
				break;
			case "实有单位":
				popId = "company";
				break;
		}
		return popId;
	}
    //查询失败返回
    function processFailed(error) {
        console.log(error);
    }
    var queryFeature = {
    	queryFeature:queryFeature,
    	getDanpu:getDanpu,
    	getCameraInfo:getCameraInfo,
    	getDanweiInfo:getDanweiInfo,
    	getBuildingMessage:getBuildingMessage,
    	modalRight:modalRight,
    	duiyinglou:duiyinglou,
    	queryFloorLayerRight:queryFloorLayerRight,
    	setFloorSelected:setFloorSelected,
    	setBuildingSelected:setBuildingSelected,
    	fangda:fangda,
    	rightModalClear:rightModalClear,
    	closeBuilding:closeBuilding,
    	getBjz:getBjz
    }
	module.exports = queryFeature;
});