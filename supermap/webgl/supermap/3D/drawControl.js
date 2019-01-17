/**
 * 绘制控件api
 * 绘点、绘线、绘面、绘图标
 */
define(function(require, exports, module){
	var drawControl = {
		tooltip: {}, //提示控件
		handlerPoint: {}, //绘点控件
		handlerLine: {}, //绘线控件
		handlerPolygon: {}, //绘面控件
		handlerMarker: {}, //绘图标控件
		/**
		 * 绘制完成之后的默认回调函数
		 */
		completeCallback: {},
		/**
		 * 初始化绘制控件
		 * @param {Object} config={
		 * 						Cesium: cesium类库（必需）,
		 * 						Viewer: viewer部件（必需）,
		 * 						sceneDom: 盛放提示控件的div的id（必需）,
		 * 						completeCallback: 绘制完成的回调函数（可选参数）
		 * 					}
		 */
		initDraw3DControl: function(config){
			if(config.Cesium==undefined || config.Viewer==undefined || config.sceneDom==undefined){
				console.log("初始化绘制控件所需的必需参数不完整！");
				return;
			}
			if(config.completeCallback!=undefined && typeof(config.completeCallback)=="function"){
				drawControl.completeCallback = config.completeCallback;
			}else{
				drawControl.completeCallback=function(result){};
			}
			//初始化提示框
			drawControl.tooltip = createTooltip(document.getElementById(config.sceneDom));
			//注册绘点、绘线、绘面、绘图标控件
			drawControl.drawPoint(config.Cesium,config.Viewer);
			drawControl.drawLine(config.Cesium,config.Viewer);
			drawControl.drawPolygon(config.Cesium,config.Viewer);
			drawControl.drawMarker(config.Cesium,config.Viewer);
		},
		/**
		 * 绘点
		 * @param {Object} cesium
		 * @param {Object} viewer
		 */
		drawPoint: function(cesium,viewer){
			drawControl.handlerPoint = new Cesium.DrawHandler(viewer,cesium.DrawMode.Point,0);
			drawControl.handlerPoint.activeEvt.addEventListener(function(isActive){
				if(isActive == true){
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
				}
				else{
					viewer.enableCursorStyle = true;
				}
			});
			drawControl.handlerPoint.movingEvt.addEventListener(function(windowPosition){
				drawControl.tooltip.showAt(windowPosition,'<p>点击绘制一个点</p>');
			});
			drawControl.handlerPoint.drawEvt.addEventListener(function(result){
				drawControl.tooltip.setVisible(false);
				drawControl.completeCallback(result);
			});
		},
		/**
		 * 绘线
		 * @param {Object} cesium
		 * @param {Object} viewer
		 */
		drawLine: function(cesium,viewer){
			drawControl.handlerLine = new Cesium.DrawHandler(viewer,cesium.DrawMode.Line,0);
			drawControl.handlerLine.activeEvt.addEventListener(function(isActive){
				if(isActive == true){
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
				}
				else{
					viewer.enableCursorStyle = true;
				}
			});
			drawControl.handlerLine.movingEvt.addEventListener(function(windowPosition){
				if(drawControl.handlerLine.isDrawing){
					drawControl.tooltip.showAt(windowPosition,'<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>');
				}
				else{
					drawControl.tooltip.showAt(windowPosition,'<p>点击绘制第一个点</p>');
				}

			});
			drawControl.handlerLine.drawEvt.addEventListener(function(result){
				drawControl.tooltip.setVisible(false);
				drawControl.completeCallback(result);
			});
		},
		/**
		 * 绘面
		 * @param {Object} cesium
		 * @param {Object} viewer
		 */
		drawPolygon: function(cesium,viewer){
			drawControl.handlerPolygon = new Cesium.DrawHandler(viewer,cesium.DrawMode.Polygon,0);
			drawControl.handlerPolygon.activeEvt.addEventListener(function(isActive){
				if(isActive == true){
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
				}
				else{
					viewer.enableCursorStyle = true;
				}
			});
			drawControl.handlerPolygon.movingEvt.addEventListener(function(windowPosition){
				if(drawControl.handlerPolygon.isDrawing){
					drawControl.tooltip.showAt(windowPosition,'<p>点击确定多边形中间点</p><p>右键单击结束绘制</p>');
				}
				else{
					drawControl.tooltip.showAt(windowPosition,'<p>点击绘制第一个点</p>');
				}
			});
			drawControl.handlerPolygon.drawEvt.addEventListener(function(result){
				drawControl.tooltip.setVisible(false);
				drawControl.completeCallback(result);
			});
		},
		/**
		 * 绘图标
		 * @param {Object} cesium
		 * @param {Object} viewer
		 */
		drawMarker: function(cesium,viewer){
			drawControl.handlerMarker = new Cesium.DrawHandler(viewer,cesium.DrawMode.Marker,0);
			drawControl.handlerMarker.activeEvt.addEventListener(function(isActive){
				if(isActive == true){
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
				}
				else{
					viewer.enableCursorStyle = true;
				}
			});
			drawControl.handlerMarker.movingEvt.addEventListener(function(windowPosition){
				drawControl.tooltip.showAt(windowPosition,'<p>点击绘制地标</p>');
			});
			drawControl.handlerMarker.drawEvt.addEventListener(function(result){
				drawControl.tooltip.setVisible(false);
				drawControl.completeCallback(result);
			});
		},
		/**
		 * 激活绘制控件
		 * @param {Object} type：控件类型（POINT--点；LINE--线；POLYGON--面；MARKER--图标）
		 */
		activateDraw3DControl: function(type){
			drawControl.deactiveAllDraw3DControl();
			switch (type){
				case "POINT":
					drawControl.handlerPoint.activate();
					break;
				case "LINE":
					drawControl.handlerLine.activate();
					break;
				case "POLYGON":
					drawControl.handlerPolygon.activate();
					break;
				case "MARKER":
					drawControl.handlerMarker.activate();
					break;
			}
		},
		/**
		 * 注销所有绘制控件
		 */
		deactiveAllDraw3DControl: function(){
			drawControl.handlerPoint.deactivate();
            drawControl.handlerLine.deactivate();
            drawControl.handlerPolygon.deactivate();
            drawControl.handlerMarker.deactivate();
		},
		/**
		 * 清除所有绘制的要素
		 */
        clearAllFeature: function(){
            drawControl.handlerLine.clear();
            drawControl.handlerPoint.clear();
            drawControl.handlerPolygon.clear();
            drawControl.handlerMarker.clear();
        }
	};
	
	//给外部暴露接口
	module.exports = drawControl;
});