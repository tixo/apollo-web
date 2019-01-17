/*
 * 添加地图图层
 */
define(function(requier, exports, module){
	var Map,mapLayer;
	/*
	 * config对象中的属性：url——要调用的地图的链接； Map——地图控件; addLayer
	 */
	function initAddMapLayer(config){
		Map= config.map;
		mapLayer = new SuperMap.Layer.TiledDynamicRESTLayer("mapLayer", config.url, {
				transparent : true,
				cacheEnabled : true
			}, {
				maxResolution : "auto",
				useCORS:true
			});
			mapLayer.events.on({
				"layerInitialized" : addLayer
		});
		mapLayer.redraw();
	}
	
	/*
	 * 在Map中添加临时图层temLayer
	 */
	function addLayer(){
		Map.addLayers([mapLayer]);
		Map.setLayerIndex(mapLayer , 1);
	}
	
	var addMapLayer={
		initAddMapLayer:initAddMapLayer
	};
	module.exports=addMapLayer;
	window.addMapLayer = addMapLayer;
});