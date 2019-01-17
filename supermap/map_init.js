/*
 * 地图api组
 * @author qhj
 */
define(function(require, exports, module) {
	var meature=require('./plugins/measure.js');
	var query=require('./plugins/query.js');	var popup=require('./plugins/customPopup.js');
	var addMapLayer=require('./plugins/addMapLayer.js');
	var RankSymbolLayer=require("./plugins/themeLayer/RankSymbolLayer.js");
	var GraphPieLayer=require("./plugins/themeLayer/GraphPieLayer.js");
	var ColorGradingLayer=require("./plugins/themeLayer/ColorGradingLayer.js");
	var Bar3DLayer=require("./plugins/themeLayer/Bar3DLayer.js");
	var selectFeature = require('./plugins/selectFeature.js');
	var drawFeatures = require('./plugins/drawFeatures.js');
	var mapToImg = require('./plugins/MapToImg.js');
	var jwdsj_bkgj = require('./plugins/jwdsj_bkgj.js');
	var services=parent.window.services;
	//定义地图相关变量
	var map,plotting,baseLayer,baseLayer2,drawPolygon1,satelliteLayer,vectorLayer,markerLayer,elementsLayer,animatorVector,plottingLayer,goAnimationManager;
	$(document).ready(function(){
		//打开加载动画
		$("#loadingbar_bg").css("display","block");
		//平移缩放控件向下平移
        $(".smControlPanZoomBar").css("top", $(".main_middle_top").height());
		//初始化图层
		baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("yingxiang", services.baseMap,
        				{transparent: true, cacheEnabled:true}, {maxResolution:"auto",useCORS:true});
        
		vectorLayer = new SuperMap.Layer.Vector("vectorLayer");
		 //几何圆查询
        drawPolygon1 = new SuperMap.Control.DrawFeature(vectorLayer, SuperMap.Handler.RegularPolygon, {handlerOptions: {sides: 50}});
		drawVectorLayer = new SuperMap.Layer.Vector("drawVectorLayer");
		markerLayer = new SuperMap.Layer.Markers("markerLayer");
		elementsLayer = new SuperMap.Layer.Elements("elementsLayer");
		//创建一个名为"AnimatorVector"、采用 Canvas渲染方式渲染的矢量动画图层。 
		animatorVector = new SuperMap.Layer.AnimatorVector("animatorVector"); 
        baseLayer.events.on({"layerInitialized": addLayer1});
         map = new SuperMap.Map("map", {
				controls: [
					new SuperMap.Control.Navigation(),
					 /*
					new SuperMap.Control.PanZoomBar({showSlider:true}),*/
//					new SuperMap.Control.MousePosition(),
				/*	new SuperMap.Control.ScaleLine(),*/
					drawPolygon1
				]
				// [left, bottom, right, top] 
				//restrictedExtent:new SuperMap.Bounds(108.92244966802625,34.117458039191355,109.02037352006624,34.19744903376123)
			});
			var bounds = new SuperMap.Bounds(108.92244966802625,34.11711344641523,109.02248777112224,34.19483456198223);
            map.restrictedExtent=bounds;
            //map.numZoomLevels=5;
        //初始化测量控件
		meature.measureInit(map,vectorLayer,"map");
        //初始化自定义气泡控件
        popup.popupInit(map,elementsLayer);
        //初始化动态标会总控制类
        plotting = new SuperMap.Plotting.getInstance(map, services.plotUrl);
        //动态标绘图层
        plottingLayer = new SuperMap.Layer.PlottingLayer("plottingLayer", services.plotUrl);
		//设置动画管理器
		goAnimationManager = plotting.getGOAnimationManager();
		goAnimationManager.setMap(map);

	});

	function addLayer1() {		
		baseLayer2 = new SuperMap.Layer.TiledDynamicRESTLayer("map2D", services.map2D,
        				{transparent: true, cacheEnabled:true}, {maxResolution:"auto",useCORS:true});
		baseLayer2.events.on({"layerInitialized": addLayer2});
	}
	function addLayer2() {
		baseLayer.setVisibility(false);
		baseLayer2.setVisibility(true);
		map.addLayers([baseLayer,baseLayer2,vectorLayer,drawVectorLayer,markerLayer,elementsLayer,animatorVector,plottingLayer]);
		map.setCenter(new SuperMap.LonLat(services.mapconfig.x, services.mapconfig.y), services.mapconfig.zoom);
        map.setLayerIndex(baseLayer , 0);
        map.setLayerIndex(baseLayer2 , 1);
        map.setLayerIndex(vectorLayer , 2);
        map.setLayerIndex(markerLayer , 3);
        map.setLayerIndex(elementsLayer , 4);
        map.setLayerIndex(animatorVector , 5);
        map.setLayerIndex(plottingLayer , 6);
        //取消加载动画
        $("#loadingbar_bg").css("display","none");
  	}
	/*
	 * author:qhj
	 * 以下是地图组公共方法接口
	*/
	//全幅显示
	function fullview(){
		map.zoomTo(2);
	}
	//地图范围重新计算
	function resize(){
		map.updateSize();
	}
	//切换底图
	function changeBaseMap(type){
		if(type==="yingxiang"){
			baseLayer.setVisibility(true);
			if(baseLayer2!=undefined){
				baseLayer2.setVisibility(false);
			}
			map.setBaseLayer(baseLayer);
		}else if(type==="map2D"){
			baseLayer.setVisibility(false);
			baseLayer2.setVisibility(true);
			map.setBaseLayer(baseLayer2);
		}
	}
	//移除图层
	function removeLayerByName(name){
		var layer=map.getLayersByName(name);
		if(layer.length!=0){
			for(var i=0;i<layer.length;i++){
				map.removeLayer(layer[i]);
			}
		}
	}
	//将指定图层置顶
	function setTopLayer(name){
		if(map.getLayersByName(name).length==0) return;
		var layer=map.getLayersByName(name)[0];
		var index=map.getLayerIndex(layer);
		map.raiseLayer(layer,map.layers.length-index);
	}
	//修改图层的z-index
    function setLayerZindex(name,zindex){
		var layer = map.getLayersByName(name);
        if(layer.length > 0){
      		var layerId = layer[0].id;
      		$(".smLayerDiv[id='"+layerId+"']").css("z-index",zindex);
        }
	}
    //重置所有图层顺序
    function resetLayerZindex(){
    	setLayerZindex("yingxiang",0);
    	setLayerZindex("map2D",1);
		setLayerZindex("vectorLayer",3);
		setLayerZindex("drawVectorLayer",4);
		setLayerZindex("markerLayer",5);
		setLayerZindex("elementsLayer",6);
		setLayerZindex("animatorVector",7);
		setLayerZindex("plottingLayer",7);
    }
	//将iframe中的feature对象转换为父页面可以通信的格式
	function transFeatureToParent(feature){
		var geometry=feature.geometry.toString();
		var attributes=feature.attributes;
		var style=JSON.stringify(feature.style);
		var new_feature={
			geometry:geometry,
			attributes:attributes,
			style:style
		}
		return new_feature;
	}
	//父页面接收iframe传来的feature对象
	function getFeatureFormIframe(feature){
		var new_geometry = new SuperMap.Geometry.fromWKT(feature.geometry);
		var new_style = JSON.parse(feature.style);
		var new_feature = new SuperMap.Feature.Vector(new_geometry,null,new_style);
		new_feature.attributes=feature.attributes;
		return new_feature;
	}
	//创建矢量点对象
	function creatPoint(config){
		var geometry = new SuperMap.Geometry.Point(config.x, config.y); 
		var pointFeature = new SuperMap.Feature.Vector(geometry); 
		pointFeature.attributes = config.attributes==undefined ? {}:config.attributes;
		pointFeature.style = {
			label: config.label==undefined ? "":config.label, 
			fontColor: config.fontColor==undefined ? "#00b186":config.fontColor, 
			fontOpacity:config.fontOpacity==undefined ? 1:config.fontOpacity, 
			fontFamily:config.fontFamily==undefined ? "微软雅黑":config.fontFamily,
			fontSize:config.fontSize==undefined ? "0.75em":config.fontSize, 
			labelYOffset: config.labelYOffset==undefined ? 0:config.labelYOffset, 
			labelXOffset: config.labelXOffset==undefined ? 0:config.labelXOffset,
			fill: config.fill==undefined ? false:config.fill,
			fillColor: config.fillColor==undefined ? "#ee9900":config.fillColor,
			fillOpacity: config.fillOpacity==undefined ? 1:config.fillOpacity,
			stroke: config.stroke==undefined ? false:config.stroke,
			strokeColor: config.strokeColor==undefined ? "#ee9900":config.strokeColor,
			strokeOpacity: config.strokeOpacity==undefined ? 1:config.strokeOpacity,
			strokeWidth: config.strokeWidth==undefined ? 1:config.strokeWidth,
			graphic: config.graphic==undefined ? false:config.graphic,
			externalGraphic: config.externalGraphic==undefined ? "":config.externalGraphic,
			graphicWidth: config.graphicWidth==undefined ? 20:config.graphicWidth,
			graphicHeight: config.graphicHeight==undefined ? 20:config.graphicHeight,
			graphicOpacity: config.graphicOpacity==undefined ? 1:config.graphicOpacity,
			graphicXOffset: config.graphicXOffset==undefined ? 0:config.graphicXOffset,
			graphicYOffset: config.graphicYOffset==undefined ? 0:config.graphicYOffset,
			rotation: config.rotation==undefined ? 0:config.rotation
		};
		return pointFeature;
	}

	//清除所有地图要素至初始状态
	function clearAll(){
		vectorLayer.removeAllFeatures();
		vectorLayer.refresh();
		drawVectorLayer.removeAllFeatures();
		drawVectorLayer.refresh();
		markerLayer.clearMarkers();
		popup.clearPopup();
		window.ui.closeCenterModule();
		window.ui.closeBottomModule();
		//清除测量要素
		if(parent.window.measureIndex!=undefined){
			meature._clearMeasureResult(parent.window.measureIndex);
		}
	}
	
	/**
	 * 设置地图中心点
	 * @param {Object} config
	 */
	function setMapCenter(config){
		map.setCenter(new SuperMap.LonLat(config.x , config.y), config.zoom);
	}
	
	/**
	 * 将json格式的数据导出为Excel表格
	 * @param {Object} fileName 导出后的文件名（可选）
	 * @param {Object} datas 要导出的数据（必需）
	 * @param {Object} header 标题（必需）
	 */
	function jsonExportToExcel(config){
		if(config.datas==undefined || config.header==undefined){
			console.log("缺少导出参数！");
			return;
		}
		var option={};
		option.fileName = config.fileName==undefined ? 'excel':config.fileName;
		option.datas=[
			{
				sheetData:config.datas,
				sheetHeader:config.header
			}
		];
		var toExcel=new ExportJsonExcel(option);
		toExcel.saveExcel();
	}
	
	var mapAPI={
		map: map,
		drawPolygon1:drawPolygon1,
		plotting:plotting,
		fullview:fullview,
		resize:resize,
		removeLayerByName:removeLayerByName,
		setTopLayer:setTopLayer,
		setLayerZindex:setLayerZindex,
		resetLayerZindex:resetLayerZindex,
		transFeatureToParent:transFeatureToParent,
		getFeatureFormIframe:getFeatureFormIframe,
		clearAll:clearAll,
		setMapCenter:setMapCenter,
		changeBaseMap: changeBaseMap,
		creatPoint:creatPoint,
		jsonExportToExcel:jsonExportToExcel
	}
	var pluginsAPI={
		initRankSymbolLayer:RankSymbolLayer.initRankSymbolLayer,
		initGraphPieLayer:GraphPieLayer.initGraphPieLayer,
		initColorGradingLayer:ColorGradingLayer.initColorGradingLayer,
		initBar3DLayer:Bar3DLayer.initBar3DLayer,
		addMapLayer:addMapLayer.initAddMapLayer,
		initSelectFeature:selectFeature.initSelectFeature,
		selectFeature:selectFeature,
		mapToImg:mapToImg,
		popup:popup,
		jwdsj_bkgj:jwdsj_bkgj,
		meature:meature
	}
	var mapContent={
		baseLayer:baseLayer,
		vectorLayer:vectorLayer,
		drawVectorLayer:drawVectorLayer,
		markerLayer:markerLayer,
		elementsLayer:elementsLayer,
		animatorVector:animatorVector,
		plottingLayer:plottingLayer,
		goAnimationManager:goAnimationManager
	}
	
	var mapUtil = {
		mapAPI:mapAPI,
		pluginsAPI:pluginsAPI,
		mapContent:mapContent
	};
	module.exports = mapUtil;

	parent.window.mapUtil=mapUtil;
});