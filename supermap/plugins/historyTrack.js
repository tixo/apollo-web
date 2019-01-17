/**
 * 轨迹回放 封装
 * author qhj
 */
define(function(require, exports, module){
    //接口方法 
    var tRackInterface={
    	mapUtil:null,
        animatorVector:null,
        /**
         * 初始化动态图层,初始化轨迹数据，并加载
         * @param {Object} json 初始化动态图层及加载轨迹数据所需要的参数
         * json = {
         *  mapUtil: , //地图相关操作对象，在map_init.js下面
         * 	animatorVector: , //动态图层（必需参数）
         *  trackdata:[{x:, y: },{x:, y: }...], //轨迹数据（必需参数）
         *  drawfeaturestart: ,  //每次绘制在当前时间节点内的feature时触发的回调函数（必需参数）
         *  iconStyle: {   //矢量要素style（可选参数）
         * 		externalGraphic: , //图片地址
         *  	graphicWidth: , //图片宽度
         *  	graphicHeight:  //图片高度
         * 		...
         *  }
         * }
         */
        initTracks: function(json){
        	var cars=[],carpoi=[];    	
        	if(json.mapUtil==undefined || json.animatorVector==undefined || json.trackdata==undefined || json.drawfeaturestart==undefined || typeof(json.drawfeaturestart)!="function"){
        		console.log("初始化轨迹回放所需参数不完整！");
        		return;
        	}
        	tRackInterface.mapUtil = json.mapUtil;
        	tRackInterface.animatorVector = json.animatorVector;
        	//设置速度
      		tRackInterface.animatorVector.animator.setSpeed(0.03);
    		//设置开始时间
      		tRackInterface.animatorVector.animator.setStartTime(0);
    		//设置结束时间
    		tRackInterface.animatorVector.animator.setEndTime(json.trackdata.length);
    		/*
    		 * drawfeaturestart 每次绘制在当前时间节点内的feature时触发。
    		 * drawFrame 绘制帧，动画的每一帧都会触发此事件，传回的参数即为当前渲染的要素
    		 * featurerendered 要素渲染事件，当要素被渲染后发触发，返回一个当前补间动画中真实被渲染的要素，这样可记录运动的轨迹 例如：
			 */
    		tRackInterface.animatorVector.events.on({
    			"drawfeaturestart": function(feature){
	    			if(typeof(json.drawfeaturestart)==="function"){
	            		json.drawfeaturestart(feature);
	                }
	    		}
    		});
    		
    		/*var lineFeature = new SuperMap.Feature.Vector(new SuperMap.Geometry.LineString(carpoi));
    	    lineFeature.style = {
    	   		stroke:true,
    	   		strokeColor:"#b5a1f9",
    	   		strokeWidth:8,
    	   		strokeOpacity:1,
    	   		strokeDashstyle:"solid"
    	    };*/
    	  /*  this.map.vectorGL.addFeatures(lineFeature);
    	    this.map.setMapExtentByFeatures({vectorLayer:this.map.vectorGL,features:lineFeature,isHave:true});
    		*/
    		for(var k = 0;k< json.trackdata.length; k++) {
    			var sp = null;
    			var currentp = json.trackdata[k];
    			var iconStyle = json.iconStyle==undefined ? {externalGraphic:"./images/marker.png",graphicWidth:20,graphicHeight:20,allowRotate:true}:json.iconStyle;
    			var point = new SuperMap.Geometry.Point(Number(currentp.x),Number(currentp.y));
    			var car = new SuperMap.Feature.Vector(point,{FEATUREID:'featureid',TIME:k,smooth:true},iconStyle);
    			cars.push(car);
    		}
    		//定位到起点
    		tRackInterface.animatorVector.addFeatures(cars);
    		tRackInterface.animatorVector.redraw();
    		tRackInterface.mapUtil.mapAPI.setTopLayer("animatorVector");
      		tRackInterface.mapUtil.mapAPI.setMapCenter({
      			x:json.trackdata[0].x, 
      			y:json.trackdata[0].y, 
      			zoom: tRackInterface.mapUtil.mapAPI.map.getZoom()
      		});
        },
        /**
         * 开始播放
         */
        trackStart: function(){
        	tRackInterface.animatorVector.animator.start();
        },
        /**
         * 加速播放
         */
        trackIncrease: function(){
        	tRackInterface.animatorVector.animator.setSpeed(tRackInterface.animatorVector.animator.getSpeed()*1.5);
    		var cur=tRackInterface.animatorVector.animator.getCurrentTime();
    		tRackInterface.animatorVector.animator.setCurrentTime(cur*1);
        },
        /**
         * 减速播放
         */
        trackDecrease: function(){
        	tRackInterface.animatorVector.animator.setSpeed(tRackInterface.animatorVector.animator.getSpeed()*0.5);
        },
        /**
         * 暂停播放
         */
        trackPause: function(){
        	tRackInterface.animatorVector.animator.pause();
        },
        /**
         * 停止播放
         */
        trackStop: function(){
        	tRackInterface.animatorVector.animator.stop();
    		tRackInterface.animatorVector.animator.setCurrentTime(0);
    		tRackInterface.animatorVector.animator.setSpeed(0.01);
        },
        /**
         * 清除所有轨迹
         */
        trackClear: function(){
        	if(tRackInterface.animatorVector!=null){
	        	tRackInterface.animatorVector.animator.stop();
	    		tRackInterface.animatorVector.animator.setCurrentTime(0);
	    		tRackInterface.animatorVector.animator.setSpeed(0.01);
	     		//tRackInterface.map.vectorGL.removeAllFeatures();
	    		tRackInterface.animatorVector.removeAllFeatures();
    		}
        },
        /**
         * 动画设置
         */
        animatorTrack: function(carpoi){
			if(tRackInterface.tempcount<carpoi.length){
				setTimeout(function(){
					tRackInterface.tempcount+=1;	
					tRackInterface.animatorTrack(carpoi);	
				},10);	
			}			
	    },
        /**
         * 计算动态目标的方向
         * startPoint  起点
         * endPoint  终点
         */
        getAngle: function(startPoint,endPoint){
    		var dRotateAngle = Math.atan2(Math.abs(startPoint.x - endPoint.x), Math.abs(startPoint.y - endPoint.y));
    		if(endPoint.x >= startPoint.x){
    			if(endPoint.y >= startPoint.y){
    				
    			}else{  
    	            dRotateAngle = Math.PI - dRotateAngle;  
    	        }  
    	    }else{
    	    	if(endPoint.y >= startPoint.y){
    	    		dRotateAngle = 2 * Math.PI - dRotateAngle;  
    	        }else{
    	        	dRotateAngle = Math.PI + dRotateAngle;
    	        }
    	    }
    		dRotateAngle = dRotateAngle * 180 / Math.PI;  
    		return dRotateAngle;
    	}
    };
    
    	module.exports = tRackInterface;
});