/**
 * 绘制点、线、面功能
 */
define(function(require,exports,module){
	var drawPoint,drawLine,drawPolygon,drawCircle,drawRectangle;
	
	/**
	 * 初始化绘制控件
	 * @param {Object} config：{} 初始化绘制控件所需要的参数
	 * 					必须参数：type--绘制类型（POINT，LINE，POLYGON，CIRCLE,RECTANGLE）；map--地图类；highLightlayer--初始化绘制多边形控件必须的vectorLayer图层
	 * 							drawCompleted--绘制完成的回调函数
	 * 					可选参数：radius--圆的半径，如果设置为非零有效值，则在鼠标移动和拖拽过程中将会绘制一个固定半径的；如果这个属性没有设置，可以通过鼠标拖拽来改变多边形的大小。默认值为 null。此属性只对画圆有效；
	 */
	function initDrawControl(config){
		if(config.type==undefined || config.map==undefined || config.highLightlayer==undefined || config.drawCompleted==undefined){
			console.log("初始化绘制控件必须参数不完整！");
			return;
		}
		switch (config.type){
			case "POINT": //点
				drawPoint = new SuperMap.Control.DrawFeature(config.highLightlayer, SuperMap.Handler.Point);
				drawPoint.events.on({"featureadded": config.drawCompleted});
				config.map.addControl(drawPoint);
				break;
			case "LINE": //线
				drawLine = new SuperMap.Control.DrawFeature(config.highLightlayer, SuperMap.Handler.Path);
				drawLine.events.on({"featureadded": config.drawCompleted});
				config.map.addControl(drawLine);
				break;
			case "POLYGON": //任意多边形
				drawPolygon = new SuperMap.Control.DrawFeature(config.highLightlayer,SuperMap.Handler.Polygon);
				drawPolygon.events.on({"featureadded": config.drawCompleted});
				config.map.addControl(drawPolygon);
				break;
			case "CIRCLE": //圆
				drawCircle = new SuperMap.Control.DrawFeature(config.highLightlayer, SuperMap.Handler.RegularPolygon,{
						handlerOptions:{
							sides:50,
							radius: config.radius==undefined ? null:config.radius
						}
					});
				drawCircle.events.on({"featureadded": config.drawCompleted});
				config.map.addControl(drawCircle);
				break;
			case "RECTANGLE": //矩形
				drawRectangle = new SuperMap.Control.DrawFeature(config.highLightlayer, SuperMap.Handler.Box);
                drawRectangle.events.on({"featureadded": config.drawCompleted});
				config.map.addControl(drawRectangle);
				break;
		}
		
	}
	
	/**
	 * 激活绘制控件
	 * @param {Object} drawControlType 需要激活控件的类型（POINT，LINE，POLYGON，CIRCLE,RECTANGLE）
	 */
	function activateDrawControl(drawControlType){
		deactivateDrawControl();
		switch (drawControlType){
			case "POINT":
				drawPoint && drawPoint.activate();
				break;
			case "LINE":
				drawLine && drawLine.activate();
				break;
			case "POLYGON":
				drawPolygon && drawPolygon.activate();
				break;
			case "CIRCLE":
				drawCircle && drawCircle.activate();
				break;
			case "RECTANGLE":
				drawRectangle && drawRectangle.activate();
				break;
		}
	}
	
	/**
	 * 销毁绘制控件
	 */
	function deactivateDrawControl(){
		drawPoint && drawPoint.deactivate();
		drawLine && drawLine.deactivate();
		drawPolygon && drawPolygon.deactivate();
		drawCircle && drawCircle.deactivate();
		drawRectangle && drawRectangle.deactivate();
	}
	
	var drawFeatures={
		initDrawControl:initDrawControl,
		activateDrawControl:activateDrawControl,
		deactivateDrawControl:deactivateDrawControl
	}
	module.exports=drawFeatures;
	window.drawFeatures=drawFeatures;
});
