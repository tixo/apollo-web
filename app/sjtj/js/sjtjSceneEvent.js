// 加载场景功能入口
define(function(require, exports, module) {
    var supermap3DUtils = require("../../../supermap/webgl/supermap/3D/supermap3DUtils.js");
    var mScene = supermap3DUtils.sceneUtil;
	var queryFeature = require('../../../app/yibiaosanshi/js/queryFeature.js');
	var ajax = require('../../../scheduling/app/common/ajax.js');
    function initScene(services) {
        //开启加载动画
        parent.ui.openLoading();
        //先初始化场景
        var config = {
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
                roll: services.sceneconfig.roll,
                type: services.sceneconfig.type
            },
            callbackOpenedScene: function() {
            	queryFeature.queryFeature(mScene,supermap3DUtils,ajax);
                //关闭加载动画
                parent.ui.closeLoading();
            }
        };
        //所使用的是：scene.js的 openScene方法
        mScene.openScene(json);
        //注册测距、测高、测面积控件
		supermap3DUtils.measure3DUtil.initMeasure3DControl(supermap3DUtils.sceneUtil.cesium,supermap3DUtils.sceneUtil.viewer);
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
    			}else if(result._feature.MODELNAME.indexOf("Box")!=-1){
    				queryFeature.getBjz(result._feature.NO);
    			}else if(result._feature.BUILDINGID.length>10){
    				queryFeature.getDanpu(result);
    			}else{
    				queryFeature.getBuildingMessage(result);
    			}
    		}else{
    			queryFeature.getDanweiInfo(result);  //点击单层的单击事件
    		}
    	}else{
    		var item = result._billboard.attributes;
    		if(item.scene!==undefined){
    			mysjtj.open3DPopupWin(result);
    		}else{
    			_rightResource.open3DPopupWin(result);
    		}
    	}
    }
    /**
     * 添加 事件Entity
     */
    function addEntity(config) {
        mScene.addEntityBillboard(config);
    }

    /**
     * 移除Entity
     */
    function removeEntity(id) {
        var entity = mScene.getEntityById(id);
        if(entity!=null){
        	mScene.clearEntities(entity);
        }
    }

    /**
     * 判断Entity是否存在
     */
    function isExist(id) {
        var entities = mScene.getAllEntities();
        $.each(entities, function(i, item) {
            if (item.eId === id) {
                return true;
            }
        });
        return false;
    }
	//查询失败返回
    function processFailed(error) {
        console.log("查询失败"+error);
    }
    var sjtjSceneEvent = {
        supermap3DUtils: supermap3DUtils,
        initScene: initScene,
        addEntity: addEntity,
        removeEntity: removeEntity,
        isExist: isExist,
        modalRight:queryFeature.modalRight,
        duiyinglou:queryFeature.duiyinglou,
        fangda:queryFeature.fangda,
    	rightModalClear:queryFeature.rightModalClear,
    	closeBuilding:queryFeature.closeBuilding
    };
    module.exports = sjtjSceneEvent;
});