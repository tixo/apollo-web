define(function(require, exports, module) {
	var mapTools = {
		mapEvent :{},
		sceneEvent :{}
	};
	function initMapTools(mapEvent,sceneEvent) { 
		mapTools.mapEvent = mapEvent;
		mapTools.sceneEvent = sceneEvent;
		initClick();
	}
	function initClick(){
		//平移2
	    $("#translation").click(function(){
	    });
		//测距2
	 	$(window.parent.document).find("#distance").unbind('click').bind('click',function(){
	 		parent.moreHide();
	 		var current = $(".z-card").html();
	 		if(current=="三维"){
	 			mapTools.sceneEvent.supermap3DUtils.measure3DUtil.activateMeasure3DControl("DIS");
	 		}else{
	 			mapTools.mapEvent.mapInit.pluginsAPI.meature.meatureDistenceStart();
	 		}
		});
	     //测面2
	    $(window.parent.document).find("#area").unbind('click').bind('click',function(){
	    	parent.moreHide();
	    	var current = $(".z-card").html();
	 		if(current=="三维"){
	    		mapTools.sceneEvent.supermap3DUtils.measure3DUtil.activateMeasure3DControl("AREA");
	   		}else{
	    		mapTools.mapEvent.mapInit.pluginsAPI.meature.meatureAreaStart();
	    	}
	   	});
	     //清除2
	    $(window.parent.document).find("#clear").unbind('click').bind('click',function(){
	 		parent.moreHide();
	 		var current = $(".z-card").html();
	 		if(current=="三维"){
	 			mapTools.sceneEvent.supermap3DUtils.measure3DUtil.deactiveAllMeasure3DControl();
		    }else{
		 		//清除测量要素
				if(parent.window.measureIndex!=undefined){
					mapTools.mapEvent.mapInit.pluginsAPI.meature._clearMeasureResult(parent.window.measureIndex);
				}
			}
	    });
	      //全幅2
	    $(window.parent.document).find("#full").unbind('click').bind('click',function(){
	 		parent.moreHide();
	 		var current = $(".z-card").html();
	 		if(current=="三维"){
		 		var center={
			 		x: services.sceneconfig.x,
					y: services.sceneconfig.y, 
					height: 1000,
					heading: services.sceneconfig.heading,
					pitch: services.sceneconfig.pitch,
					roll:services.sceneconfig.roll,
					type:services.sceneconfig.type
			 	};
			    mapTools.sceneEvent.supermap3DUtils.sceneUtil.resetCenter(center);
	   		}else{
	 			mapTools.mapEvent.mapInit.mapAPI.fullview();
	 		}
	    });
	     //全屏2
	    $(window.parent.document).find("#full-screen").unbind('click').bind('click',function(){
		 	//var fullScreenName =  $("#full-screen-name").html();
			full("全屏");
		});
		//测距3D
	  	$("#distance3D").click(function(){
	 	 	cutBg(this,3);
		});
	     //测面3D
	    $("#area3D").click(function(){
	     	cutBg(this,3);
		    mapTools.sceneEvent.supermap3DUtils.measure3DUtil.activateMeasure3DControl("AREA");
	    });
	     //清除3D
	    $("#clear3D").click(function(){
	     	cutBg(this,3);
		    mapTools.sceneEvent.supermap3DUtils.measure3DUtil.deactiveAllMeasure3DControl();
	    });
	     //平移3D
	    $("#translation3D").click(function(){
	 		cutBg(this,3);
		  /*  $("#cesiumContainer").bind("mousemove",function(e){
		        $(".cesium-viewer").css("left",e.pageX).css("top",e.pageY)
		    });
		    $("#cesiumContainer").mouseup(function(){
		        //鼠标弹起时给div取消事件
		        $("#cesiumContainer").unbind("mousemove")
		    })*/
	    });
	     //全幅3D
	    $("#full3D").click(function(){
		 	cutBg(this,3);
		 	var center={
		 		x: services.sceneconfig.x,
				y: services.sceneconfig.y, 
				height: 2200,
				heading: services.sceneconfig.heading,
				pitch: services.sceneconfig.pitch,
				roll:services.sceneconfig.roll,
				type:services.sceneconfig.type
		 	};
			mapTools.sceneEvent.supermap3DUtils.sceneUtil.resetCenter(center);
	    });
	     //全屏3D
	    $("#full-screen3D").click(function(){
		 	cutBg(this,3);
		 	var fullScreenName =  $("#full-screen-name3D").html();
			full(fullScreenName);
		});
		 //监听全屏、退出状态变化
		if (parent.window.addEventListener) {
		  	//谷歌全屏监听
		    parent.document.addEventListener('webkitfullscreenchange', function(){ 
		    	listenerHandle();
		    });
		    //火狐全屏监听
		    parent.document.addEventListener('mozfullscreenchange', function(){ 
		    	 listenerHandle();
		    });
		}
	}
	//全屏
	function full(fullScreenName){
		if(thisIframe.sjtj == undefined){
	   		showLeftPushFun();
	    }
	    if("全屏"==fullScreenName){
			 if (thisIframe.webkitRequestFullScreen) {
			 	 if ( window.navigator.userAgent.toUpperCase().indexOf( 'CHROME' ) >= 0 ) {
	                 thisIframe.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
	            }
				 thisIframe.webkitRequestFullScreen();
			 } else if(thisIframe.mozRequestFullScreen){
			 	thisIframe.mozRequestFullScreen();
			 }
	    }else{
	     	if(parentDoc.webkitCancelFullScreen){
	     		 parentDoc.webkitCancelFullScreen();
	     	}else{
	     		parentDoc.mozCancelFullScreen();
	   		}
	    }
	}
	//切换地图背景色	  
	function cutBg(obj,cut){
		if(cut==3){
			$(".3D").find("div").removeClass("top-operation-bg");
		   $(obj).addClass("top-operation-bg");
		}else{
		   $(".2D").find("div").removeClass("top-operation-bg");
		   $(obj).addClass("top-operation-bg");
		}
		
	}
	//左边菜单隐藏
	function hideLeftPush(){
		var obj = $("#showLeftPush");
		obj.removeClass('active' );
		$(body).addClass('cbp-spmenu-push-toright' );
		$(menuLeft).addClass('cbp-spmenu-open' );
		obj.addClass('showRightPushBg');
		$("#cesiumContainer").css({ "left": "0px", "width": "100%" });
	    $("#map").css({ "left": "0px", "width": "100%" });
	    $(".time-box").css({ "width": "100%" });
	}
	//左边菜单显示、
	function showLeftPushFun(){
		var obj = $("#showLeftPush");
		obj.addClass('active' );
		$(body).removeClass('cbp-spmenu-push-toright' );
		$(menuLeft).removeClass('cbp-spmenu-open' );
		obj.removeClass('showRightPushBg');
		$("#cesiumContainer").css({ "left": "293px", "width": "calc(100% - 293px)" });
	    $("#map").css({ "left": "293px", "width": "100%" });
	    $(".time-box").css({ "width": "calc(100% - 293px)" });
	}
	//全屏监听处理
	function listenerHandle(){
		var current = $(".z-card").html();
		var fullScreenName = null;
		if("三维" == current){
			fullScreenName =  $("#full-screen-name3D").html();
		}else if("二维" == current　||　"影像" == current){
			fullScreenName =  $("#full-screen-name").html();
		}
		if("退出全屏"==fullScreenName){
			if(thisIframe.sjtj == undefined){
				showLeftPushFun();
				$("#showLeftPush").show();
				//今日案件统计
				$("#ajtx-box").show();
				$("#cesiumContainer").css({"left":"293px","top":"32px", "width": "calc(100% - 293px)"});
			}
			cutBg($("#translation"));
			$(".top-operation").show();
		 	if("三维" == current){
				$("#full-screen-name3D").html("全屏");
			}else if("二维" == current ||　"影像" == current){
				$("#full-screen-name").html("全屏");
			}
		 }else{
		 	if(thisIframe.sjtj == undefined){
				hideLeftPush();
			 	$("#showLeftPush").css("display","none");
			 	$(".top-operation").css("display","none");
			 	//今日案件统计
				$("#ajtx-box").hide();
				$("#cesiumContainer").css({ "left": "0px", "top": "0px" , "width": "100%"});
			}
		 	if("三维" == current){
				$("#full-screen-name3D").html("退出全屏");
			}else if("二维" == current　||　"影像" == current){
				$("#full-screen-name").html("退出全屏");
			}
		 }
	}
	function setMap3DCenter() {
	    var current = $(".z-card").html();
	    if ("三维" == current) {
	        var center={
		 		x: services.sceneconfig.x,
				y: services.sceneconfig.y, 
				height: 2200,
				heading: services.sceneconfig.heading,
				pitch: services.sceneconfig.pitch,
				roll:services.sceneconfig.roll,
				type:services.sceneconfig.type
		 	};
			mapTools.sceneEvent.supermap3DUtils.sceneUtil.resetCenter(center);
	    } else {
	        mapTools.mapEvent.mapInit.mapAPI.fullview();
	    }
	}
	 //给外部提供接口
    var mapTools = {
        initMapTools:initMapTools,
        setMap3DCenter:setMap3DCenter
    };
    module.exports = mapTools;
});
  
