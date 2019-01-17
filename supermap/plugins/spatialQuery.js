/*
 * 空间查询功能
 */

define(function(require,exports,module){
	
	/*
	 * 地图空间查询
	 * config参数（必须）：urlurl--查询所需地图服务；layerName--查询图层名；geometry--查询区域；querySuccess--查询成功回调；
	 * config参数（可选）：tartRecord——查询起始结果号（分页查询）；expectCount——期望返回结果记录个数（分页查询）；queryFailed--查询失败回调；
	 * 					spatialQueryMode--空间查询模式，如果不选默认为INTERSECT（相交）
	 */
	function queryByArea(config){
		var queryParam , queryByGeometryParameters,queryService;
		var queryParams=new Array();
		if(typeof(config.spatialQueryMode)=="undefined") config.spatialQueryMode=SuperMap.REST.SpatialQueryMode.INTERSECT;
		if(typeof(config.startRecord)=="undefined") config.startRecord="0";
		if(typeof(config.expectCount)=="undefined") config.expectCount="100000";
		//若同时对多个图层进行空间查询，则layerName应为数组
		if(Object.prototype.toString.call(config.layerName) == '[object Array]'){
			for(var i=0; i<config.layerName.length; i++){
				queryParam = new SuperMap.REST.FilterParameter({
					name : config.layerName[i]
				});
				queryParams.push(queryParam);
			}
		}else{
			queryParam = new SuperMap.REST.FilterParameter({
				name : config.layerName
			});
			queryParams.push(queryParam);
		}
		queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters({
				queryParams : queryParams,
				geometry : config.geometry,
				spatialQueryMode : config.spatialQueryMode,
				startRecord: config.startRecord,
				expectCount: config.expectCount
			});
		queryService = new SuperMap.REST.QueryByGeometryService(config.url, {
				eventListeners : {
					"processCompleted" : config.querySuccess,
					"processFailed" : function(e){
						if(config.queryFailed==undefined || typeof(config.queryFailed)!="function"){
							queryFailed(e);
						}else{
							config.queryFailed
						}
					}
				}
			});
		queryService.processAsync(queryByGeometryParameters);
	}
	
	/**
	 * 查询失败回调函数
	 * @param {Object} e 返回的错误信息
	 */
	function queryFailed(e){
		console.log(e);
	}
	
	var spatialQuery={
		queryByArea:queryByArea
	}
	module.exports = spatialQuery;
	window.spatialQuery = spatialQuery;
});
