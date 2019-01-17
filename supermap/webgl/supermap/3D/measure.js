/**
 * 测量控件api
 * 测距、测面、测高度
 */
define(function(require, exports, module){
	var measure3D = {
		handlerDis: {},
		handlerArea: {},
		handlerHeight: {},
		/**
		 * 创建测量控件
		 */
		initMeasure3DControl: function(Cesium,viewer){
			//注册测距、测高、测面积控件
			measure3D.measureDistance(Cesium,viewer);
			measure3D.measureHeight(Cesium,viewer);
			measure3D.measureArea(Cesium,viewer);
		},
		/**
		 * 测距离
		 * @param {Object} cesium
		 * @param {Object} viewer
		 */
		measureDistance: function(cesium,viewer){
			measure3D.handlerDis = new Cesium.MeasureHandler(viewer,cesium.MeasureMode.Distance,0);
			measure3D.handlerDis.measureEvt.addEventListener(function(result){
				var distance = result.distance > 1000 ? (result.distance/1000).toFixed(2) + 'km' : result.distance + 'm';
				measure3D.handlerDis.disLabel.text = '距离:' + distance;
			});
			measure3D.handlerDis.activeEvt.addEventListener(function(isActive){
				if(isActive == true){
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
					$('body').removeClass('measureCur').addClass('measureCur');
				}else{
					viewer.enableCursorStyle = true;
					$('body').removeClass('measureCur');
				}
			});
		},
		/**
		 * 测高度
		 * @param {Object} cesium
		 * @param {Object} viewer
		 */
		measureHeight: function(cesium,viewer){
			measure3D.handlerHeight = new Cesium.MeasureHandler(viewer,cesium.MeasureMode.DVH);
			measure3D.handlerHeight.measureEvt.addEventListener(function(result){
				var distance = result.distance > 1000 ? (result.distance/1000).toFixed(2) + 'km' : result.distance + 'm';
				var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight/1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
				var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance/1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
				measure3D.handlerHeight.disLabel.text = '空间距离:' + distance;
				measure3D.handlerHeight.vLabel.text = '垂直高度:' + vHeight;
				measure3D.handlerHeight.hLabel.text = '水平距离:' + hDistance;
			});
			measure3D.handlerHeight.activeEvt.addEventListener(function(isActive){
				if(isActive == true){
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
					$('body').removeClass('measureCur').addClass('measureCur');
				}else{
					viewer.enableCursorStyle = true;
					$('body').removeClass('measureCur');
				}
			});
		},
		/**
		 * 测面积
		 * @param {Object} cesium
		 * @param {Object} viewer
		 */
		measureArea: function(cesium,viewer){
			measure3D.handlerArea = new Cesium.MeasureHandler(viewer,cesium.MeasureMode.Area,2);
			measure3D.handlerArea.measureEvt.addEventListener(function(result){
				var area = result.area > 1000000 ? result.area/1000000 + 'km²' : result.area + '㎡'
				measure3D.handlerArea.areaLabel.text = '面积:' + area;
			});
			measure3D.handlerArea.activeEvt.addEventListener(function(isActive){
				if(isActive == true){
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
					$('body').removeClass('measureCur').addClass('measureCur');
				}else{
					viewer.enableCursorStyle = true;
					$('body').removeClass('measureCur');
				}
			});
		},
		/**
		 * 激活测量控件
		 * @param {Object} type：控件类型（DIS--测距；AREA--面积；HEIGHT--高度）
		 */
		activateMeasure3DControl: function(type){
			measure3D.deactiveAllMeasure3DControl();
			switch (type){
				case "DIS":
					measure3D.handlerDis && measure3D.handlerDis.activate();
					break;
				case "AREA":
					measure3D.handlerArea && measure3D.handlerArea.activate();
					break;
				case "HEIGHT":
					measure3D.handlerHeight && measure3D.handlerHeight.activate();
					break;
			}
		},
		/**
		 * 销毁测量控件,并清除所有要素
		 */
		deactiveAllMeasure3DControl: function(){
			measure3D.handlerDis && measure3D.handlerDis.deactivate();
			measure3D.handlerArea && measure3D.handlerArea.deactivate();
			measure3D.handlerHeight && measure3D.handlerHeight.deactivate();
			measure3D.handlerDis && measure3D.handlerDis.clear();
			measure3D.handlerArea && measure3D.handlerArea.clear();
			measure3D.handlerHeight && measure3D.handlerHeight.clear();
		}
	};
	
	//给外部暴露接口
	module.exports = measure3D;
});