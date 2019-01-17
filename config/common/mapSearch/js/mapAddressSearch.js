/**
 * 二维搜索地址
 * 添加坐标点
 */
define(function(require, exports, module) {
	var param = {
		map:{},
		ajax:{},
		vecotrLayer:{},
		mapCut:{}
	};
	//点击确定获取新的位置坐标
	var mapAddressSearch = {
		initMapAddressSearch:function(map,ajax,vecotrLayer,mapCut,mScene){
			param.map= map;
			param.ajax = ajax;
			param.vecotrLayer = vecotrLayer;
			param.mapCut = mapCut;
			param.mScene = mScene;
		},
		ok:function(){
			//param.mapCut.cut2D();
			var params = {
				address:$('#addressMapSearch').val()
			};
            param.ajax.post("map/info/resolve", params, function (response) {
               	var location = response.data.data.geocodes[0].location;
                var position =  location.split(',');
                var x = position[0];
				var y = position[1];
				var new_position =gcj02ToWgs84(Number(x),Number(y));
				var current = $(".z-card").html();
	    		if ("三维" == current) {
					add3DMarke(new_position);
				}else{
					addVectorFeature(new_position);
				}
            });
		}
	};

		//添加标记点
		function addVectorFeature(position){
			param.vecotrLayer.removeAllFeatures();
			param.map.setCenter(new SuperMap.LonLat(position.x ,position.y), 1);
			var point = new SuperMap.Geometry.Point(position.x, position.y);
			var feature = new SuperMap.Feature.Vector(point);
			feature.style={
				graphic: true,
				externalGraphic: '../../config/common/mapSearch/img/tuding.png',
				graphicWidth: 20,
				graphicHeight: 28
			};
			param.vecotrLayer.addFeatures([feature]);
		}
		function add3DMarke(position){
			//删除3维标记
			param.mScene.clearEntityById("adressAeachId");
			var config = { eID: "adressAeachId", url: '../../config/common/mapSearch/img/tuding.png', width: 20, height: 28, x: position.x, y: position.y, z: 500};
	        param.mScene.addEntityBillboard(config);
			var config = {
			            x: position.x * 1,
			            y: position.y * 1,
			            height: position.y * 1 + 900,
			            heading: 0.0002141084319855795,
			            pitch: -1.5707953113269526,
			            roll: 0,
			            type: "flyto"
			        }
	        param.mScene.resetCenter(config);		
		}
		
    module.exports = mapAddressSearch;
});