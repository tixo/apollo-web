/*
 * 柱状专题图功能
 */
define(function(require, exports, module) {
	/*
	 *等级符号专题图
	 *config参数（必须）：map——地图对象；expression——统计字段名；fields——要显示的字段；codomain——值域范围；features——统计对象组；contentHTML——弹窗内容；
	 * 				  axisYLabels——Y轴标签；
	 */
	var map,themeLayer,infowin;
	function initBar3DLayer(config){
		window.themeconfig=config;
		map=config.map;
		//移除之前的等级符号专题图
		window.mapAPI.removeLayerByName('Bar3DLayer');
		// 创建一个三维柱状图（Bar3D）统计专题图图层
		themeLayer = new SuperMap.Layer.Graph("Bar3DLayer", "Bar3D");
		// 指定用于专题图制作的属性字段
		themeLayer.themeFields = config.expression;
		// 配置图表参数
		themeLayer.chartsSetting = {
			// width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
			width: 70*config.expression.length<160?160:70*config.expression.length,
			height: 120,
			codomain: config.codomain, // 允许图表展示的值域范围，此范围外的数据将不制作图表
			// 3d 柱条正面样式（3d 柱条的侧面和顶面会以 3d 柱条正面样式为默认样式）
			barFaceStyle: {
			stroke: true
			},
			// 按字段设置 3d 柱条正面样式(样式与 themeLayer.themeFields 数组中的字段名称一一对应)
			barFaceStyleByFields: [{ fillColor: "#FFB980" }, { fillColor: "#5AB1EF" }, { fillColor: "#B6A2DE" }, { fillColor: "#2EC7C9" }, { fillColor: "#D87A80" },{ fillColor: "#C8E49C" }, { fillColor: "#ED9678" }, { fillColor: "#E7DAC9" }, { fillColor: "#CB8E85" }, { fillColor: "#F3F39D" }],
				// 3d 柱条正面 hover 样式（3d 柱条的侧面和顶面 hover 会以 3d 柱条正面 hover 样式为默认 hover 样式）
				barFaceHoverStyle: {
				stroke: true,
				strokeWidth: 2,
				strokeColor: "#ffff00"
			},
			xShapeBlank: [15, 15, 15], // 水平方向上的空白间距参数
			axisYTick: config.axisYLabels.length-1, // y 轴刻度数量
			useXReferenceLine: true, // 使用参考线
			xReferenceLineStyle: {strokeColor: "#008acd", strokeOpacity: 0.4}, // 参考线样式
			axisYLabels: config.axisYLabels, // y 轴标签
			axisXLabels: config.expression, // x 轴标签
			backgroundStyle: { // 背景样式
				fillColor: "#d1eeee",
				shadowBlur: 12,
				shadowColor: "#d1eeee"
			},
			backgroundRadius: [5, 5, 5, 5] // 背景框圆角参数
		};
		// 注册专题图 mousemove, mouseout事件(注意：专题图图层对象自带 on 函数，没有 events 对象)
		themeLayer.on("mousemove", showInfoWin);
		themeLayer.on("mouseout", closeInfoWin);
		//设置themeLayer透明度
		themeLayer.setOpacity(0.9);
		// 注册地图 mousemove，用于获取当前鼠标在地图中的像素位置
		map.events.on({"mousemove":function(e){
			infowinPosition = e.xy.clone();
			// 偏移
			infowinPosition.x += 40;
			infowinPosition.y -= 25;
		}});
		map.addLayer(themeLayer);
		addThemeFeatures(config);
	}
	//构建 feature 数据, 专题图的数据必须是 SuperMap.Feature.Vector
	function addThemeFeatures(config) {
		clearThemeLayer();
		//features结构重组
		var newFeatures = [];
		var features=config.features;
		for(var i = 0; i < features.length; i++){
			var geo = new SuperMap.Geometry.Point(features[i].attributes.SmX, features[i].attributes.SmY);
			var attrs = {};
			for(var j=0;j<config.fields.length;j++){
				attrs[config.fields[j]]=features[i].attributes[config.fields[j]];
			}
			var fea = new SuperMap.Feature.Vector(geo, attrs);
			newFeatures.push(fea);
		}
		themeLayer.addFeatures(newFeatures);
		window.ui.dialog.close();
	}
	// 清除专题图层中的内容
	function clearThemeLayer() {
		themeLayer.clear();
		closeInfoWin();
	}
	
	// 显示地图弹窗
	function showInfoWin(e){
		// e.target 是图形对象，即数据的可视化对象，三维柱状图中是指三维柱条;
		// 图形对象的 refDataID 属性是数据（feature）的 id 属性，它指明图形对象是由那个数据制作而来;
		// 图形对象的 dataInfo 属性是图形对象表示的具体数据，他有两个属性，field 和 value;
		if(e.target && e.target.refDataID && e.target.dataInfo){
			closeInfoWin();
			// 获取图形对应的数据 (feature)
			var fea = themeLayer.getFeatureById(e.target.refDataID);
			var info = e.target.dataInfo;
			// 弹窗内容
			var contentHTML = window.themeconfig.contentHTML;
			for(var i=0;i<window.themeconfig.fields.length;i++){
				contentHTML=contentHTML.replace("{{"+window.themeconfig.fields[i]+"}}",fea.attributes[window.themeconfig.fields[i]]);
			}
			contentHTML=contentHTML.replace("{{FILED}}",info.field);
			contentHTML=contentHTML.replace("{{VALUE}}",info.value);
			// 弹出框大小
			if(window.screen.width<=1440){
				//计算弹出框高度
				var contentHeight=55+Math.ceil($(contentHTML).text().length/11)*parseInt($("html").css("font-size"));
				var infowinSize = (SuperMap.Browser.name == "firefox")? new SuperMap.Size(200, contentHeight+15): new SuperMap.Size(200, contentHeight);
			}else{
				//计算弹出框高度
				var contentHeight=70+Math.ceil($(contentHTML).text().length/11)*parseInt($("html").css("font-size"));
				var infowinSize = (SuperMap.Browser.name == "firefox")? new SuperMap.Size(200, contentHeight+15): new SuperMap.Size(200, contentHeight);
			}
			// 弹出窗地理位置
			var lonLat = map.getLonLatFromPixel(infowinPosition);
			infowin = new SuperMap.Popup(
				"infowin",
				lonLat,
				infowinSize,
				contentHTML,
				false,
				false,
				null);
			infowin.setBackgroundColor("#fff");
			infowin.setOpacity(0.8);
			if(infowin) map.removePopup(infowin);
			map.addPopup(infowin);
		}
	}
	// 移除和销毁地图弹窗
	function closeInfoWin() {
		if(infowin) {
			try {
				map.removePopup(infowin);
			}
			catch(e) {
				alert(e.message);
			}
		}
	}
	var GraphPieLayer={
		initBar3DLayer:initBar3DLayer,
		addThemeFeatures:addThemeFeatures
	}
	module.exports = GraphPieLayer;
});