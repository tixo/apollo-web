/**
 *根据传入的点的x,y坐标查询此点所属的片区
 *x: x坐标（数值）
 *y: y坐标（数值）
 */
function queryFeatureByGeometry(x,y){
	var point = new SuperMap.Geometry.Point(x,y);
	var getFeaturesByGeometryParameters, getFeaturesByGeometryService;
	var url = top.services.queryUrl;
	//新建查询参数
	getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters({
		datasetNames: ["HTC02:片区面"],
		toIndex: -1,
		spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
		geometry: point
	});
	//新建查询服务
	getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(url, {
		eventListeners: {
			"processCompleted": processCompleted,
			"processFailed": function(e){
				console.log("查询所属片区面失败！");
			}
		}
	});
	//异步查询
	getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 *查询成功的回调函数
 */
function processCompleted(getFeaturesEventArgs){
	var feature;
	if(getFeaturesEventArgs.result && getFeaturesEventArgs.result.features.length>0){
		feature = getFeaturesEventArgs.result.features[0];
	}
	$('#district',window.parent.document).val(feature.attributes.LAYER);
}