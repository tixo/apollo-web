/*
 * 选择矢量要素并弹出Popup功能
 */
define(function(require,exports,module){
	var selectFeatures;
	/*
	 * 初始化选择要素控件
	 * 参数（必须）：map--地图类；vectorLayer--创建选择要素控件所需的图层；selectSuccess--选中要素事件回调；unSelected--取消或者未选中要素回调
	 * 参数（可选）：hover--鼠标悬浮状态，默认false; selectStyle--选中要素的样式
	 */
	function initSelectFeature(config){
		config.map.removeControl(selectFeatures);
		/*var callbacks={
			click:callback
		};*/
		//创建选择要素控件
        selectFeatures = new SuperMap.Control.SelectFeature(config.vectorLayer,
		{
//			callbacks: callbacks,
			repeat:true,
			clickout:config.clickout==undefined ? false:config.clickout,
			onSelect:config.selectSuccess,
			onUnselect:config.unSelected,
			hover: config.hover==undefined ? false:config.hover
		});
		config.map.addControl(selectFeatures);
		//激活选择要素控件
		selectFeatures.activate();
	}
	
	//注销选择控件
	function destroySelectControl(){
		if(selectFeatures!=undefined){
			selectFeatures.deactivate();
		}
	}
	
	var selectFeature={
		initSelectFeature:initSelectFeature,
		destroySelectControl:destroySelectControl
	}
	module.exports=selectFeature;
	window.selectFeature=selectFeature;
});
