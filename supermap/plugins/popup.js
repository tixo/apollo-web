/*
 * 自定义气泡组
 * @author zjc
 * 2016.8.11
 */
define(function(require, exports, module) {
	//加载angularjs-1.2.2
	require("angular");
	//气泡模板定义
	var popupTemplate='<div class="popup" SMX="{{popup_x}}" SMY="{{popup_y}}" OFFSETX="{{offset_x}}" OFFSETY="{{offset_y}}" ng-controller="popupCtrl" ng-style="popup_style">'+
							'<div class="popup_top">'+
								'<div id="pop_clear" class="popup_close"></div>'+
								'<div class="popup_title">{{title}}</div>'+
							'</div>'+
							'<div class="popup_middle">'+
								'<div class="popup_table">'+
									'<table>'+
										'<tr ng-repeat="tr in data">'+
											'<td ng-repeat="td in tr" colspan="{{td.col}}" ng-class="{0:\'key\',1:\'\'}[$index%2]" title="{{td.value}}">{{td.value}}</td>'+
										'</tr>'+
									'</table>'+
								'</div>'+
								'<div id="detail_info" style="text-align: right; display: none">'+
									'<p id="detail_list" ng-click="openDetailList()" style="color: blue; margin: 0px; cursor: pointer" >详细信息>></p>'+
								'</div>'+
							'</div>'+
							'<div class="popup_bottom">'+
								'<div class="popup_arrow"></div>'+
							'</div>'+
						'</div>';
	//气泡变量
	var elementsDiv,appElement,$scope,detailUrl;
	//气泡mvm数据绑定
	angular.module("popup",[]).controller("popupCtrl",["$scope",function($scope){
		//气泡数据
		$scope.data=[];
		//气泡样式
		$scope.popup_style={}
		//气泡名称
		$scope.title="";
		//气泡经纬度
		$scope.popup_x="";
		$scope.popup_y="";
		//气泡偏移量
		$scope.offset_x="";
		$scope.offset_y="";
//		//关闭气泡
//		$scope.closePopup=function($event){
//			//先清除上一个闪烁事件
//			if(typeof(flashClear) != "undefined"){
//				clearTimeout(flashClear);
//			}
//			var thisElement=$event.target;
//			$(thisElement).parents('.popup').remove();
//		}
		//显示详细信息列表
		$scope.openDetailList=function(){
			//打开右侧面板
			var left_config={
				width:$("#left_iframe",parent.document).width(),
				height:$("#left_iframe",parent.document).height()-$(".main_middle_top",parent.document).height(),
				top:$(".main_middle_top",parent.document).height()
			}
			parent.window.ui.showCenterModule(detailUrl,left_config);
		}
	}]);
	//初始化气泡
	function popupInit(map,layer){
		elementsDiv = layer.getDiv();
		var size = map.getSize();
		elementsDiv.style.width = size.w;
		elementsDiv.style.height = size.h;
		map.events.on({
			moveend:popupMove
		})
	}
	//气泡随地图拖动而移动
	function popupMove(){
		for(var i=0;i<$(".popup").length;i++){
			var x=$(".popup").eq(i).attr("SMX");
			var y=$(".popup").eq(i).attr("SMY");
			var offsetX=Number($(".popup").eq(i).attr("OFFSETX"));
			var offsetY=Number($(".popup").eq(i).attr("OFFSETY"));
			var config={
				x:x,
				y:y,
				offsetX:offsetX,
				offsetY:offsetY,
				center:false
			}
			changePosition(config);
		}
	}
	/*
	 *弹出气泡
	 *config参数（必须）：feature——弹出气泡的所选对象,必须包括attributes属性(smx、smy和属性信息均从此读出)；popupConfig——气泡显示内容配置，样例同文件顶部示意；title——气泡名称；
	 *config参数（可选）：width——气泡宽度；x、y——指定气泡坐标（用于质心偏离的线、面状要素或marker对象）；offsetX、offsetY——指定气泡弹出偏移量（单位：像素）；center——是否居中显示(boolean型)；multiple——显示多个气泡(boolean型)；isDetailInfo--是否显示详细信息按钮(boolean型)；
	 *               detailUrl---显示详细信息的右侧面板的url
	 */
	function showPopup(config){
		config={
			feature:config.feature,
			x:config.x== undefined ? config.feature.geometry.getCentroid().x : config.x,
			y:config.y==undefined ? config.feature.geometry.getCentroid().y : config.y,
			offsetX:config.offsetX == undefined ? 0 : config.offsetX,
			offsetY:config.offsetY == undefined ? 0 : config.offsetY,
			popupConfig:JSON.stringify(config.popupConfig),
			title:config.title,
			width:config.width == undefined ? 650 : config.width,
			center:config.center==undefined ? false : config.center,
			isDetailInfo:config.isDetailInfo==undefined ? false : true,
			detailUrl:config.detailUrl==undefined ? "" : config.detailUrl
		}
		$(".popup").remove();
		//将气泡图层置顶
		window.mapAPI.setLayerZindex("elementsLayer",9999);
		$(elementsDiv).append(popupTemplate);
		if(config.isDetailInfo==true){
			$("#detail_info").css("display","block");
			detailUrl=config.detailUrl;
		}
		//angular外部调用scope;
		angular.bootstrap($(elementsDiv).find(".popup").eq(0), ['popup']);
		appElement = document.querySelector('[ng-controller=popupCtrl]');
		$scope = angular.element(appElement).scope(); 
		changeData(config);
	}
	//mvm数据绑定重新渲染
	function changeData(config){
		var popupConfig=JSON.parse(config.popupConfig);
		for(var i=0;i<popupConfig.length;i++){
			for(var j=0;j<popupConfig[i].length;j++){
				if(popupConfig[i][j].value.indexOf('{{')>=0){
					popupConfig[i][j].value=config.feature.attributes[popupConfig[i][j].value.replace(/{{/g,'').replace(/}}/g,'')];
				}
			}
		}
		$scope.popup_x=config.x;
		$scope.popup_y=config.y;
		$scope.offset_x=config.offsetX;
		$scope.offset_y=config.offsetY;
		$scope.data=popupConfig;
		$scope.popup_style.width=config.width+"px";
		$scope.title=config.title;
		$scope.$apply();
		changePosition(config);
	}
	//气泡位置重定位
	function changePosition(config){
		var pixel=getPxFromLonlat(config.x,config.y);
		$scope.popup_style.left=pixel.x+config.offsetX+"px";
		$scope.popup_style.top=pixel.y+config.offsetY+"px";
		if(config.center){
			//将中心点视觉中心放在气泡中央
			var lonlat=map.getLonLatFromPixel(new SuperMap.Pixel(pixel.x+$(".popup").width()/2,pixel.y+($(".popup").height()+38)-$(".popup").height()/2));
			map.setCenter(lonlat);
		}
		$scope.$apply();
	}
	//lonlat转px
	function getPxFromLonlat(lon,lat){
		var pixel=map.getPixelFromLonLat(new SuperMap.LonLat(lon,lat));
		pixel.x=pixel.x-$(".popup").width()/2;
		pixel.y=pixel.y-($(".popup").height()+38);
		return pixel;
	}
	//关闭所有气泡
	function clearPopup(){
		$(".popup").remove();
	}
	
	popup={
		popupInit:popupInit,
		showPopup:showPopup,
		clearPopup:clearPopup
	}
	module.exports = popup;
	window.popup=popup;
})