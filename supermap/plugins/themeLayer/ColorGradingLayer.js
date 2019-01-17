/*
 * 分级设色专题图功能
 */
define(function(require,exports,module){
	var themeLayer;
	/*
	 * 初始化专题图层
	 * config参数（必须）：map--地图类，用于添加专题图层ColorGradingLayer;features--所有的要统计的矢量要素;count--需要统计的字段;num--统计要素数量最大的值；
	 */
	function initColorGradingLayer(config){
		//先清除上次的显示结果
		window.mapAPI.removeLayerByName("ColorGradingLayer");
		//清除图例
		$("#mapLegend").remove();
		//创建专题图层
		themeLayer = new SuperMap.Layer.Range("ColorGradingLayer");
		config.map.addLayer(themeLayer);
		//将比例符号图置顶
		window.mapAPI.setTopLayer("RankSymbolLayer");
		window.mapAPI.setTopLayer("GraphPieLayer");
		window.mapAPI.setTopLayer("Bar3DLayer");
		//添加features到地图
		addThemeFeatures(config.features);
		//设置专题地图样式
		initThemeStyle(config.count,config.num);
	}
	
	/*
	 * 设置专题地图样式
	 * 参数（必须）：count--用于范围分段的属性字段名称;num--所有区域中所要统计要素数量的最大值，用于设置颜色区间
	 */
	function initThemeStyle(count,num){
		//设置透明度
		themeLayer.setOpacity(0.8);
		// 图层基础样式
		themeLayer.style = {
			shadowBlur : 16,
			shadowColor : "#000000",
			fillColor : "#FFFFFF"
		};
		// 用于范围分段的属性字段名称
		themeLayer.themeField = count;
		// 风格数组，设定分段范围对应的样式
		themeLayer.styleGroups = [
			{
				start : 0,
				end : (num-(num%4))/4+1,
				style : {color : '#FFECEC'}
			}, 
			{
				start : (num-(num%4))/4+1,
				end : ((num-(num%4))/4)*2+1,
				style : {color : '#FFB5B5'}
			}, 
			{
				start : ((num-(num%4))/4)*2+1,
				end : ((num-(num%4))/4)*3,
				style : {color : '#FF7575'}
			}, 
			{
				start : ((num-(num%4))/4)*3,
				end : (num*1+1),
				style : {color : '#FF0000'}
			}
		]
		themeLayer.redraw();
		window.ui.dialog.close();
		//添加图例
		$(".main_middle_map").append("<div id='mapLegend' style='position:absolute; bottom:0px; left:0px; z-index:9999; padding-bottom:5px; padding-right:5px; border:2px solid #4978b0; border-bottom:0px; background-color:white'>"+
										"<img id='mapLegendBtn' src='supermap/theme/images/theme-close.png' style='position:absolute; top:0px; right:0px; cursor:pointer; margin-bottom:5px'/>"+
										"<div id='legendTitle'; style='text-align:center; line-height:40px; font-size:1.2em; font-weight:bold'>"+"图&nbsp;&nbsp;例"+"</div>"+
										"<table id='legendTable'>"+
											"<tr>"+
												"<td style='text-align:center; vertical-align:center; padding-right:10px; padding-left:10px'>"+"指标数量"+"</td>"+
												"<td>"+"颜色等级"+"</td>"+
											"</tr>"+
											"<tr>"+
												"<td style='text-align:center; vertical-align:center; padding-right:10px; padding-left:10px'>&le;"+(num-(num%4))/4+"</td>"+
												"<td style='background-color:#FFECEC'></td>"+
											"</tr>"+
											"<tr>"+
												"<td style='text-align:center; vertical-align:center; padding-right:10px; padding-left:10px'>&le;"+((num-(num%4))/4)*2+"</td>"+
												"<td style='background-color:#FFB5B5'></td>"+
											"</tr>"+
											"<tr>"+
												"<td style='text-align:center; vertical-align:center; padding-right:10px; padding-left:10px'>&le;"+((num-(num%4))/4)*3+"</td>"+
												"<td style='background-color:#FF7575'></td>"+
											"</tr>"+
											"<tr>"+
												"<td style='text-align:center; vertical-align:center; padding-right:10px; padding-left:10px'>&le;"+num+"</td>"+
												"<td style='background-color:#FF0000'></td>"+
											"</tr>"+
										"</table>"+
									"</div>");
		//初始化图例的显示和隐藏
		initMapLegendBtn();
	}
	
	//添加features到地图
	function addThemeFeatures(features){
		var new_feautes=[];
		for(var i=0;i<features.length;i++){
			var new_geometry = new SuperMap.Geometry.fromWKT(features[i].geometry);
			var new_style = JSON.parse(features[i].style);
			var feature = new SuperMap.Feature.Vector(new_geometry,null,new_style);
			feature.attributes=features[i].attributes;
			new_feautes.push(feature);
		}
		themeLayer.addFeatures(new_feautes);
		themeLayer.redraw();
	}
	
	/*
	 * 控制图例显示和隐藏的事件
	 */
	function initMapLegendBtn(){
		var flag=0,width="0px",height="0px";
		if($("#mapLegendBtn").length>0){
			width=$("#mapLegend").width();
			height=$("#mapLegend").height();
			$("#mapLegendBtn").click(function(){
				if(flag==0){
					$("#legendTitle").css("display","none");
					$("#legendTable").css("display","none");
					$("#mapLegend").css({"width":"10px","height":"10px"});
					$("#mapLegendBtn").attr("src","supermap/theme/images/theme-open.png");
					flag=1;
				}else{
					$("#mapLegend").css({"width":""+width+"px","height":""+height+"px"});
					$("#mapLegendBtn").attr("src","supermap/theme/images/theme-close.png");
					$("#legendTitle").css("display","block");
					$("#legendTable").css("display","block");
					flag=0;
				}
			});
		}
	}
	
	var colorGrading={
		initColorGradingLayer:initColorGradingLayer
	}
	
	module.exports=colorGrading;
});
