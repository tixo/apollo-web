/*
 * 地图api组
 *
 */
var supermap3D = {};
window.supermap3D = supermap3D;
supermap3D.domId = "";
supermap3D.viewer={};
supermap3D.Cesium={};
supermap3D.scene={};
/**
 * 打开场景中所有的图层。 
 * @param {Object} json{Cesium:webgl对象,id:div的id,url:场景服务地址，center: 相机位置}
 */
supermap3D.openScene = function(json){
	var callback;
	if(json.callback != undefined && typeof(json.callback) == "function"){
		callback = json.callback;
	}else{
		callback = function(){};
	}
	supermap3D.Cesium = json.cesium;
	supermap3D.viewer = new Cesium.Viewer(json.id,{navigation:true});
	supermap3D.domId = json.id;
	supermap3D.scene = supermap3D.viewer.scene;
	var widget = supermap3D.viewer.cesiumWidget;
	var globe = supermap3D.scene.globe;
	//设置开启地下场景
	supermap3D.scene.undergroundMode = true;
	supermap3D.scene.screenSpaceCameraController.minimumZoomDistance = -1000;//设置相机最小缩放距离,距离地表-1000米
	
	try {
		//打开所发布三维服务下的所有图层
		var promise = supermap3D.scene.open(json.url==undefined ? "":json.url);
		Cesium.when(promise, function(layer) {
			//设置相机位置，定位至模型， 飞向利用方位角(heading)、俯仰角(pitch)、滚动角(roll)表示方向(orientatin)的位置
			supermap3D.scene.camera.setView({
			    destination : supermap3D.Cesium.Cartesian3.fromDegrees(json.center.x, json.center.y, json.center.height),
			    orientation : {
			        heading : supermap3D.Cesium.Math.toRadians((json.center.heading != undefined) ? json.center.heading:0),
			        pitch : supermap3D.Cesium.Math.toRadians((json.center.pitch != undefined) ? json.center.pitch:-90),
			        roll : json.center.roll != undefined ? json.center.roll:0
			    },
			    complete: function(){
			    	//飞行到指定地点后的回调函数
			    }
			});
			// 加载完场景之后的回调函数
			callback();
			if(!supermap3D.scene.pickPositionSupported) {
				//alert('不支持深度纹理,无法拾取位置！');
			}
		}, function(e) {
			if(widget._showRenderLoopErrors) {
				var title = '加载SCP失败，请检查网络连接状态或者url地址是否正确？';
				widget.showErrorPanel(title, undefined, e);
				//移除加载动画
				$('#loadingbar').css("display","none");
			}
		});
	} catch(e) {
		if(widget._showRenderLoopErrors) {
			var title = '渲染时发生错误，已停止渲染。';
			widget.showErrorPanel(title, undefined, e);
			//移除加载动画
			$('#loadingbar').css("display","none");
		}
	}
}

/**
 * 释放supermap3D.viewer对象占用的资源。
 */
supermap3D.destroy = function(){
	$("#"+supermap3D.domId).empty();
}

/**
 * 添加Billboar（广告牌）实体
 * @param {Object} obj
 * obj={
 * 		url: 图片地址,
 * 		width: 图片宽度,
 * 		height: 图片高度,
 * 		x: 图片x坐标, 
 * 		y: 图片y坐标,
 * 		z: 图片z坐标,
 * 		isLabel: bool类型(默认为false)，true--显示注记，false--不显示注记
 * 		labelText: 注记文字 ，当isLabel为true时生效
 * 		labelColor: 注记字体颜色，当isLabel为true时生效
 * 		textFont: 注记字体大小及样式，格式为：textFont:'18px 微软雅黑'，当isLabel为true时生效
 * 		labelOffsetX: 注记X轴偏移量，当isLabel为true时生效
 * 		labelOffsetY: 注记Y轴偏移量，当isLabel为true时生效
 * }
 */
supermap3D.createEntityBillboard = function(obj){
	var isLabel = obj.isLabel==undefined ? false:obj.isLabel;
	var x = obj.x==undefined ? 0:obj.x;
	var y = obj.y==undefined ? 0:obj.y;
	var z = obj.z==undefined ? 5:obj.z;
	var entity = new Cesium.Entity({position:supermap3D.Cesium.Cartesian3.fromDegrees(x, y, z)});
	var billboard = new Cesium.BillboardGraphics({
		image : obj.url==undefined ? "":obj.url,
	    width : obj.width==undefined ? 28:obj.width,
	    height : obj.height==undefined ? 36:obj.height
	});
	billboard.attributes = obj.attributes == undefined ? {}:obj.attributes;
	entity.billboard = billboard;
	if(isLabel == true){
		var label = new Cesium.LabelGraphics({
			text : obj.labelText==undefined ? "":obj.labelText,
			fillColor : obj.labelColor==undefined ? "#000":obj.labelColor,
			font : obj.textFont==undefined ? "18px 微软雅黑":obj.textFont,
			pixelOffset : new Cesium.Cartesian2(obj.labelOffsetX==undefined ? 0:obj.labelOffsetX, obj.labelOffsetY==undefined ? 0:obj.labelOffsetY)
		});
		label.attributes = obj.attributes == undefined ? {}:obj.attributes;
		entity.label = label;
	}
	
	//将构造好的实体加入enty中
	supermap3D.viewer.entities.add(entity);
}

/**
 * 根据id获取对应的实体
 * @param {Object} id 待检索的实体id
 * @param Entity entity 获取到的指定id的实体对象；如果集合中不存在该id的实体，返回undefined。
 */
supermap3D.getEntityById = function(id){
	var entity = supermap3D.viewer.entities.getById(id);
	return entity;
}

/**
 * 根据id删除对应的实体
 * @param {Object} id 待删除的实体id
 * 移除成功返回true；如果指定id的实体不存在于集合中，移除失败则返回false。
 */
supermap3D.clearEntityById = function(id){
	var flag = supermap3D.viewer.entities.removeById(id);
	if(flag == true){
		console.log("删除成功");
	}else{
		console.log("删除失败");
	}
}

/**
 * 清除场景中添加的所有的实体
 */
supermap3D.clearAllEntities = function(){
	supermap3D.viewer.entities.removeAll();
}

/**
 * 清除场景中添加的指定的实体
 * @param Entity entity 指定的实体对象
 */
supermap3D.clearEntities = function(entity){
	var flag = supermap3D.viewer.entities.remove(entity);
	if(flag == true){
		console.log("删除成功");
	}else{
		console.log("删除失败");
	}
}

/**
 * 设置相机位置，定位至模型，
 * @param Entity entity 指定的实体对象
 */
supermap3D.resetCenter = function(json){
	var type = json.type==undefined ? flyto:json.type;
	if(type=="flyto"){
		//飞向利用方位角(heading)、俯仰角(pitch)、滚动角(roll)表示方向(orientatin)的位置
		supermap3D.scene.camera.flyTo({
		    destination : supermap3D.Cesium.Cartesian3.fromDegrees(json.x, json.y, json.height),
		    orientation : {
		        heading : supermap3D.Cesium.Math.toRadians((json.heading != undefined) ? json.heading:0),
		        pitch : supermap3D.Cesium.Math.toRadians((json.pitch != undefined) ? json.pitch:-90),
		        roll : json.roll != undefined ? json.roll:0
		    }
		});
	}else if(type=="setView"){
		//设置相机位置，定位至模型， 飞向利用方位角(heading)、俯仰角(pitch)、滚动角(roll)表示方向(orientatin)的位置
		supermap3D.scene.camera.setView({
		    destination : supermap3D.Cesium.Cartesian3.fromDegrees(json.x, json.y, json.height),
		    orientation : {
		        heading : supermap3D.Cesium.Math.toRadians((json.heading != undefined) ? json.heading:0),
		        pitch : supermap3D.Cesium.Math.toRadians((json.pitch != undefined) ? json.pitch:-90),
		        roll : json.roll != undefined ? json.roll:0
		    }
		});
	}
	
}

/**
 * 添加一个相机移动事件
 * @param {function} moveEndCallback 相机移动后的回调函数
 */
supermap3D.andMoveEndListener=function(moveEndCallback){
	if(moveEndCallback==undefined && typeof(moveEndCallback)!="function"){
		return;
	}else{
		supermap3D.scene.camera.moveEnd.addEventListener(moveEndCallback);
	}
}
/**
 * 移除一个相机移动事件
 * @param {function} moveEndCallback 之前添加的相机移动事件回调函数
 */
supermap3D.removeMoveEndListener=function(moveEndCallback){
	if(moveEndCallback==undefined && typeof(moveEndCallback)!="function"){
		return;
	}else{
		supermap3D.scene.camera.moveEnd.removeEventListener(moveEndCallback);
	}
}

/**
 * 根据给定的地图范围计算场景的高度
 * @param {Object} bounds 给定的二维地图范围
 * @return {Object} altitude 根据范围计算得到的场景高度
 */
supermap3D._calculateAltitudeFromBounds=function(bounds) {
    var _PI = 3.1415926;
    var _earthRadius = 6378137;
    var altitude = _earthRadius;
    var boundsWidth = bounds.right - bounds.left;
    if (boundsWidth >= 120) {
        altitude = _earthRadius * boundsWidth / 60 - _earthRadius;
    }
    else if (boundsWidth != 0) {
        var angle1 = (boundsWidth / 360) * _PI;
        var height = Math.sin(angle1) * _earthRadius;
        var a = height / Math.tan(angle1);
        var b = height / Math.tan(_PI / 6);
        altitude = a + b - _earthRadius;
    }
    return altitude;
}

/**
 * 根据给定的场景高度计算地图中显示范围的宽度
 * @param {Object} altitude 给定的场景高度
 * @return {Object} size 根据场景高度得到的地图显示范围尺寸
 */
supermap3D._calculateSizeFromAltitude=function(altitude) {
    var _PI = 3.1415926;
    var _earthRadius = 6378137;
    var size;
    if (altitude >= _earthRadius) {//当场景高度大于可全幅显示整球的高度时
        var ratio = (altitude + _earthRadius) * 0.5;
        size = 120 * ratio / _earthRadius
    }
    else {//当场景高度小于可全幅显示整球的高度时，即无法看到整球时
        var tan30 = Math.tan(_PI / 6);
        //设置方程组的a,b,c
        var a = (Math.pow(tan30, 2) + 1) * Math.pow(_earthRadius, 2);
        var b = -2 * (_earthRadius + altitude) * _earthRadius * Math.pow(tan30, 2);
        var c = Math.pow(tan30, 2) * Math.pow(_earthRadius + altitude, 2) - Math.pow(_earthRadius, 2.0);
        //解一元二次方程，取锐角，因此余弦值较大
        var cosd = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        var d = Math.acos(cosd);
        var widthd = 2 * d * _earthRadius;
        size = (widthd / (_PI * _earthRadius)) * 180;
    }
    return size;
}

/**
 * 将世界坐标系转为经纬度坐标系
 * @param {Object} cartesian3 世界坐标系
 * @return {Object} 返回经纬度坐标
 */
supermap3D.cartesian3ToLonlat=function(cartesian3){
	var ellipsoid=supermap3D.scene.globe.ellipsoid;
	var cartographic=ellipsoid.cartesianToCartographic(cartesian3);
	var lon=Cesium.Math.toDegrees(cartographic.longitude);
	var lat=Cesium.Math.toDegrees(cartographic.latitude);
	var alt=cartographic.height;
	var point3D = {
		x: lon,
		y: lat,
		z: alt
	};
	return point3D;
}

/**
 * 设置查询参数
 * @param {Object} obj
 */
supermap3D.setQueryParam = function(obj){
	obj.layer.setQueryParameter({
        url: obj.dataUrl,
        dataSourceName: obj.dataSourceName,
        dataSetName: obj.dataSetName,
        keyWord: obj.keyWord
	});
}

/**
 * 选择实体要素监听事件
 * successCallback(result): 选择成功后的回调函数，result为返回的结果对象
 *         result = {type:实体要素类型，entity:实体要素，lonlat:实体要素位置（笛卡尔坐标）}
 * fieldCallback(): 没有选择到实体要素的回调函数（可选）
 */
supermap3D.selectEntityListener = function(successCallback,fieldCallback){
	supermap3D.viewer.selectionIndicator.destroy();
	supermap3D.viewer.infoBox.destroy();
	supermap3D.viewer.selectedEntityChanged.addEventListener(function(entity){
		var result = {};
		if(entity){
			for(var i=0; i<entity.propertyNames.length; i++){
				if(entity[entity.propertyNames[i]] != undefined){
					if(entity.propertyNames[i]=="feature"){
						result ={type:entity.propertyNames[i], entity:entity[entity.propertyNames[i]], lonlat:supermap3D.viewer.selectedEntity.scenePos};
					}else{
						result ={type:entity.propertyNames[i], entity:entity[entity.propertyNames[i]], lonlat:supermap3D.viewer.selectedEntity.position._value};
					}
					break;
				}
			}
			if(typeof(successCallback) === "function"){
				successCallback(result);
			}
		}else{
			if(fieldCallback!=undefined && typeof(fieldCallback)==="function"){
				fieldCallback()
			}else{
				basePopup.closePopup();
			}
		}
	});
}