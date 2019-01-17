/*
 * 地图api组
 * @author
 */
define(function(require, exports, module) {
	//地图服务
	var services=window.services;
	if(services ==undefined)services=parent.window.services;
	var map,resultLayer;
	// 坐标点数组
	var latlngs= null;
	//鼠标移动线条层
	var mpolyline;
    map = L.map('map', {
    	preferCanvas: true,
        crs: L.CRS.EPSG4326,
        center: [services.mapconfig.y, services.mapconfig.x],
        maxZoom: services.mapconfig.maxZoom,
        zoom: services.mapconfig.zoom,
        //是否显示比例尺控件
        zoomControl:false,
        //是否显示logo
        logoControl: false,
        closePopupOnClick:false,
        inertia:false
    });
    L.supermap.tiledMapLayer(services.satelliteMap).addTo(map);
     // handleMapEvent(drawControl._container, map);
      //当绑定到此图层的弹出窗口关闭时触发
	map.on('popupclose', function() {
		if(resultLayer!=undefined){
			map.removeLayer(resultLayer);
		}
		
	});
	map.on('popupopen', function() {
	    var popup=$("#policeDe");
		popup.parent().css("margin","0");
		popup.parent().parent().css("padding","0");
	});
	
	var myIcon = L.icon({
	    iconUrl: services.frontHttpUrl+'config/common/mapTools/img/yellow-cur.png',
	    iconSize: [9, 9]
	});
	//初始化测量     
	function  onDistanceInit() {
		$("#map").css({'cursor':('url('+services.frontHttpUrl +'config/common/mapTools/img/measure.cur), auto')});
		latlngs= new Array();
		if(resultLayer!=undefined){
			map.removeLayer(resultLayer);
		}
		resultLayer = L.featureGroup().addTo(map); 
		//激活事件
		 map.on('click', onClick);
	     map.on('contextmenu', onContextmenu);
	     map.on('mousemove', onMousemove);
	}
	//初始化测面积     
	function  onAearInit() {
		$("#map").css({'cursor':('url('+services.frontHttpUrl +'config/common/mapTools/img/measure.cur), auto')});
		if(resultLayer!=undefined){
			map.removeLayer(resultLayer);
		}
		resultLayer = L.featureGroup().addTo(map); 
		latlngs= new Array();
		//激活事件
		 map.on('click', onClick);
	     map.on('contextmenu', onContextmenuAear);
	     map.on('mousemove', onMousemove);
	}
	//清除
	function  onClear() {
		if(resultLayer!=undefined){
			map.removeLayer(resultLayer);
		}
		if(mpolyline!=undefined){
 			mpolyline.removeFrom(map);
 		}
		map.off('click', onClick);
	    map.off('contextmenu', onContextmenu);
	    map.off('mousemove', onMousemove);
	    map.off('click', onClick);
	    map.off('contextmenu', onContextmenuAear);
	    $("#map").css('cursor','pointer');
	    $('#tooltip').hide();
	}
	//全幅
    function full() {
     	map.setZoom(12);
     	onClear();
    }
    //单击事件
    function onClick(event) {
 		var nowLatLng = new Array(event.latlng.lat,event.latlng.lng);
     	latlngs.push(nowLatLng);
     	resultLayer.addLayer(L.marker(nowLatLng,{icon: myIcon}));
     	if(latlngs.length>1){
     		var polyline = L.polyline([latlngs[latlngs.length-2],latlngs[latlngs.length-1]], {color: 'blue'}).addTo(map);
     		resultLayer.addLayer(polyline);
     	}
    }
    //右击结束事件测量
    function onContextmenu(e) {
     	if(latlngs.length>1){
     		measureDistance(latlngs) ;
     		map.off('click', onClick);
     		map.off('contextmenu', onContextmenu);
     		map.off('mousemove', onMousemove);
     		if(mpolyline!=undefined){
     			mpolyline.removeFrom(map);
     		}
     	}
     	$('#tooltip').hide();
     	$("#map").css('cursor','pointer');
     }
    //右击结束事件面积
    function onContextmenuAear(e) {
     	if(latlngs.length>1){
     		measureAear(latlngs) ;
     		map.off('click', onClick);
     		map.off('contextmenu', onContextmenuAear);
     		map.off('mousemove', onMousemove);
     		if(mpolyline!=undefined){
     			mpolyline.removeFrom(map);
     		}
     	}
     	$('#tooltip').hide();
     	$("#map").css('cursor','pointer');
    }
    //鼠标移动事件 测量
	function onMousemove(event) {
		var nowLatLng = new Array(event.latlng.lat,event.latlng.lng);
     	if(latlngs.length>0){
     		if(mpolyline!=undefined){
     			mpolyline.removeFrom(map);
     		}
     		mpolyline = L.polyline([latlngs[latlngs.length-1],nowLatLng], {color: 'blue',dashArray:"10"});
     		mpolyline.addTo(map);
     		
     	}else if(latlngs.length>1){
     		var styleStr = "width:55px;height: 30px; line-height: 30px; background:#fff ;color: #000; opacity: .7; display: inline-block; text-align: center; font-style: normal;";
   			styleStr +="position: absolute;z-index:999;cursor:crosshair;border-radius: 4px;"
     		$('#map').append('<div id="tooltip" style=" '+styleStr+'">右击结束</div>');
	   		$('#tooltip').css({
		        'left': (event.containerPoint.x +'px'),
		        'top': (event.containerPoint.y +'px')
		    }).show();
     	}
     	
    }
	
	//绘制折线	   
	function measureDistance(latlngsParam) {
		var polyLine = L.polyline(latlngsParam, {color: "#00ff33"});
	    resultLayer.addLayer(polyLine);
	    var content = getPopupContent(polyLine);
	     polyLine.bindPopup(content).openPopup();
	    //  marker1.bindPopup(content);
	    /*var distanceMeasureParam = new SuperMap.MeasureParameters(polyLine1);
	    L.supermap.measureService(services.satelliteMap) .measureDistance(distanceMeasureParam, function (serviceResult) {
	            var content = "距离： " + serviceResult.result.distance + "  米";
	            
	            var marker1 = L.marker(latlngsParam[0]);
	        marker1.bindPopup(content).openPopup(marker1.getLatLng());
	    });*/
	}
	//绘制多边形
	function measureAear(latlngsParam) {
		var one = latlngsParam[0];
		latlngsParam.push(one);
	    var polygon = L.polygon(latlngsParam, {color: "#00ff33"});
	    resultLayer.addLayer(polygon);
	    var content = getPopupContent(polygon);
	    polygon.bindPopup(content).openPopup();
	}
	//测量
    var getPopupContent = function(layer) {
            // Marker - add lat/long
           if (layer instanceof L.Polygon) {
                var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
                    area = L.GeometryUtil.geodesicArea(latlngs);
                return "面积: "+L.GeometryUtil.readableArea(area, true);
            // Polyline - distance
            } else if (layer instanceof L.Polyline) {
                var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
                    distance = 0;
                if (latlngs.length < 2) {
                    return "Distance: N/A";
                } else {
                    for (var i = 0; i < latlngs.length-1; i++) {
                        distance += latlngs[i].distanceTo(latlngs[i+1]);
                    }
                    return "距离: "+_round(distance, 2)+" m";
                }
            }
            return null;
        };
        var _round = function(num, len) {
            return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
        };
        // Helper method to format LatLng object (x.xxxxxx, y.yyyyyy)
        var strLatLng = function(latlng) {
            return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
        };
    //对外封装接口
	var mapInit = {
		onDistanceInit:onDistanceInit,
		onAearInit:onAearInit,
		onClear:onClear,
		full:full,
		map:map
	}
	//给外部提供接口
	module.exports = mapInit;
});