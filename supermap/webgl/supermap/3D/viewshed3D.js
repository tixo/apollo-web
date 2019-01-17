/**
 * 三维webgl  viewshed3D
 * 可视区域分析
 */
define(function(require, exports, module) {
	var mViewshed3D = {
		viewshed3D :{},
		initChooseView: function(scene) { 
		 	//创建可视域分析对象
			mViewshed3D.viewshed3D = new Cesium.ViewShed3D(scene);
		},
		//绘制可视域
		chooseView: function(json) {
			if(json.startPosition == undefined || json.distance == undefined|| json.direction == undefined){
				console.log("摄像头可视域分析参数不完整!");
				return;
			}
			//设置视口位置
			mViewshed3D.viewshed3D.viewPosition = json.startPosition;
			mViewshed3D.viewshed3D.build();
			//设置可视域分析对象的距离及方向
			mViewshed3D.viewshed3D.distance=json.distance;
			mViewshed3D.viewshed3D.direction=json.direction;
			if(json.pitch!= undefined){
				mViewshed3D.viewshed3D.pitch = json.pitch;
			} 
			if(json.horizontalFov!= undefined){
				mViewshed3D.viewshed3D.horizontalFov = json.horizontalFov;
			} 
			if(json.verticalFov!= undefined){
				mViewshed3D.viewshed3D.verticalFov = json.verticalFov;
			} 
		},
		//方向（度）0-360
		direction: function(newValue){
			mViewshed3D.viewshed3D.direction = newValue;
		},
		//反转（度）-90-90
		pitch: function(newValue){
			mViewshed3D.viewshed3D.pitch = newValue;
		},
		//距离(米)1-500
		distance: function(newValue){
			mViewshed3D.viewshed3D.distance = newValue;
		},
		//水平视场角(度)1-120
		verticalFov: function(newValue){
			mViewshed3D.viewshed3D.verticalFov = newValue;
		},
		//垂直视场角(度)1-90
		horizontalFov: function(newValue){
			mViewshed3D.viewshed3D.horizontalFov = newValue;
		}
	}
    module.exports = mViewshed3D;
});