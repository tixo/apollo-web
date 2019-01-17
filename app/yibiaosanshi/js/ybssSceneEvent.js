//加载场景功能入口
define(function(require, exports, module) {
    var supermap3DUtils = require("../../../supermap/webgl/supermap/3D/supermap3DUtils.js");
    var viewshed3D = require("../../../supermap/webgl/supermap/3D/viewshed3D.js");
    var dic = require("../../../config/common/dic.js");
    var ajax = require('../../../scheduling/app/common/ajax.js');
    var jk = require('../../../config/common/utils.js');
    var queryFeature = require('queryFeature.js');
    this.supermap3DUtils = supermap3DUtils; //全局气泡关闭方法
    var scene = supermap3DUtils.sceneUtil;
    var rensuozailou;  //保存当前点击人员所在楼层
    var fangwuzuozailou; //保存当前房屋所在楼层
    var danweilouceng;  //保存当前单位所在楼层
    var cartesian3; //保存坐标
    var searchList;
    function initScene(services) {
    	$(".louceng-ctn").mCustomScrollbar();
        //开启加载动画
        parent.ui.openLoading();
        //先初始化场景
        var config = {
            cesium: Cesium,
            id: "cesiumContainer"
        };
        //所使用的是：scene.js的 initScene方法
        scene.initScene(config);
        $(".cesium-viewer-bottom").hide();//logo
        //再打开场景
        var json = {
            url: services.sceneUrl,
            singleDataLayerNames: parent.window.globalConstant.singleDataLayerNames,
            center: {
                x: services.sceneconfig.x,
                y: services.sceneconfig.y,
                height: services.sceneconfig.height,
                heading: services.sceneconfig.heading,
                pitch: services.sceneconfig.pitch,
                roll: services.sceneconfig.roll,
                type: services.sceneconfig.type
            },
            callbackOpenedScene: function() {
                queryFeature.queryFeature(scene,supermap3DUtils,ajax); //设置查询参数
                //关闭加载动画
                parent.ui.closeLoading(); //关闭加载动画
            }
        };
        //所使用的是：scene.js的 openScene方法
        scene.openScene(json);
        //注册测距、测高、测面积控件
        supermap3DUtils.measure3DUtil.initMeasure3DControl(scene.cesium, scene.viewer);
        //注册三维选择事件
        supermap3DUtils.sceneUtil.selectEntityListener(successSelectedEntity,processFailed);
        //注册3维视频可视域分析
	    viewshed3D.initChooseView(supermap3DUtils.sceneUtil.scene);
	    //获取区域
	    selectedArea();
    }
     /**
     * 实体要素选择成功的回调函数
     * @param {Object} entity
     */
    function successSelectedEntity(result) {
    	if(result._feature!=undefined){
    		if(result._feature.FLOORID == undefined){
    			if(result._feature.PARENTID!=undefined){
    				queryFeature.getCameraInfo(result._feature.MODELNAME);
    			}else if(result._feature.BUILDINGID.length>10){
    				queryFeature.getDanpu(result);
    			}else{
    				queryFeature.getBuildingMessage(result);
    			}
    		}else{
    			queryFeature.getDanweiInfo(result);  //点击单层的单击事件
    		}
    	}else{
    		_rightResource.open3DPopupWin(result);
    	}
    }
	/*************根据人口查询人口详情 ********************/
	var populationTableHtml = "";
	function renkouXQ(thisObj,obj){
		cutButColor(thisObj);
		$(".popup02-right-box").show(); 
		$("#populationRightTitle").html("人口详情");
		var contentHTML = template("populationDetailsPopup", {
	      content: obj
	    });
 		populationTableHtml = $("#popup02-renkou").html();
 		$("#popup02-renkou").html(contentHTML);
        /*$("#popup02-renkou").mCustomScrollbar();*/
        $("#fada-data-ctn").html(
        	'<div class="modal-fangda-ctn-box">'
        		+'<p id="oranger">'
        			+'<a class="hover" href="javascript:;">人口详情</a> '
                	+'<a href="javascript:;">家庭关系</a> '	
                	+'<a href="javascript:;">社会关系</a>'
                	+'<a href="javascript:;">车辆关系</a>'
				+'</p>'	
				+'<div id="tablea" class="tablea">'
					+'<div class="box" id="rk-xq-fangda">人口详情</div>'				
					+'<div class="box">家庭关系</div>'				
					+'<div class="box">社会关系</div>'				 
					+'<div class="box">车辆关系</div>'	
				+'</div>'	
			+'</div>'       		
        );
        $("#fada-data-ctn").html(contentHTML);
        $("#fada-data-ctn").mCustomScrollbar();
 	}
	/*************根据人口查询，房屋********************/
	function renkouFW(thisObj,obj){
		cutButColor(thisObj);
		$(".popup02-right-box").show();
		if(populationTableHtml!=""){$("#popup02-renkou").html(populationTableHtml);}
   		var loucengRenkou = "<tr><th>房屋名称</th><th>产权人姓名</th><th>产权人身份证</th><th>产权人联系方式</th><th>房屋类型</th><th>房屋用途</th><th>房屋间数</th><th>房屋面积</th><th>房屋托管人</th></tr>"
        if(!$.isEmptyObject(obj.house)){
	        $.each(obj.house, function(i,item) {
				loucengRenkou += "<tr><td>"+item.name+"</td><td>"+item.lordName+"</td>"
								+"<td>"+item.lordNo+"</td>"
								+"<td>"+item.lordTelephone+"</td>"
								+"<td>"+item.categoryName+"</td>"
								+"<td>"+item.purposeName+"</td>"
								+"<td>"+item.room+"</td>"
								+"<td>"+item.area+"</td>"
								+"<td>"+item.trustName+"</td>"
							+"</tr>";
	        });
        }
        $(".renkouXQ").html(loucengRenkou);
        $("#populationRightTitle").html("实有房屋");
        $("#fada-data-ctn").html("<table class='fangda-tab'>"+loucengRenkou+"</table>");
        $("#fada-data-ctn").mCustomScrollbar();
        $("#maxName").html("实有房屋");
	}
	/*************根据人口查询单位********************/
	function renkouDW(thisObj,obj){
		cutButColor(thisObj);
		$(".popup02-right-box").show();
		populationTableHtml = $("#popup02-renkou").html();
   		var loucengRenkou = "<tr><th>单位名称</th><th>单位法人</th><th>单位地址</th><th>单位类别</th><th>联系电话</th><th>是否“低慢小”</th><th>是否有员工宿舍</th><th>是否有外来人员</th></tr>"
       if(obj.company!=undefined && obj.company!=null){
	       	var contentHTML = template("workplaceDetailsPopup", {
		      content: obj.company
		    });
        }else{
        	contentHTML="无单位信息";
        }
        $("#popup02-renkou").html(contentHTML);
        $("#populationRightTitle").html("实有单位");
        $("#fada-data-ctn").html(contentHTML);
        $("#fada-data-ctn").mCustomScrollbar();
        $("#maxName").html("实有单位");
	}
	/*************根据房屋查询房屋详情********************/
	var houseTableHtml = "";
	function fangWuXQ(thisObj,obj){
		cutButColor(thisObj);
		$(".popup02-right-box").show();
        $("#houseRightTitle").html("房屋详情");
        $("#maxName").html("房屋详情");
        houseTableHtml = $("#popup02-fangWu").html();
 		var contentHTML = template("houseDetailsPopup", {
	      content: obj
	    });
        $("#popup02-fangWu").html(contentHTML);
        $("#fada-data-ctn").html(contentHTML);
	}
	/*************根据房屋查询人口详情********************/
	function fangwuRK(thisObj,obj){
		cutButColor(thisObj);
		$(".popup02-right-box").show();
		if(houseTableHtml!=""){$("#popup02-fangWu").html(houseTableHtml);}
   		var loucengRenkou = "<tr><th>姓名</th><th>性别</th><th>民族</th><th>身份证</th><th>出生年月</th><th>政治面貌</th><th>文化程度</th><th>人口类型</th><th>联系方式</th></tr>"
        if(!$.isEmptyObject(obj.population)){
	        $.each(obj.population, function(i,item) {
	       		loucengRenkou += "<tr><td>"+item.name+"</td>"
								+"<td>"+item.sex+"</td>"
								+"<td>"+item.nation+"</td>"
								+"<td>"+item.cardNumber+"</td>"
								+"<td>"+item.birthDate+"</td>"
								+"<td>"+item.politication+"</td>"
								+"<td>"+item.educationName+"</td>"
								+"<td>"+item.householdName+"</td>"
								+"<td>"+item.telephone+"</td>"
							+"</tr>";
	        });
        }
        $(".FangWu").html(loucengRenkou);
        $("#houseRightTitle").html("实有人口");
        $("#maxName").html("实有人口");
        $("#fada-data-ctn").html("<table class='fangda-tab'>"+loucengRenkou+"</table>");
		$("#fada-data-ctn").mCustomScrollbar();
	}
	/*************根据房屋查询单位详情********************/
	function fangwuDW(thisObj,obj){
		cutButColor(thisObj);
		$(".popup02-right-box").show();
		if(houseTableHtml!=""){$("#popup02-fangWu").html(houseTableHtml);}
   		var loucengRenkou = "<tr><th>单位名称</th><th>单位法人</th><th>单位地址</th><th>单位类别</th><th>联系电话</th><th>是否“低慢小”</th><th>是否有员工宿舍</th><th>是否有外来人员</th></tr>"
        if(!$.isEmptyObject(obj.company)){
	        $.each(obj.company, function(i,item) {
				loucengRenkou += "<tr><td>"+item.name+"</td>"
								+"<td>"+item.chargeName+"</td>"
								+"<td>"+item.address+"</td>"
								+"<td>"+item.typeName+"</td>"
								+"<td>"+item.telephone+"</td>"
								+"<td>"+item.isSlowSmall+"</td>"
								+"<td>"+item.isDormitory+"</td>"
								+"<td>"+item.isMigrant+"</td>"
							+"</tr>";
	        });
        }
        $(".FangWu").html(loucengRenkou);
        $("#houseRightTitle").html("实有单位");
        $("#maxName").html("实有单位");
        $("#fada-data-ctn").html("<table class='fangda-tab'>"+loucengRenkou+"</table>");
		$("#fada-data-ctn").mCustomScrollbar();
	}
	
	/*************根据单位查询单位详情********************/
	var workplaceTableHtml = "";
	function danweiXQ(thisObj,obj){
		cutButColor(thisObj);
		$(".popup02-right-box").show();
		workplaceTableHtml = $("#popup02-danwei").html();
        $("#workplaceRightTitle").html("单位详情");
        $("#maxName").html("单位详情");
        var contentHTML = template("workplaceDetailsPopup", {
	      content: obj
	    });
        $("#popup02-danwei").html(contentHTML);
        $("#fada-data-ctn").html(contentHTML);
        $("#fada-data-ctn").mCustomScrollbar();
	}
	/*************根据单位查询人口详情********************/
	function danweiRY(thisObj,obj){
		cutButColor(thisObj);
		if(workplaceTableHtml!=""){
			$("#popup02-danwei").html(workplaceTableHtml);
		}
		$(".popup02-right-box").show();
   		/*var loucengRenkou = "<tr><th>姓名</th><th>曾用名</th><th>性别</th><th>民族</th><th>身份证</th><th>出生年月</th><th>政治面貌</th><th>部门</th><th>职位</th></tr>"*/
   		var loucengRenkou = "<tr><th>姓名</th><th>性别</th><th>民族</th><th>身份证</th><th>出生年月</th><th>政治面貌</th><th>文化程度</th><th>人口类型</th><th>联系方式</th></tr>"
        if(!$.isEmptyObject(obj.population)){
	        $.each(obj.population, function(i,item) {
	       		loucengRenkou += "<tr><td>"+item.name+"</td>"
								+"<td>"+item.sex+"</td>"
								+"<td>"+item.nation+"</td>"
								+"<td>"+item.cardNumber+"</td>"
								+"<td>"+item.birthDate+"</td>"
								+"<td>"+item.politication+"</td>"
								+"<td>"+item.educationName+"</td>"
								+"<td>"+item.householdName+"</td>"
								+"<td>"+item.telephone+"</td>"
							+"</tr>";
	        });
        }
        $(".Danwei").html(loucengRenkou);
        $("#workplaceRightTitle").html("从业人口");
        $("#maxName").html("从业人口");
        $("#fada-data-ctn").html("<table class='fangda-tab'>"+loucengRenkou+"</table>");
		$("#fada-data-ctn").mCustomScrollbar();
	}
	/*************根据单位查询房屋详情********************/
	function danweiFW(thisObj,obj){
		if(workplaceTableHtml!=""){
			$("#popup02-danwei").html(workplaceTableHtml);
		}
		cutButColor(thisObj);
		$(".popup02-right-box").show();
		$("#workplaceRightTitle").html("实有房屋");
		$("#maxName").html("实有房屋");
   		var loucengRenkou = "<tr><th>房屋名称</th><th>产权人姓名</th><th>产权人身份证</th><th>产权人联系方式</th><th>房屋类型</th><th>房屋用途</th><th>房屋间数</th><th>房屋面积</th><th>房屋托管人</th></tr>"
       if(!$.isEmptyObject(obj.house)){
	       $.each(obj.house, function(i,item) {
	        	loucengRenkou += "<tr><td>"+item.name+"</td><td>"+item.lordName+"</td>"
								+"<td>"+item.lordNo+"</td>"
								+"<td>"+item.lordTelephone+"</td>"
								+"<td>"+item.categoryName+"</td>"
								+"<td>"+item.purposeName+"</td>"
								+"<td>"+item.room+"</td>"
								+"<td>"+item.area+"</td>"
								+"<td>"+item.trustName+"</td>"
							+"</tr>";
	        });
        }
        $(".Danwei").html(loucengRenkou);
        $("#fada-data-ctn").html("<table class='fangda-tab'>"+loucengRenkou+"</table>");
		$("#fada-data-ctn").mCustomScrollbar();
	}
	$.each(dic.household, function(i,item) {
	 	var option = "<option value='"+item.key+"'>"+item.value+"</option>";
	 	$("#renkou-lei").append(option);
	});
	$.each(dic.nation, function(i,item) {
	 	var option = "<option value='"+item.key+"'>"+item.value+"</option>";
	 	$("#renkou-minzu").append(option);
	});
	var dics = ['house_type','house_purpose','company_type'];
	ajax.post('dic/info/findItemsBatch', dics, function (response) {
	    var result = response.data;
	    $.each(dics, function (index, data) {
	        if (jk.Object.notNull(result[data])) {
	        	selectOption(data,result[data]);
	        }
	    });
	},processFailed);
	function selectOption(selectClass,data){
		$.each(data, function (index, d) {
		    $("."+selectClass).append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
		});
	}
	/**
	* 区域获取  
	*/
	function selectedArea(){
		var config={
			dataName:"HTC02:片区面",
			sql:"",
			url:parent.services.queryUrl,
			successCallback:onQueryArea,
			failCallback:processFailed
		};
	    supermap3DUtils.query3DUtil.getSqlBydata(config);
	    //查询成功返回结果函数			
		function onQueryArea(queryEventArgs){
			var selectedFeatures = queryEventArgs.result.features;
			$.each(selectedFeatures, function(i,item) {
				item = item.attributes;
				var option = "<option value='"+item.LAYER+"'>"+item.LAYER+"</option>";
		        $("#renkou-shequ").append(option);
		        $("#fangwu-shequ").append(option);
		        $("#danwei-shequ").append(option);
			});
	    }
	}
	/**
	 * 根据人口、房屋、单位查询楼层图层数据并定位
	 */
	function queryFloorLayer(dataAttr,type){
		$(".louceng-box").hide(); 
		dataAttr.X = dataAttr.longtitude;
		dataAttr.Y = dataAttr.latitude;
		if(type == "WORKPLACE"){
			dataAttr.floorNo = dataAttr.companyHouseFloorInfo[0].floorNo;
		}
		var _floorNo = dataAttr.floorNo.substr(10,12);
		var config = {
	        dataName: "HTC02:" + "layere",
	       sql: "FloorID='"+dataAttr.floorNo+"'",
	        /*sql: "BuildingID='"+dataAttr.floorNo+"'",*/
	        url: services.queryUrl,
	        successCallback: function(resultEvent){
	        	if(resultEvent.result && resultEvent.result.features.length>0){
	        		var feature = resultEvent.result.features[0];
	        		var mheight = feature.attributes.HEIGHT * _floorNo;
	        		dataAttr.X = feature.attributes.LONGITUDE;
		            dataAttr.Y = feature.attributes.LATITUDE;
	        		//设置模型被选中
	        		queryFeature.setFloorSelected(feature.attributes.SMID);
	        		//floorShow(dataAttr.floorCount,dataAttr.floorNo);
	        		//重新定位到所选中的楼层
	        		var cameraConfig = {
			            x: dataAttr.X * 1,
			            y: dataAttr.Y * 1 ,
			            height: dataAttr.Y  * 1 + 900,
			            heading: 0.0002141084319855795,
			            pitch: -1.5707953113269526,
			            roll: 0,
			            type: "flyto"
			        }
			        scene.resetCenter(cameraConfig);
	        		if(type == "PEOPLE"){
	        			//气泡配置及显示
				        var config04 = {
				            supermap3DUtils: supermap3DUtils,
				            tempId: "featurePopup02",
				            cartesian3: scene.cesium.Cartesian3.fromDegrees(dataAttr.X * 1, dataAttr.Y * 1,500),
				            offsetX: 0,
				            offsetY: -30,
				            data: {
				                content: dataAttr
				            }
				        };
				        supermap3DUtils.popup3DUtil.showPopup(config04);
	        		}else if(type == "HOUSE"){
	        			//气泡配置及显示
				        var config04 = {
				            supermap3DUtils: supermap3DUtils,
				            tempId: "featurePopup03",
				            cartesian3: scene.cesium.Cartesian3.fromDegrees(dataAttr.X * 1, dataAttr.Y * 1, 500),
				            offsetX: 0,
				            offsetY: -30,
				            data: {
				                content: dataAttr
				            }
				        };
				        supermap3DUtils.popup3DUtil.showPopup(config04);
	        		}else if(type == "WORKPLACE"){
	        			//气泡配置及显示
				        var config04 = {
				            supermap3DUtils: supermap3DUtils,
				            tempId: "featurePopup04",
				            cartesian3: scene.cesium.Cartesian3.fromDegrees(dataAttr.X * 1, dataAttr.Y * 1, 500),
				            offsetX: 0,
				            offsetY: -30,
				            data: {
				                content: dataAttr
				            }
				        };
				        supermap3DUtils.popup3DUtil.showPopup(config04);
	        		}
	        	}
	        },
	        failCallback: processFailed
	    };
	    //所使用的是：query.js的getSqlBydata方法   数据查询方法
	    supermap3DUtils.query3DUtil.getSqlBydata(config);
	}
	//查询失败返回
    function processFailed(error) {
        console.log(error);
    }
	//切换按钮 改变选中状态
	function cutButColor(obj){
		$(obj).addClass("modal-ctn-btn-col").siblings().removeClass("modal-ctn-btn-col");
	}
	var ybssSceneEvent = {
	    supermap3DUtils: supermap3DUtils,
	    initScene: initScene,
	    modalRight:queryFeature.modalRight,
	    viewshed3D:viewshed3D,
	    renkouXQ:renkouXQ,
	    duiyinglou:queryFeature.duiyinglou,
	    renkouFW:renkouFW,
	    renkouDW:renkouDW,
	    fangWuXQ:fangWuXQ,
	    fangwuRK:fangwuRK,
	    fangwuDW:fangwuDW,
	    danweiXQ:danweiXQ,
	    danweiRY:danweiRY,
	    danweiFW:danweiFW,
	    queryFloorLayer:queryFloorLayer,
	    fangda:queryFeature.fangda,
    	rightModalClear:queryFeature.rightModalClear,
    	closeBuilding:queryFeature.closeBuilding
	};
	module.exports = ybssSceneEvent;
});