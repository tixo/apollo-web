//加载场景功能入口
define(function(require, exports, module){
	var gjFeatureList={},peopleId;
	var supermap3DUtils = require("../../../supermap/webgl/supermap/3D/supermap3DUtils.js");
    var viewshed3D = require("../../../supermap/webgl/supermap/3D/viewshed3D.js");
    var ajax = require('../../../scheduling/app/common/ajax.js');
    var mScene = supermap3DUtils.sceneUtil;
    var queryFeature = require('../../../app/yibiaosanshi/js/queryFeature.js');
function initScene(services){
//开启加载动画
	parent.ui.openLoading();
	//先初始化场景
	var config={
		cesium: Cesium,
		id: "cesiumContainer"
	};
	//所使用的是：scene.js的 initScene方法
	supermap3DUtils.sceneUtil.initScene(config);
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
			roll:services.sceneconfig.roll,
			type:services.sceneconfig.type
		},
		callbackOpenedScene:function(){
			queryFeature.queryFeature(mScene,supermap3DUtils,ajax); //设置查询参数
			//关闭加载动画
			parent.ui.closeLoading();//关闭加载动画
		}
	};
	//所使用的是：scene.js的 openScene方法
	supermap3DUtils.sceneUtil.openScene(json);
	//注册测距、测高、测面积控件
	supermap3DUtils.measure3DUtil.initMeasure3DControl(supermap3DUtils.sceneUtil.cesium,supermap3DUtils.sceneUtil.viewer);
	//注册3维视频可视域分析
	viewshed3D.initChooseView(supermap3DUtils.sceneUtil.scene);
	supermap3DUtils.sceneUtil.selectEntityListener(successSelectedEntity);
	$(".louceng-ctn").mCustomScrollbar();
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
 function queryGuiJi3D(id){
 	peopleId = id;
   	/*$.ajax({ //ajax获取布控作战方案
		url: "js/json.json",//json文件位置
		type: "get",//请求方式为get
		dataType: "json",
		success: function(data){
			PeopleInformation(data);
	    },
	    error: function(e){
	    	
	        alert('加载超时！');
	    }
	});*/
 }
 function PeopleInformation(data){
 	/*var datas = data["scene"+peopleId];
 	for(var i=0;i<datas.length;i++){
 		aa(datas[i]);
 	}*/
 }
 
function aa(datas){
	var obj={
		eID:peopleId,
		url: services.frontHttpUrl + 'config/common/rightResource/img/camera.png',
		width: 20,
		height: 20,
		x: datas.x,
		y: datas.y,
		z: 500
	}
	supermap3DUtils.sceneUtil.addEntityBillboard(obj)
}
	//查询失败返回
    function processFailed(error) {
        console.log("查询失败"+error);
    }
	var bkSceneEvent={
		supermap3DUtils:supermap3DUtils,
		initScene:initScene,
		queryGuiJi3D:queryGuiJi3D,
		modalRight:queryFeature.modalRight,
        duiyinglou:queryFeature.duiyinglou,
        fangda:queryFeature.fangda,
    	rightModalClear:queryFeature.rightModalClear,
    	closeBuilding:queryFeature.closeBuilding
	};
	module.exports = bkSceneEvent;
});