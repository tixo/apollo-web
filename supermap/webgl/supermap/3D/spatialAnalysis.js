/**
 * 三维webgl空间分析组api
 */
define(function(require, exports, module){
	var spatialAnalysis = {
        viewer: null,
        handlerPolygon: null, //绘制面控件
        tooltip: null, //鼠标提示控件
        moveEndListener: null, //相机移动事件
        /**
         * 开挖分析
         * @param {Viewer} viewer
         * @param {Cesium} cesium
         * @param {Number} depth 开挖深度
         */
		excavationAnalysis: function(viewer, cesium, depth){
            spatialAnalysis.viewer = viewer;
            //先判断浏览器是否支持开挖分析
            if(!viewer.scene.pickPositionSupported){
                parent.window.ui.dialog.showContent('不支持深度纹理,地形开挖功能无法使用！');
                return;
            }
            if(spatialAnalysis.handlerPolygon!=null){
                //先清除上次的开挖结果
                viewer.scene.globe.removeAllExcavationRegion();
                spatialAnalysis.handlerPolygon.activate();
            }else{
                //创建提示框
                spatialAnalysis.tooltip = createTooltip(viewer._element);
                spatialAnalysis.tooltip.setVisible(false);
                //绘制多边形
                spatialAnalysis.handlerPolygon = new Cesium.DrawHandler(viewer,cesium.DrawMode.Polygon,0);
                spatialAnalysis.handlerPolygon.activeEvt.addEventListener(function(isActive){
                    if(isActive == true){
                        viewer.enableCursorStyle = false;
                        viewer._element.style.cursor = '';
                        $('body').removeClass('drawCur').addClass('drawCur');
                    }
                    else{
                        viewer.enableCursorStyle = true;
                        $('body').removeClass('drawCur');
                    }
                });
                spatialAnalysis.handlerPolygon.movingEvt.addEventListener(function(windowPosition){
                    if(spatialAnalysis.handlerPolygon.isDrawing){
                        spatialAnalysis.tooltip.showAt(windowPosition,'<p>点击确定开挖区域中间点</p><p>右键单击结束绘制,进行开挖</p>');
                    }
                    else{
                        spatialAnalysis.tooltip.showAt(windowPosition,'<p>点击绘制开挖区域第一个点</p>');
                    }
                });
                spatialAnalysis.handlerPolygon.drawEvt.addEventListener(function(result){
                    if(!result.object.positions){
                        spatialAnalysis.tooltip.showAt(result,'<p>请绘制正确的多边形</p>');
                        spatialAnalysis.handlerPolygon.polygon.show = false;
                        spatialAnalysis.handlerPolygon.polyline.show = false;
                        spatialAnalysis.handlerPolygon.deactivate();
                        spatialAnalysis.handlerPolygon.activate();
                        return;
                    };
                    var array = [].concat(result.object.positions);
                    var positions = [], points=[];
                    for(var i = 0, len = array.length; i < len; i ++){
                        var cartographic = cesium.Cartographic.fromCartesian(array[i]);
                        var longitude = cesium.Math.toDegrees(cartographic.longitude);
                        var latitude = cesium.Math.toDegrees(cartographic.latitude);
                        var h=cartographic.height;
                        if(positions.indexOf(longitude)==-1&&positions.indexOf(latitude)==-1){
                            positions.push(longitude);
                            positions.push(latitude);
                            positions.push(h);
                            points.push(new SuperMap.Geometry.Point(longitude,latitude));
                        }
                    }
                    //设置开挖参数
                    viewer.scene.globe.addExcavationRegion({
                        name : 'ggg' ,
                        position : positions,
                        height : depth,
                        transparent : false
                    });
                    //构造所画区域的多边形，计算投影到球面上的多边形近似面积
                    var linearRings = new SuperMap.Geometry.LinearRing(points); 
                    var excavationPolygon = new SuperMap.Geometry.Polygon([linearRings]);
                    var excavationArea = excavationPolygon.getGeodesicArea();
                    // 计算近似土方量
                    var excavationVolume = excavationArea*depth;
                    // 注销绘制控件
                    spatialAnalysis.handlerPolygon.polygon.show = false;
                    spatialAnalysis.handlerPolygon.polyline.show = false;
                    spatialAnalysis.handlerPolygon.deactivate();
                    //确定提示框的位置
                    var centerPoint = excavationPolygon.getCentroid();
                    if(spatialAnalysis.moveEndListener==null){
                        spatialAnalysis.moveEndListener = function(result){
                            var windowPosition = cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cesium.Cartesian3.fromDegrees(centerPoint.x, centerPoint.y, 0));
                            spatialAnalysis.tooltip.showAt(windowPosition,'<p>'+excavationVolume+'立方米</p>');
                        }
                    }
                    if(viewer.scene.camera.moveEnd._listeners.length == 0){
                        var windowPosition = cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cesium.Cartesian3.fromDegrees(centerPoint.x, centerPoint.y, 0));
                        spatialAnalysis.tooltip.showAt(windowPosition,'<p>'+excavationVolume+'立方米</p>');
                        viewer.scene.camera.moveEnd.addEventListener(spatialAnalysis.moveEndListener);
                    }
                });
                spatialAnalysis.handlerPolygon.activate();
            }
        },
        /** 
         * 清除开挖分析结果
         */
        _clearExcavationResult: function(){
            if(spatialAnalysis.viewer!=null && spatialAnalysis.handlerPolygon!=null && spatialAnalysis.tooltip!=null){
                spatialAnalysis.viewer.scene.globe.removeAllExcavationRegion();
                spatialAnalysis.viewer.scene.camera.moveEnd.removeEventListener(spatialAnalysis.moveEndListener);
                spatialAnalysis.handlerPolygon.deactivate();
                if(spatialAnalysis.handlerPolygon.polygon!=undefined) spatialAnalysis.handlerPolygon.polygon.show=false;
                if(spatialAnalysis.handlerPolygon.polyline!=undefined) spatialAnalysis.handlerPolygon.polyline.show=false;
                spatialAnalysis.tooltip.setVisible(false);
            }
        }
	};
	
	//给外部提供接口
	module.exports = spatialAnalysis;
});