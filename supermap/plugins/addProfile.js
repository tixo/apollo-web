/*
 * 添加图层简介窗口
 */
define(function(requier, exports, module){
	/*
	 * 简介窗口构建
	 * 参数：name--标题；content--显示内容
	 */
	function openProfile(config){
		var width=0, height=0;
		if($("#profile").length>0){
			$("#profile").remove();
		}
		if(window.screen.width<=1440){
			//添加图层简介
			$(".main_middle_map").append("<div id='profile' style='position:absolute; bottom:0px; right:0px; height:185px; width:300px; z-index:9999; background-image:url(assets/img/main_html/popup/cloud-popup-relative.png)'>"+
				"<div id='profile_top' style='width:100%; height:35px'>"+
					"<div id='profile_close' style='position:absolute; top:12px; left:13px; width:16px; height:16px; cursor:pointer; background-image:url(supermap/theme/images/theme_close.png);'></div>"+
					"<div id='profile_title' style='width:171px; height:32px; color:white; line-height:32px; text-align:center; font-size:1em; margin-top:0px; margin-bottom:0px; margin-right:auto; margin-left:auto; background-image:url(assets/img/main_html/popup/bubble_title.png)'>"
					+config.name+"</div>"
				+"</div>"
				+"<div id='profile_middle' style='height:220px; margin-right:5px; margin-left:13px;'>"
					+"<textarea id='profile_content' style='font-family:微软雅黑; font-size:16px; line-height:23px; letter-spacing:3px; height:64%; width:99%; resize:none;' readOnly='true'>"+config.content+"</textarea>"
				+"</div>"
			+"</div>");
		}else{
			//添加图层简介
			$(".main_middle_map").append("<div id='profile' style='position:absolute; bottom:0px; right:0px; height:250px; width:410px; z-index:9999; background-image:url(assets/img/main_html/popup/cloud-popup-relative.png)'>"+
				"<div id='profile_top' style='width:100%; height:35px'>"+
					"<div id='profile_close' style='position:absolute; top:12px; left:13px; width:16px; height:16px; cursor:pointer; background-image:url(supermap/theme/images/theme_close.png);'></div>"+
					"<div id='profile_title' style='width:171px; height:32px; color:white; line-height:32px; text-align:center; font-size:1em; margin-top:0px; margin-bottom:0px; margin-right:auto; margin-left:auto; background-image:url(assets/img/main_html/popup/bubble_title.png)'>"
					+config.name+"</div>"
				+"</div>"
				+"<div id='profile_middle' style='height:210px; margin-right:5px; margin-left:13px;'>"
					+"<textarea id='profile_content' style='font-family:微软雅黑; font-size:18px; line-height:25px; letter-spacing:4px; height:98%; width:99%; resize:none;' readOnly='true'>"+config.content+"</textarea>"
				+"</div>"
			+"</div>");
		}
		
		initChangeOC();
	}
	
	/*
	 * 移除图层简介
	 */
	function removeProfile(){
		$("#profile").remove();
	}
	
	/*
	 * 控制图层简介显示和隐藏的事件
	 */
	function initChangeOC(){
		var flag=0,width="0px",height="0px";
		if($("#profile").length>0){
			width=$("#profile").width();
			height=$("#profile").height();
			$("#profile_close").click(function(){
				if(flag==0){
					$("#profile_title").css("display","none");
					$("#profile").css({"width":"30px","height":"30px"});
					$("#profile_close").css({"background-image":"url('supermap/theme/images/theme_open.png')"});
					flag=1;
				}else{
					$("#profile").css({"width":""+width+"px","height":""+height+"px"});
					$("#profile_title").css("display","block");
					$("#profile_close").css({"background-image":"url('supermap/theme/images/theme_close.png')"});
					flag=0;
				}
			});
		}
	}
	
	var addProfile={
		openProfile:openProfile,
		removeProfile:removeProfile
	};
	module.exports=addProfile;
	window.addProfile = addProfile;
});