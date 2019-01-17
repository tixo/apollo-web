function ui_load(){
	//根据屏幕分辨率加载logo
	if(window.screen.width<=1440){
		$("#logo").attr("src","img/logo1366.png");
	}else{
		$("#logo").attr("src","img/logo1920.png");
	}
	//调整菜单按钮位置
//	$(".main_top_right").css("left",window.screen.width-$(".main_top_right").width());
}
