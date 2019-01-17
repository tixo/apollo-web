//加载场景功能入口
define(function(require, exports, module){
	var supermap3DUtils = require("../../../supermap/webgl/supermap/3D/supermap3DUtils.js");
	var viewshed3D = require("../../../supermap/webgl/supermap/3D/viewshed3D.js");
	var ajax = require('../../../scheduling/app/common/ajax.js');
	var queryFeature = require('../../../app/yibiaosanshi/js/queryFeature.js');
	var mScene = supermap3DUtils.sceneUtil;
	var buildingNames = parent.window.globalConstant.singleDataBuildingNames;
	function initScene(services){
		//开启加载动画
		parent.ui.openLoading();
		//先初始化场景
		var config={
			cesium: Cesium,
			id: "cesiumContainer"
		};
		//所使用的是：scene.js的 initScene方法
		mScene.initScene(config);
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
				queryFeature.queryFeature(mScene,supermap3DUtils,ajax);
				//关闭加载动画
				parent.ui.closeLoading();//关闭加载动画
			}
		};
		//所使用的是：scene.js的 openScene方法
		mScene.openScene(json);
		//注册测距、测高、测面积控件
		supermap3DUtils.measure3DUtil.initMeasure3DControl(supermap3DUtils.sceneUtil.cesium,supermap3DUtils.sceneUtil.viewer);
		//注册3维视频可视域分析
	    viewshed3D.initChooseView(supermap3DUtils.sceneUtil.scene);
	    //注册右侧资源3维点击弹出气泡
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
	//3维增加标记
	function add3DCaseMarker(item){
		var config = { eID: item.id, url:item.img ,width: 20, height: 20, x: item.X, y: item.Y, z: 500,attributes:item};
		supermap3DUtils.sceneUtil.addEntityBillboard(config);
	}
	  /**
     * 移除Entity
     */
    function remove3DCaseEntity(id) {
		supermap3DUtils.sceneUtil.clearEntityById(id);
    }
	//三维气泡
	function open3DPopupCase(item){
		//关闭查看那视频窗口
		_rightResource.video.closeVideo();
		var mScene = supermap3DUtils.sceneUtil;
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
	    var scenePopup = supermap3DUtils.popup3DUtil;
		var cartesian3 = mScene.cesium.Cartesian3.fromDegrees(item.X,item.Y, 500);
		var _3DPopupConfig = { 
    			tempId: item.popupId, 
    			singlePopup: true, 
    			cartesian3: cartesian3, 
    			data: { content: item }, 
    			width: 200, height: 179, 
    			offsetX:0, offsetY: -30, 
    			supermap3DUtils: supermap3DUtils 
    		};
	    scenePopup.showPopup(_3DPopupConfig);
	}
	//查询失败返回
    function processFailed(error) {
        console.log("查询失败"+error);
    }
	var ajjqSceneEvent={
		supermap3DUtils:supermap3DUtils,
		initScene:initScene,
		viewshed3D:viewshed3D,
		add3DCaseMarker:add3DCaseMarker,
		open3DPopupCase:open3DPopupCase,
		remove3DCaseEntity:remove3DCaseEntity,
		modalRight:queryFeature.modalRight,
        duiyinglou:queryFeature.duiyinglou,
        fangda:queryFeature.fangda,
    	rightModalClear:queryFeature.rightModalClear,
    	closeBuilding:queryFeature.closeBuilding
	};
	module.exports = ajjqSceneEvent;
});