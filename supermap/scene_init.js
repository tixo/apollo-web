/*
 * 打开场景
 * 
 */
define(function(require, exports, module) {
	//场景服务
	var services=window.services;
	if(services ==undefined)services=parent.window.services;
	seajs.use(['/jwdsj/mymap/supermap/webgl/supermap/3D/supermap3DUtils.js'], function(supermap3DUtils){
			//先初始化场景
			var config={
				cesium: Cesium,
				id: "cesiumContainer"
			};
			supermap3DUtils.sceneUtil.initScene(config);
			//再打开场景
			var json = {
				url: services.sceneUrl,
				singleDataLayerNames: globalConstant.singleDataLayerNames,
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
					parent.ui.closeLoading();
				}
			};
			supermap3DUtils.sceneUtil.openScene(json);
	});
});