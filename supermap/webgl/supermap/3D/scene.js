/**
 * 三维webgl场景组api 
 */
define(function(require, exports, module){
	 var BING_MAP_KEY='ArLWvxLVAh1vxsmDZuOxr94On14sA52a_IPUewEz8H7mm3qDQnjWe-OzJtu1PZpZ';
	var mScene = {
		domId: "",
		cesium: {},
		viewer: {},
		scene: {},
		/**
		 * 初始化三维场景
		 * @param {Object} json{
		 * 						cesium:webgl对象, 必需参数
		 * 						id:承载场景div的id, 必需参数
		 * 					}
		 */
		initScene: function(json){
			if(json.cesium == undefined || json.id == undefined){
				console.log("初始化场景所需的必需参数不完整!");
				return;
			}
			mScene.cesium = json.cesium;
			 mScene.viewer = new Cesium.Viewer(json.id/*,{
	            imageryProvider: new Cesium.BingMapsImageryProvider({
	                url : 'https://dev.virtualearth.net',
	                mapStyle : Cesium.BingMapsStyle.AERIAL,
	                key : BING_MAP_KEY
	            })
	        }*/);
				
			mScene.domId = json.id;
			mScene.scene = mScene.viewer.scene;
		},
		/**
		 * 打开场景中所有的图层。 
		 * @param {Object} json{
		 * 						url:场景服务地址，          必需参数
		 * 						center: 相机位置，      必需参数
		 * 						callback: 打开场景后的回调函数      可选参数
		 * 					}
		 */
		openScene: function(json){
			if(json.url == undefined || json.center == undefined){
				console.log("打开场景所需的必需参数不完整!");
				return;
			}
			var callbackOpenedScene;
			if(json.callbackOpenedScene != undefined && typeof(json.callbackOpenedScene) == "function"){
				callbackOpenedScene = json.callbackOpenedScene;
			}else{
				callbackOpenedScene = function(){};
			}
			var widget = mScene.viewer.cesiumWidget;
			try {
				//打开所发布三维服务下的所有图层
				var sceneUrl = json.url==undefined ? "":json.url;
				var promise = mScene.scene.open(sceneUrl);
				Cesium.when(promise, function(layer) {
					if(json.singleDataLayerNames!=undefined && json.singleDataLayerNames.length>0){
						mScene.setSingleDataAlpha(json.singleDataLayerNames);
					}
					//设置相机位置，定位至模型
					mScene.resetCenter(json.center);
					// 加载完场景之后的回调函数
					callbackOpenedScene();
					if(!mScene.scene.pickPositionSupported) {
						console.log('不支持深度纹理,无法拾取位置！');
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
		},
		/**
		 * 设置相机位置，定位至模型，
		 * @param {Object} json{
		 * 					x: 相机x坐标， （必需参数）
		 * 					y: 相机y坐标， （必需参数）
		 * 					height: 相机高度，（可选参数,默认为800）
		 * 					type: flyto--飞向目标点； setView--没有飞行动画，直接定位到目标位置；（可选参数，默认为flyto）
		 * 					heading: 方位角, （可选参数,默认为0）
		 * 					pitch: 俯仰角, （可选参数,默认为-90）
		 * 					roll: 滚动角 （可选参数,默认为0）,
		 * 					callbackComplete: 飞到指定位置之后的回调函数（可选参数）
		 * 				}
		 */
		resetCenter: function(json){
			if(json.x == undefined || json.y == undefined){
				console.log("设置相机位置必需参数不完整！");
				return;
			}
			var callbackComplete;
			if(json.callbackComplete != undefined && typeof(json.callbackComplete) == "function"){
				callbackComplete = json.callbackComplete;
			}else{
				callbackComplete = function(){};
			}
			var type = json.type==undefined ? "flyto":json.type;
			if(type=="flyto"){
				mScene.scene.camera.flyTo({
				    destination : mScene.cesium.Cartesian3.fromDegrees(json.x, json.y, json.height==undefined ? 800:json.height),
				    orientation : {
				    	heading : json.heading != undefined ? json.heading:0,
				        pitch : json.pitch != undefined ? json.pitch:-90,
				        roll : json.roll != undefined ? json.roll:0
//				        heading : mScene.cesium.Math.toRadians((json.heading != undefined) ? json.heading:0),
//				        pitch : mScene.cesium.Math.toRadians((json.pitch != undefined) ? json.pitch:-90),
//				        roll : json.roll != undefined ? json.roll:0
				    },
				    complete: function(){
				    	//飞行到指定地点后的回调函数
				    	callbackComplete();
				    }
				});
			}else if(type=="setView"){
				mScene.scene.camera.setView({
				    destination : mScene.cesium.Cartesian3.fromDegrees(json.x, json.y, json.height==undefined ? 800:json.height),
				    orientation : {
				    	heading : json.heading != undefined ? json.heading:0,
				        pitch : json.pitch != undefined ? json.pitch:-90,
				        roll : json.roll != undefined ? json.roll:0
//				        heading : mScene.cesium.Math.toRadians((json.heading != undefined) ? json.heading:0),
//				        pitch : mScene.cesium.Math.toRadians((json.pitch != undefined) ? json.pitch:-90),
//				        roll : json.roll != undefined ? json.roll:0
				    },
				    complete: function(){
				    	//飞行到指定地点后的回调函数
				    	callbackComplete();
				    }
				});
			}
		},
		/**
		 * 添加一个相机移动事件
		 * @param {function} moveEndCallback 相机移动后的回调函数
		 */
		andMoveEndListener: function(moveEndCallback){
			if(moveEndCallback==undefined && typeof(moveEndCallback)!="function"){
				return;
			}else{
				mScene.scene.camera.moveEnd.addEventListener(moveEndCallback);
			}
		},
		/**
		 * 移除一个相机移动事件
		 * @param {function} moveEndCallback 之前添加的相机移动事件回调函数
		 */
		removeMoveEndListener: function(moveEndCallback){
			if(moveEndCallback==undefined && typeof(moveEndCallback)!="function"){
				return;
			}else{
				mScene.scene.camera.moveEnd.removeEventListener(moveEndCallback);
			}
		},
		/**
		 * 清除三维场景
		 */
		_destroy: function(){
			$("#"+mScene.domId).empty();
		},
		/**
		 * 设置开启/关闭地下场景
		 * @param {boolean} type： true--开启地下场景； false--关闭地下场景；
		 */
		setUnderground: function(type){
			var globe = mScene.scene.globe;
			//设置开启/关闭地下场景
			if(type==true){
				mScene.scene.undergroundMode = true;
				mScene.scene.screenSpaceCameraController.minimumZoomDistance = -1000;//设置相机最小缩放距离,距离地表-1000米
				//关闭裙边
        		mScene.scene.terrainProvider.isCreateSkirt = false;
			}else{
				mScene.scene.undergroundMode = false;
			}
		},
		/**
		 * 设置场景透明度
		 * @param {Object} alphaValue：透明度值，范围为0--1,0：为全透明，1：不透明
		 */
		setGlobeAlpha: function(alphaValue){
			var globe = mScene.scene.globe;
			mScene.setUnderground(true);
			globe.globeAlpha = alphaValue;//设置地表透明度
		},
		/**
		 * 设置调整场景透明度控件是否显示（提供默认的控件，如果不想使用此控件，也可以通过setGlobeAlpha（）方法自己去写）
		 * @param {Object} type
		 */
		globeAlphaControl: function(type){
			var globe = mScene.scene.globe;
			if(type==true){
				mScene.setUnderground(true);
				$("#globeAlphaControl").remove();
				$("#"+mScene.domId).append(
					"<div id='globeAlphaControl' style='position: absolute;left: 15px;top: 35px;z-index:1000;'>"
						+"<input type='range' min='0' max='1' step='0.02' title='调整地表透明度' data-bind='value: globeAlpha, valueUpdate: 'input''>"
						+"<input type='text' size='5' data-bind='value: globeAlpha'>"
					+"</div>"
				);
				mScene.setGlobeAlpha(1);
				//监听滑动条变化，改变alpha的值，设置地表透明度
		        var viewModel = {
		            globeAlpha : 1
		        };
		        mScene.cesium.knockout.track(viewModel);
		        var toolbar = document.getElementById('globeAlphaControl');
		        mScene.cesium.knockout.applyBindings(viewModel, toolbar);
		        mScene.cesium.knockout.getObservable(viewModel,'globeAlpha').subscribe(
	                function(newValue) {
	                    globe.globeAlpha = parseFloat(newValue);//设置地表透明度
	                }
		        );
			}else{
				$("#globeAlphaControl").remove();
			}
		},
		/**
		 * 设置单体数据透明度及选择样式
		 * @param {Array} layerNames 单体数据图层名称，是数组；
		 */
		setSingleDataAlpha: function(layerNames){
			for(var i=0; i<mScene.scene.layers._layers._array.length; i++){
				var slayer = mScene.scene.layers._layers._array[i];
				if(slayer._name!=undefined){
					for(var j=0; j<layerNames.length; j++){
						if(slayer._name.indexOf(layerNames[j])>=0){
							slayer.style3D._fillForeColor.alpha = 0.0;
				            slayer.selectColorType = 1.0;
				            slayer.selectedColor =  mScene.cesium.Color.RED;
				            slayer.selectedColor.alpha = 0.3;
				            break;
						}
					}
				}
			}
		},
		/**
		 * 根据给定的地图范围计算场景的高度
		 * @param {Object} bounds 给定的二维地图范围
		 * @return {Object} altitude 根据范围计算得到的场景高度
		 */
		_calculateAltitudeFromBounds: function(bounds) {
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
		},
		/**
		 * 根据给定的场景高度计算地图中显示范围的宽度
		 * @param {Object} altitude 给定的场景高度
		 * @return {Object} size 根据场景高度得到的地图显示范围尺寸
		 */
		_calculateSizeFromAltitude: function(altitude) {
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
		},
		/**
		 * 将世界坐标系转为经纬度坐标系
		 * @param {Object} cartesian3 世界坐标系
		 * @return {Object} 返回经纬度坐标
		 */
		cartesian3ToLonlat: function(cartesian3){
			var ellipsoid=mScene.scene.globe.ellipsoid;
			var cartographic=ellipsoid.cartesianToCartographic(cartesian3);
			var lon=mScene.cesium.Math.toDegrees(cartographic.longitude);
			var lat=mScene.cesium.Math.toDegrees(cartographic.latitude);
			var alt=cartographic.height;
			var point3D = {
				x: lon,
				y: lat,
				z: alt
			};
			return point3D;
		},
		
		/**
		 * 绑定单体化数据与二位面数据
		 * @param {config} layers 二维面服务地址
		 * @param {config} dataUrl 二维面服务地址
		 * @param {config} dataSourceName 数据源名称
		 * @param {config} dataSetName 数据集名称
		 * @param {config} keyWord 绑定的数据的字段
		 */
		setQueryParam: function (config){
			config.layers.setQueryParameter({
		        url: config.dataUrl,
		        dataSourceName: config.dataSourceName,
		        dataSetName: config.dataSetName,
		        keyWord: config.keyWord
			});
		},
				
		selectEntityListener: function (successCallback,fieldCallback){
			mScene.viewer.selectionIndicator.destroy();
			mScene.viewer.infoBox.destroy();
			mScene.viewer.selectedEntityChanged.addEventListener(function(entity){
				var result = {};
				if(entity){
					for(var i=0; i<entity.propertyNames.length; i++){
						if(entity[entity.propertyNames[i]] != undefined){
							if(entity.propertyNames[i]=="feature"){
								result ={type:entity.propertyNames[i], entity:entity[entity.propertyNames[i]], lonlat:mScene.viewer.selectedEntity.scenePos};
							}else{
								result ={type:entity.propertyNames[i], entity:entity[entity.propertyNames[i]], lonlat:mScene.viewer.selectedEntity.position._value};
							}
							break;
						}
					}
					if(typeof(successCallback) === "function"){
						successCallback(entity);
					}
				}else{
					if(fieldCallback!=undefined && typeof(fieldCallback)==="function"){
						fieldCallback();
					}
				}
			});
		},
		
		selectBuildingListener: function (successCallback,fieldCallback){
			mScene.viewer.selectionIndicator.destroy();
			mScene.viewer.infoBox.destroy();
			mScene.viewer.selectedEntityChanged.addEventListener(function(entity){
				var result = {};
				if(entity){
					for(var i=0; i<entity.propertyNames.length; i++){
						if(entity[entity.propertyNames[i]] != undefined){
							if(entity.propertyNames[i]=="feature"){
								result ={type:entity.propertyNames[i], entity:entity[entity.propertyNames[i]], lonlat:mScene.viewer.selectedEntity.scenePos};
							}else{
								result ={type:entity.propertyNames[i], entity:entity[entity.propertyNames[i]], lonlat:mScene.viewer.selectedEntity.position._value};
							}
							break;
						}
					}
					if(typeof(successCallback) === "function"){
						successCallback(entity);
					}
				}else{
					if(fieldCallback!=undefined && typeof(fieldCallback)==="function"){
						fieldCallback();
					}
				}
			});
		},
		/**
		 * 添加Billboar（广告牌）实体,相当于marker点
		 * @param {Object} obj
		 * obj={
		 * 		eID: 设置这个对象的唯一标示，(必需参数)
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
		 * 		labelOffsetY: 注记Y轴偏移量，当isLabel为true时生效,
		 * 		attributes: 属性信息（可选参数）
		 * }
		 */
		addEntityBillboard: function(obj){
			if(obj.eID == undefined){
				console.log("初始化marker对象的必需参数不完整！");
				return;
			}
			var isLabel = obj.isLabel==undefined ? false:obj.isLabel;
			var x = obj.x==undefined ? 0:obj.x;
			var y = obj.y==undefined ? 0:obj.y;
			var z = obj.z==undefined ? 5:obj.z;
			var entity = new mScene.cesium.Entity({position:mScene.cesium.Cartesian3.fromDegrees(x, y, z)});
			var billboard = new mScene.cesium.BillboardGraphics({
				image : obj.url==undefined ? "":obj.url,
			    width : obj.width==undefined ? 28:obj.width,
			    height : obj.height==undefined ? 36:obj.height,
			    disableDepthTestDistance :Number.POSITIVE_INFINITY,
			    ready:true
			});
			billboard.attributes = obj.attributes == undefined ? {}:obj.attributes;
			billboard.ready=true;
			entity.billboard = billboard;
			entity.eID = obj.eID;
			if(isLabel == true){
				var label = new mScene.cesium.LabelGraphics({
					text : obj.labelText==undefined ? "":obj.labelText,
					fillColor : obj.labelColor==undefined ? "#000":obj.labelColor,
					font : obj.textFont==undefined ? "18px 微软雅黑":obj.textFont,
					pixelOffset : new Cesium.Cartesian2(obj.labelOffsetX==undefined ? 0:obj.labelOffsetX, obj.labelOffsetY==undefined ? 0:obj.labelOffsetY)
				});
				label.attributes = obj.attributes == undefined ? {}:obj.attributes;
				entity.label = label;
			}
			//将构造好的实体加入enty中
			mScene.viewer.entities.add(entity);
		},
		addEntityPolyline:function(arrayXY,eID){
			var purpleArrow = mScene.viewer.entities.add({
	            name : 'Purple straight arrow at height',
	            eID:eID,
	            polyline : {
	                positions : Cesium.Cartesian3.fromDegreesArrayHeights(arrayXY),
	                width : 10,
	                followSurface : false,
	                material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE)
	            }
	        });
		},
		/**
		 * 获取所有实体对象
		 */
		getAllEntities: function(){
			return mScene.viewer.entities._entities._array;
		},
		
		/**
		 * 根据eID获取对应的实体
		 * @param {Object} eID 创建marker实体时的唯一标示
		 * @param Entity entity 获取到的指定id的实体对象；如果集合中不存在该id的实体，返回undefined。
		 */
		getEntityById: function(eID){
			var entity;
			var entities = mScene.viewer.entities._entities._array;
			for(var i=0; i<entities.length; i++){
				if(entities[i].eID === eID){
					entity = entities[i];
					break;
				}
			}
			return entity;
		},
		/**
		 * 根据eID删除对应的实体
		 * @param {Object} eID 创建marker实体时的唯一标示
		 * 移除成功返回true；如果指定id的实体不存在于集合中，移除失败则返回false。
		 */
		clearEntityById: function(eID){
			var entity = mScene.getEntityById(eID);
			if(entity!=undefined&&entity!=null){
				var flag = mScene.viewer.entities.removeById(entity.id);
				if(flag == true){
					console.log("删除成功");
				}else{
					console.log("删除失败");
				}
			}
		},
		/**
		 * 清除场景中添加的所有的实体
		 */
		clearAllEntities: function(){
			mScene.viewer.entities.removeAll();
		},
		/**
		 * 清除场景中添加的指定的实体
		 * @param Entity entity 指定的实体对象
		 */
		clearEntities: function(entity){
			var flag = mScene.viewer.entities.remove(entity);
			if(flag == true){
				console.log("删除成功");
			}else{
				console.log("删除失败");
			}
		},
		/**
		 * 清除选中的状态
		 */
		clearSelectEntity: function(){
			for(var i=0; i<mScene.scene.layers._layers._array.length; i++){
				mScene.scene.layers._layers._array[i].releaseSelection();
			}
		}
	};
	
	//给外部提供接口
	module.exports = mScene;
});