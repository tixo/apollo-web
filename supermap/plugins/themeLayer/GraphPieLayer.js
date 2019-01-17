/*
 * 饼状专题图功能
 * @author zjc
 * 2016.8.19
 */
define(function(require, exports, module) {
	/*
	 *等级符号专题图
	 *config参数（必须）：map——地图对象；expression——统计字段名；fields——要显示的字段；codomain——值域范围；features——统计对象组；contentHTML——弹窗内容；
	 *config参数（可选）：
	 */
	var map,themeLayer,infowin;
	function initGraphPieLayer(config){
		window.themeconfig=config;
		map=config.map;
		//移除之前的等级符号专题图
		window.mapAPI.removeLayerByName('GraphPieLayer');
		// 创建一个饼状图（Pie）统计专题图图层
		themeLayer = new SuperMap.Layer.Graph("GraphPieLayer", "Pie");
		// 指定用于专题图制作的属性字段
		themeLayer.themeFields = config.expression;
		// 配置图表参数
		themeLayer.chartsSetting = {
			// width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
			width: 100,
			height: 100,
			codomain: config.codomain, // 允许图表展示的值域范围，此范围外的数据将不制作图表
			// 饼图扇形（表示字段值的图形）样式
			sectorStyle: { 
				fillOpacity: 0.7,
				shadowColor: '#999',
				shadowBlur:5,
				shadowOffsetX:3,
				shadowOffsetY:3
			},
			// 按字段设置饼图扇形 (样式与 themeLayer.themeFields 数组中的字段名称一一对应)
			//sectorStyleByFields: [{ fillColor: "#FFB980" }, { fillColor: "#5AB1EF" }],
			sectorStyleByFields: [{ fillColor: "#FFB980" }, { fillColor: "#5AB1EF" }, { fillColor: "#B6A2DE" }, { fillColor: "#2EC7C9" }, { fillColor: "#D87A80" },{ fillColor: "#C8E49C" }, { fillColor: "#ED9678" }, { fillColor: "#E7DAC9" }, { fillColor: "#CB8E85" }, { fillColor: "#F3F39D" }],
			// 饼图扇形 hover 样式
			sectorHoverStyle: { fillOpacity: 1 }
		};
		// 注册专题图 mousemove, mouseout事件(注意：专题图图层对象自带 on 函数，没有 events 对象)
		themeLayer.on("mousemove", showInfoWin);
		themeLayer.on("mouseout", closeInfoWin);
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
		// e.target 是图形对象，即数据的可视化对象，饼状图中是扇形。
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
		initGraphPieLayer:initGraphPieLayer,
		addThemeFeatures:addThemeFeatures
	}
	module.exports = GraphPieLayer;
});