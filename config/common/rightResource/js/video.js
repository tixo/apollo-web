/************查看视频******************/
/**
 * 查看视频
 * @author zhangai
 */
define(function(require, exports, module) {
	var mDirection, mPitch, mDistance, mVerticalFov, mHorizontalFov;
	var name="";
	var up=0,down=15,left=0,right=15,leftUp=0,leftDown=15,rightUp=0,rightDown=15;

	var video = {
		openVideo:function(cameraObj) {
			var str = cameraObj.replace(/[\r\n]/g,"");
			var cameraObj = JSON.parse(str);
			console.log(cameraObj.address);
			if(cameraObj.installationAddress==undefined){
				cameraObj.installationAddress = cameraObj.address;
			}
			if(cameraObj.number==undefined){
                window.cameraId = cameraObj.no;
			}else{
                window.cameraId = cameraObj.number;
			}
			window.cameraLists = [cameraObj];
			layer.open({
			    type: 2,
			    title: ['视频播放', 'height: 30px;line-height: 30px'],
			    skin: 'layui-bg-blue',
			    shade: 0,
			    offset: ['190px', '0px'],
			    maxmin: true,
			    shadeClose: false, 
			    area: ['701px', '352px'],
			    content:'../../config/common/camera/multichannelCamera.html',
			    cancel: function() {
			    	video.closeVideoInfo();
	            }
			 });
			/*$("[name='videoElement']").attr("src",""),
			$(".shipin-box").show();
			$(".rit-sp").html("视频加载中...");
			if($.isEmptyObject(name)){
				$(".rit-sp").html("没有对应的摄像头信息！");
				return;
			}
	    	setTimeout(function(){
	    		var url = window.getCameraBatchUrl(stage);
				//加载视频流
				window.openStream(name,url);
			},1000);*/
	    if ( $('#ksyfx').is(":checked")) {
	    
	        videoParam.mapCut.cut3D();
	        //重新定位
			var cameraConfig = {
	            x: cameraObj.X * 1,
	            y: cameraObj.Y * 1 - 0.004,
	            height: 800,
	            heading: 0,
	            pitch: -0.6108652381980153,
	            roll: 0,
	            type: "setView"
	        }
	        videoParam.sceneEvent.supermap3DUtils.sceneUtil.resetCenter(cameraConfig);
	        var viewshed = {
	            startPosition: [cameraObj.X * 1, cameraObj.Y * 1, 500],
	            direction: 200, //角度
	            //pitch : 1.0,
	            distance: 50
	            /*,//距离
                verticalFov : 1.0,
                horizontalFov : 1.0,
                visibleAreaColor : '#ffffffff',
                invisibleAreaColor : '#ffffffff'*/
	        };
	        videoParam.sceneEvent.supermap3DUtils.viewshed3DUtil.chooseView(viewshed);
	        var viewshed = videoParam.sceneEvent.supermap3DUtils.viewshed3DUtil.viewshed3D;
	        mDirection = viewshed.direction;
	        mPitch = viewshed.pitch;
	        mDistance = viewshed.distance;
	        mVerticalFov = viewshed.horizontalFov;
	        mHorizontalFov = viewshed.verticalFov;
	    }
	    videoParam.mapEvent.mapInit.pluginsAPI.popup.clearPopup();
	   /* if($('.jilu-tiao').css("display")!="none"){
	    	 $.ajax({ //ajax获取布控作战方案
	            url: "../../app/anjianjingqing/js/video_record_data.json", //json文件位置
	            type: "get", //请求方式为get
	            //dataType: "json",
	            success: function(data) {
	                var html = template('videoRecord', {
	                    list: data.data
	                });
	                $('.shipin-log-ctn').append(html);
	                $(".shipin-log-box").show();
	            },
	            error: function() {
	                alert('加载超时！');
	            }
	        });
	    }*/
		},
		//关闭视频信息框
		closeVideoInfo:function(){
			up=0,down=15,left=0,right=15,leftUp=0,leftDown=15,rightUp=0,rightDown=15;
			videoParam.mapEvent.mapInit.pluginsAPI.popup.clearPopup();
			video.closeVideo();
		},
		//点击关闭视频监控
		closeVideo:function() {
		    videoParam.sceneEvent.supermap3DUtils.viewshed3DUtil.viewshed3D.distance = 0.1;
		    videoParam.sceneEvent.supermap3DUtils.sceneUtil.viewer.selectedEntity = null;
		   /* $(".shipin-box").hide();
		    $(".shipin-log-box").hide();*/
		  /*  scene.clearEntityById("sxtImg1");*/
		    window.clearIntervalCameraFun();
		},
		//修改视频监控记录
		updateVideoRecord:function() {
		    console.log("修改记录");
		},
		//修改视频监控记录
		deleteVideoRecord:function() {
		    $(this).parent("tr").html('')
		    console.log("删除记录");
		},
		//方向（度）0-360
		direction:function(type,cmd_p,one) {
			var spend=0;
		    if (type == "right") {
		    	mDirection += 2;
		    	right+=3;
		    	speed = right;
		    }else{
		    	mDirection -= 2;
		    	left-=3;
		    	speed = left;
		    } 
		    if (mDirection >= 360 || mDirection < 0) {
		        return;
		    }
		    if(one!=undefined){
		    	window.panRight(name,cmd_p,mDirection);
		    }
		    videoParam.sceneEvent.supermap3DUtils.viewshed3DUtil.direction(mDirection);
		},
		//反转（度）-90-90
		pitch:function(type,cmd_p,one) {
			var speed=0;
		    if (type == "up") {
		    	mPitch += 2;
		    	up+=3;
		    	speed = up;
		    }else {
		    	mPitch -= 2;
		    	down -= 3;
		    	speed = down;
		    }
		    if (mPitch >= 90 || mPitch < -90) {
		        return;
		    }
		    if(one!=undefined){
		    	window.panRight(name,cmd_p,speed);
		    }
		    videoParam.sceneEvent.supermap3DUtils.viewshed3DUtil.pitch(mPitch);
		},
		//  水平、方向and控制
		and:function(type,cmd_p) {
			var speed=0;
		    //右上
		    if ("rightUp" == type) {
		        video.direction("right",cmd_p,name);
		        video.pitch("up",cmd_p,name);
		        rightUp-=3;
		        speed = rightUp;
		    } else if ("leftDown" == type) {
		        video.direction("left",cmd_p,name);
		        video.pitch("down",cmd_p,name);
		        leftDown+=3;
		        speed = leftDown;
		    } else if ("leftUp" == type) {
		        video.direction("left",cmd_p,name);
		        video.pitch("up",cmd_p,name);
		        leftUp+=3;
		        speed = leftUp;
		    } else if ("rightDown" == type) {
		       video.direction("right",cmd_p,name);
		       video.pitch("down",cmd_p,name);
		       rightDown-=3;
		       speed = rightDown;
		    }
		     window.panRight(name,cmd_p,speed);
		},
		initVideo:function(sceneEvent,mapEvent,mapCut) {
			videoParam.sceneEvent = sceneEvent;
			videoParam.mapCut = mapCut;
			videoParam.mapEvent = mapEvent;
		}
	}
	var videoParam = {
		
	};
	module.exports = video;
});