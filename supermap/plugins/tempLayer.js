
/*
 * 子图层控制功能:
 * 		1.勾选图层查询并显示对应的图层信息(通过layerID控制)；
 * 		2.勾选图层根据选择区域不同进行SQL过滤查询,显示满足条件的图层信息.
 */

define(function(require,exports,module){
	//初始化子图层控制所需的参数对象
	var URL,Map;
	//临时图层及其ID
	var temLayer , tempLayerID = null;
	//请求得到的子图层信息
	var subLayers = new Array();
	//被勾选的图层
	var layerName = new Array();
	//sql查询语句
	var SQL=[];

	/*
	 * 初始化子图层控制
	 * 参数：url——所需地图服务；map——地图类，用来控制添加到其中的图层；
	 */
	function initLayer(url,map){
		URL=url;
		Map=map;
		getLayersInfo();
	}
	
	/*
	 * 获取地图状态参数
	 */
	function getLayersInfo() {
		//获取地图状态参数必设：url
		var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(URL);
		getLayersInfoService.events.on({
			"processCompleted" : getLayersInfoCompleted
		});
		getLayersInfoService.processAsync();
	}
	
	/*
	 * 与服务器交互成功，得到子图层信息
	 */
	function getLayersInfoCompleted(getLayersInfoEventArgs) {
		subLayers = [];
		if (getLayersInfoEventArgs.result) { {
				if (getLayersInfoEventArgs.result.subLayers) {
					for (var j = 0; j < getLayersInfoEventArgs.result.subLayers.layers.length; j++) {
						subLayers.push(getLayersInfoEventArgs.result.subLayers.layers[j]);
					}
				}
			}
		}
		window.subLayers = subLayers;
		createTempLayer();
	}
	
	/*
	 * 创建临时图层来初始化当前地图显示
	 */
	function createTempLayer() {
		//子图层控制参数必设：url、mapName、SetLayerStatusParameters
		var layerStatusParameters = new SuperMap.REST.SetLayerStatusParameters();
		layerStatusParameters = getLayerStatusList(layerStatusParameters);
		var setLayerStatusService = new SuperMap.REST.SetLayerStatusService(URL);
		setLayerStatusService.events.on({
			"processCompleted" : createTempLayerCompleted
		});
		setLayerStatusService.processAsync(layerStatusParameters);
	}
	
	/*
	 * 获取当前地图子图层状态信息
	 */
	function getLayerStatusList(parameters,layerName) {
		var layerIdList=[];
		for (var i = 0; i < subLayers.length; i++) {
			var layerStatus = new SuperMap.REST.LayerStatus();
			layerStatus.layerName = subLayers[i].name;
			layerStatus.isVisible = subLayers[i].visible;
			if(typeof(layerName)!="undefined"){
				for(var j = 0; j < layerName.length; j++){
					if (subLayers[i].caption == layerName[j]) {
						layerStatus.isVisible = true;
						layerStatus.displayFilter = SQL;
					}
				}
			}
			var config={
					id:i,
					layerStatus:layerStatus
				};
			layerIdList.push(config);
		}
		layerIdList.sort(function(a,b){
			return a.id - b.id;
		});
		for(var i=0; i<layerIdList.length; i++){
			parameters.layerStatusList.push(layerIdList[i].layerStatus);
		}
		//设置资源在服务端保存的时间，单位为分钟，默认为10
		parameters.holdTime = 30;
		window.parameters=parameters;
		return parameters;
	}
	
	/*
	 * 与服务器交互成功，创建临时图层
	 */
	function createTempLayerCompleted(createTempLayerEventArgs) {
		tempLayerID = createTempLayerEventArgs.result.newResourceID;
		//创建 TiledDynamicRESTLayer
		temLayer = new SuperMap.Layer.TiledDynamicRESTLayer("tempLayer", URL, {
				transparent : true,
				cacheEnabled : false,
				redirect : true,
				layersID : tempLayerID
			}, {
				maxResolution : "auto",
				useCanvas:false,
				useCORS:true,
				bufferImgCount : 0
			});
			temLayer.bufferImgCount = 0;
			temLayer.events.on({
				"layerInitialized" : addLayer
		});
	}
	
	/*
	 * 在Map中添加临时图层temLayer
	 */
	function addLayer(){
		Map.addLayers([temLayer]);
		Map.setLayerIndex(temLayer , 1);
	}
	
	/*
	 * 控制图层的显示与隐藏状态
	 * 		layersName:被勾选图层的Name
	 * 		sql:sql查询语句
	 */
	function setLayerStatus(layersName,sql) {
		layerName = layersName;
		SQL = sql;
//		queryAllFeatures();
		queryPartFeatures();
	}
	
	/*
	 * 适用于显示一个图层内全部的要素
	 */
	function queryAllFeatures(){
		var layersId = getLayersID(layerName);
		var str = "[0:"+layersId+"]";
		
		//当所有图层都不可见时
		if (str.length < 5) {
			str = "[]";
		}
		temLayer.params.layersID = str;
		temLayer.redraw();
	}
	/*
	 * 适用于显示一个图层内部分要素的信息
	 * （此方法用于按区域代码查询,如果有别的需求可更改SQL查询语句来实现）
	 */
	function queryPartFeatures(){
		var layerStatusParameters = new SuperMap.REST.SetLayerStatusParameters();
		layerStatusParameters = getLayerStatusList(layerStatusParameters,layerName);
		layerStatusParameters.resourceID = tempLayerID;
		var setLayerStatusService = new SuperMap.REST.SetLayerStatusService(URL);
		setLayerStatusService.events.on({ "processCompleted": setLayerStatusCompleted});
		setLayerStatusService.processAsync(layerStatusParameters);
	}
	
	//获取子图层的layersID
    function getLayersID(layersName){
    	var layersList = [];
    	if(layersName.length==0) return layersList;
    	for(var i=0; i<layersName.length; i++){
        	if(subLayers != null && subLayers != "null" && subLayers != ""){
	            for (var j = 0; j < subLayers.length; j++) {
	                if(subLayers[j].name.substr(0,subLayers[j].name.indexOf("@"))==layersName[i]){
	                    layersList.push(j);
	                }
	            }
        	}
    	}
    	layersList.sort(function(a,b){return a-b;});
        return layersList;
    }
       
	//查询完成后重绘地图
	function setLayerStatusCompleted(setLayerStatusEventArgs){
		temLayer.redraw();
	}
	
	var tempLayer={
		initLayer : initLayer,
		setLayerStatus : setLayerStatus
	}
	module.exports=tempLayer;
	window.tempLayer=tempLayer;
});
