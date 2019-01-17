/*
 * 地图（数据）查询功能
 * @author zjc
 * 2016.8.9
 */
define(function(require, exports, module) {
	/*
	 *地图服务查询——sql查询
	 *config参数（必须）：url——查询所需地图服务；layerName——查询图层名；querySuccess——查询成功回调；
	 *config参数（可选）：sql——sql查询语句；groupBy——查询分组字段；startRecord——查询起始结果号（分页查询）；expectCount——期望返回结果记录个数（分页查询）；
	 * 					 fields--查询字段数组，如果不设置则使用系统返回的所有字段；orderBy--排序（字段必须为数值型）;queryFailed——查询失败回调；
	 */
	var queryParam,queryParams, queryBySQLParams, queryBySQLService;
	function querymapBySQL(config){
		queryParams=[];
		//默认查询图层中所有元素
		if(typeof(config.sql)=="undefined") config.sql="1=1";
		if(typeof(config.groupBy)=="undefined") config.groupBy="";
		if(typeof(config.startRecord)=="undefined") config.startRecord="0";
		if(typeof(config.expectCount)=="undefined") config.expectCount="100000";
		if(typeof(config.orderBy)=="undefined") config.orderBy="";
		//若同时对多个图层进行不同的sql查询，则layerName和sql属性应为数组，且图层名和查询条件保持一一对应的关系
		if(Object.prototype.toString.call(config.layerName) == '[object Array]'){
			for(var i=0;i<config.layerName.length;i++){
				if(typeof(config.fields) !="undefined"){
					queryParam = new SuperMap.REST.FilterParameter({
						name: config.layerName[i],
						attributeFilter: config.sql[i],
						fields:config.fields,
						orderBy:config.orderBy
					});
				}else{
					queryParam = new SuperMap.REST.FilterParameter({
						name: config.layerName[i],
						attributeFilter: config.sql[i],
						orderBy:config.orderBy
					});
				}
				queryParams.push(queryParam);
			}
		}else{
			if(typeof(config.fields) !="undefined"){
				queryParam = new SuperMap.REST.FilterParameter({
					name: config.layerName,
					attributeFilter: config.sql,
					groupBy:config.groupBy,
					fields:config.fields,
					orderBy:config.orderBy
				});
			}else{
				queryParam = new SuperMap.REST.FilterParameter({
					name: config.layerName,
					attributeFilter: config.sql,
					groupBy:config.groupBy,
					orderBy:config.orderBy
				});
			}
			queryParams.push(queryParam);
		}
		queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
			queryParams: queryParams,
			startRecord: config.startRecord,
			expectCount: config.expectCount
		});
		queryBySQLService = new SuperMap.REST.QueryBySQLService(config.url, {
			eventListeners: {
				"processCompleted": config.querySuccess,
				"processFailed": function(e){
					if(config.queryFailed==undefined || typeof(config.queryFailed)!="function"){
						queryFailed(e);
						}else{
							config.queryFailed
						}
					}
				}
			});
		queryBySQLService.processAsync(queryBySQLParams);
	}
	
	/**
	 * 地图服务查询--空间查询
	 * config参数（必须）：url--查询所需地图服务；layerName--查询图层名；geometry--查询区域；querySuccess--查询成功回调；
	 * config参数（可选）：tartRecord——查询起始结果号（分页查询）；expectCount——期望返回结果记录个数（分页查询）；
	 * 					spatialQueryMode--空间查询模式，如果不选默认为INTERSECT（相交）;queryFailed--查询失败回调；
	 */
	function querymapByGeometry(config){
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
	 * 地图服务查询--范围查询
	 * config参数（必须）：url--查询所需地图服务；layerName--查询图层名；bounds--查询范围；querySuccess--查询成功回调；
	 * config参数（可选）：startRecord——查询起始结果号（分页查询）；expectCount——期望返回结果记录个数（分页查询）；
	 * 				   queryFailed--查询失败回调；
	 */
	function querymapByBounds(config){
		var queryParam , queryByBoundsParameters,queryService;
		var queryParams=new Array();
		if(typeof(config.startRecord)=="undefined") config.startRecord="0";
		if(typeof(config.expectCount)=="undefined") config.expectCount="100000";
		//若同时对多个图层进行范围，则layerName应为数组
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
		queryByBoundsParameters = new SuperMap.REST.QueryByBoundsParameters({
				queryParams : queryParams,
				bounds:config.bounds,
				startRecord: config.startRecord,
				expectCount: config.expectCount
			});
		queryService = new SuperMap.REST.QueryByBoundsService(config.url, {
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
		queryService.processAsync(queryByBoundsParameters);
	}
	
	
	/**
	 * 地图服务--获取某个地图中的所有子图层
	 * @param {Object} url(必须) 地图服务url
	 * @param {Object} getLayersInfoCompleted(必须) 查询成功后的回调函数
	 * @param {Object} queryFailed(可选) 查询失败后的回调函数
	 */
	function getLayersInfo(config) {
		var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(config.url);
		getLayersInfoService.events.on({
			"processCompleted" : config.getLayersInfoCompleted,
			"processFailed" : function(e){
				if(config.queryFailed==undefined || typeof(config.queryFailed)!="function"){
					queryFailed(e);
				}else{
					config.queryFailed
				}
			}
		});
		getLayersInfoService.processAsync();
	}
	
	/**
	 * 查询失败回调函数
	 * @param {Object} e 返回的错误信息
	 */
	function queryFailed(e){
		console.log(e);
	}
	
	var query={
		querymapBySQL:querymapBySQL,
		querymapByBounds:querymapByBounds,
		querymapByGeometry:querymapByGeometry,
		getLayersInfo:getLayersInfo
	}
	module.exports = query;
	window.query=query;
})