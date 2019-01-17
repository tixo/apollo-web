/*
 * 警务大数据系统--布控管理--布控作战布控对象轨迹功能封装 
 * @author qhj
 */
define(function(require, exports, module) {
	var mVecotrLayer,mData=[];
	/**
	 * 添加轨迹路线
	 * @param {Object} vecotrLayer 矢量图层
	 * @param {Object} data 摄像头位置坐标序列,格式：[{x: , y: },{x: , y: },{x: , y: }.....]
	 * @return {Object} features 返回添加到地图上的矢量要素
	 */
    function createPath(vecotrLayer,data){
    	mVecotrLayer = vecotrLayer;
    	mData = data;
        var newPoinnts = createNewPoints(data);
        var features = createLines(newPoinnts);
        return features;
    }
    
    /**
     * 根据摄像头位置坐标序列，构造新的轨迹点序列
     * @param {Object} data 摄像头位置坐标序列
     * @return {Object} points 重新构建的轨迹点序列
     */
    function createNewPoints(data){
        var points = [];
        for(var i=0; i<data.length; i++){
            if(i==0){
                var geometry = new SuperMap.Geometry.Point(data[i].X, data[i].Y);
                points.push(geometry);
            }else{
                var centerX = ((data[i-1].X)*1 + (data[i].X)*1)/2;
                var centerY = ((data[i-1].Y)*1 + (data[i].Y)*1)/2;
                var centerPoint = new SuperMap.Geometry.Point(centerX,centerY);
                points.push(centerPoint);
                var geometry = new SuperMap.Geometry.Point(data[i].X, data[i].Y);
                points.push(geometry);
            }
        }
        return points;
    }
    /**
     * 根据新生成的轨迹点串生成路径
     * @param {Object} points 重新构建的轨迹点序列
     * @return {Object} 
     */
    function createLines(points){
        var pointFeatures = [], lineFeatures=[];
        for(var i=0; i<points.length; i++){
            if(i==0){
                var startP = new SuperMap.Feature.Vector(points[i]);
                startP.style={
                    graphic: true,
                    graphicWidth: 40,
                    graphicHeight: 40,
                    graphicYOffset: -40,
                    externalGraphic: "../../assets/img/main_html/marker/stPoint.png"  //起点图片
                };
                startP.attributes = mData[i];
                pointFeatures.push(startP);
            }else if(i==points.length-1){
                var geometryL = new SuperMap.Geometry.LineString([points[i-2], points[i]]);
                var line = new SuperMap.Feature.Vector(geometryL);
                line.style={
                    fill: true,
                    strokeColor: "#1296db",
                    strokeWidth: 3,
                    strokeOpacity: 1
                };
                lineFeatures.push(line);
                var endP = new SuperMap.Feature.Vector(points[i]);
                endP.style={
                    graphic: true,
                    graphicWidth: 40,
                    graphicHeight: 40,
                    graphicYOffset: -40,
                    externalGraphic: "../../assets/img/main_html/marker/edPoint.png" //终点图片
                };
                endP.attributes = mData[mData.length-1];
                pointFeatures.push(endP);
            }else{
                if(i%2==0){
                    var geometryL = new SuperMap.Geometry.LineString([points[i-2], points[i]]);
                    var line = new SuperMap.Feature.Vector(geometryL);
                    line.style={
                        stroke: true,
                        strokeColor: "#1296db",
                        strokeWidth: 3,
                        strokeOpacity: 1
                    };
                    lineFeatures.push(line);
                    var orientationP = new SuperMap.Feature.Vector(points[i]);
                    orientationP.style={
                        graphic: true,
                        graphicWidth: 20,
                        graphicHeight: 24,
                        graphicYOffset: -20,
                        externalGraphic: "../../assets/img/main_html/marker/tantou.gif" //摄像头
                    };
                    orientationP.attributes = mData[i/2];
                    pointFeatures.push(orientationP);
                }else{
                    var centerP = new SuperMap.Feature.Vector(points[i]); //创建航线
                    centerP.style={
                        graphic: true,
                        graphicWidth: 15,  //宽度
                        graphicHeight: 35,  //高度
                        graphicXOffset: -7.5, //箭头的偏移量
                        rotation: calculateOrientation(points[i-1], points[i]),
                        externalGraphic: "../../assets/img/main_html/marker/fangxiang.png" //方向箭头
                    };
                    pointFeatures.push(centerP);
                }
            }
        }
        var features = lineFeatures.concat(pointFeatures);
        mVecotrLayer.addFeatures(features);
        
        parent.window.mapUtil.mapAPI.setTopLayer("vectorLayer");
        return features;
    }
    
    /**
     * 根据前后两点计算箭头图标旋转的角度，此图标箭头朝上
     * @param {Object} sPoint 第一个点
     * @param {Object} ePoint 第二个点
     * @return {Object} rotation 返回图片按顺时针方向的旋转角度
     */
    function calculateOrientation(sPoint, ePoint){
        var k = (ePoint.y-sPoint.y)/(ePoint.x-sPoint.x+0.000000000001);
        var rotation = Math.atan(k)*180/Math.PI;
        if((ePoint.y-sPoint.y)<0 && (ePoint.x-sPoint.x+0.000000000001)<0){
            rotation = 270 - rotation;
        }else if((ePoint.y-sPoint.y)<=0 && (ePoint.x-sPoint.x+0.000000000001)>0){
            rotation = 90 - rotation;
        }else if((ePoint.y-sPoint.y)>0 && (ePoint.x-sPoint.x+0.000000000001)>0){
            rotation = 90 - rotation;
        }else if((ePoint.y-sPoint.y)>0 && (ePoint.x-sPoint.x+0.000000000001)<0){
            rotation = -(90 + rotation);
        }
        return rotation;
    }
    
    /**
     * 清除指定的要素
     * @param {Object} features 需要清除的要素
     */
    function clearFeatures(features) {
    	if(mVecotrLayer!=undefined){
    		mVecotrLayer.removeFeatures(features);
    	}
    }
	
	jwdsj_bkgj={
		createPath: createPath,
		clearFeatures: clearFeatures
	}
	module.exports = jwdsj_bkgj;
})