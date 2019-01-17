/**
 * 自定义气泡组件api
 */
define(function(require, exports, module){
	
	var basePopup = {
		lonlat: {lon:0, lat:0}, //{lon: 笛卡尔坐标系中的X值, lat: 笛卡尔坐标系中的Y值}
		offsetX: 0, //气泡X轴方向的偏移量
		offsetY: 0, //气泡Y轴方向上的偏移量,
		popupState: false, //气泡是否存在
		removeHandler:null,
		supermap3DUtils:"",
		/**
		 * 显示气泡
		 * @param {Object} obj 初始化气泡的参数
		 */
		showPopup: function(obj){
			//是否显示单个气泡，是---true; 否---false
			var singlePopup = obj.singlePopup==undefined ? true:obj.singlePopup;
			if(singlePopup){
				$(".mypopup").remove();
			}
			if(obj.tempId == undefined || obj.data == undefined){
				console.log("初始化气泡的必需参数不完整！");
				return;
			}
			basePopup.cartesian3 = obj.cartesian3;
			basePopup.offsetX = obj.offsetX==undefined ? 0:obj.offsetX;
			basePopup.offsetY = obj.offsetY==undefined ? 0:obj.offsetY;
			basePopup.supermap3DUtils = obj.supermap3DUtils;
			var config = {
				tempId: obj.tempId==undefined ? "":obj.tempId, //气泡模板的ID
				data: obj.data==undefined ? {}:obj.data, //气泡模板中需要的数据
				cartesian3: basePopup.cartesian3, //{lon: 笛卡尔坐标系中的X值, lat: 笛卡尔坐标系中的Y值}
				offsetX: basePopup.offsetX, 
				offsetY: basePopup.offsetY  
			};
			basePopup.initPopup(config);
		},
		/**
		 * 初始化气泡
		 */
		initPopup: function(config){
			//将笛卡尔坐标转换为屏幕坐标
			var position = basePopup.supermap3DUtils.sceneUtil.cesium.SceneTransforms.wgs84ToWindowCoordinates(basePopup.supermap3DUtils.sceneUtil.scene , config.cartesian3); 
			var x = parseInt(position.x);
			var y = parseInt(position.y);
			
			var html = template(config.tempId, config.data); 
			$("#cesiumContainer").append(html);
			
			var left = x -($(".mypopup").width()/2 - config.offsetX);
			var top = y - $(".mypopup").height() + config.offsetY;
			$(".mypopup").css({"left":left+"px", "top":top+"px"});
			basePopup.changePopupPosition();
		},
		/**
		 * 拖动场景时，改变气泡位置随场景一起移动
		 */
		changePopupPosition: function(){
			if(basePopup.removeHandler == null){
				basePopup.removeHandler = basePopup.supermap3DUtils.sceneUtil.scene.postRender.addEventListener(function(){
					var position = basePopup.supermap3DUtils.sceneUtil.cesium.SceneTransforms.wgs84ToWindowCoordinates(basePopup.supermap3DUtils.sceneUtil.scene , basePopup.cartesian3);
					if(position!=undefined&&position.x!=undefined){
						var x = parseInt(position.x);
						var y = parseInt(position.y);
						var left = x -($(".mypopup").width()/2 - basePopup.offsetX);
						var top = y - $(".mypopup").height() + basePopup.offsetY;
						$(".mypopup").css({"left":left+"px", "top":top+"px"});
					}
				});
			}
		},
		/**
		 * 关闭单个气泡
		 */
		closePopup: function(id){
			$("#"+id).remove();
			if(basePopup.supermap3DUtils.sceneUtil){
				basePopup.supermap3DUtils.sceneUtil.clearSelectEntity();
			}
		},
		closeAllPopup: function(){
			$(".mypopup").remove();
			if(basePopup.supermap3DUtils.sceneUtil){
				basePopup.supermap3DUtils.sceneUtil.clearSelectEntity();
			}
		}
	};
	
	//给外部提供接口
	module.exports = basePopup;
});