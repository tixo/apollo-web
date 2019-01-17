/*
 * 自定义气泡组
 * @author zjc
 */
define(function(require, exports, module) {
	//气泡变量
	var map,elementsDiv,positionConfig={};
	//初始化气泡
	function popupInit(Map,layer){
		map = Map;
		elementsDiv = layer.getDiv();
		var size = map.getSize();
		elementsDiv.style.width = size.w;
		elementsDiv.style.height = size.h;
		map.events.on({
			moveend:popupMove
			/*click: function(){
				clearPopup();
			}*/
		})
	}
	//气泡随地图拖动而移动
	function popupMove(){
		changePosition();
	}
	/*
	 *弹出气泡
	 *config参数（必须）：x、y——指定气泡坐标（用于质心偏离的线、面状要素或marker对象）；contentHTML--气泡模板信息；
	 *config参数（可选）：width——气泡宽度；height--气泡高度；offsetX、offsetY——指定气泡弹出偏移量（单位：像素）；center——是否居中显示(boolean型)；
	 */
	function showPopup(config){
		if(config.x == undefined || config.y == undefined || config.contentHTML == undefined){
			console.log("创建气泡必需参数不完整!");
			return;
		}
		selected = config.selected;
		var popupTemplate = config.contentHTML;
		positionConfig={
			x:config.x,
			y:config.y,
			offsetX:config.offsetX == undefined ? 0 : config.offsetX,
			offsetY:config.offsetY == undefined ? 0 : config.offsetY,
			width:config.width == undefined ? 350 : config.width,
			/*height:config.height == undefined ? 210 : config.height,*/
			center:config.center==undefined ? false : config.center
		}
		clearPopup();
		//将气泡图层置顶
		parent.window.mapUtil.mapAPI.setLayerZindex("elementsLayer",9999);
		$(elementsDiv).append(popupTemplate);
		$("#popup").css({"width":positionConfig.width+"px", "height":positionConfig.height+"px"});
		changePosition();
	}
	//气泡位置重定位
	function changePosition(){
		var pixel=getPxFromLonlat(positionConfig.x,positionConfig.y);
		$("#popup").css({"left":pixel.x+positionConfig.offsetX+"px", "top":pixel.y+positionConfig.offsetY+"px"});
		if(positionConfig.center){
			//将中心点视觉中心放在气泡中央
			var lonlat=map.getLonLatFromPixel(new SuperMap.Pixel(pixel.x+$("#popup").width()/2,pixel.y+($("#popup").height()+38)-$("#popup").height()/2));
			map.setCenter(lonlat);
		}
	}
	//lonlat转px
	function getPxFromLonlat(lon,lat){
		var pixel=map.getPixelFromLonLat(new SuperMap.LonLat(lon,lat));
		pixel.x=pixel.x-$("#popup").width()/2;
		pixel.y=pixel.y-$("#popup").height();
		return pixel;
	}
	
	/**
	 * 关闭气泡
	 */
	function clearPopup(){
		$("#popup").remove();
	}
	
	popup={
		popupInit:popupInit,
		showPopup:showPopup,
		changePosition: changePosition,
		clearPopup:clearPopup
	}
	module.exports = popup;
	window.popup=popup;
})