/*
 * 系统初始化组
 * @author qhj,appea
 */
window.onload=function(){
	seajs.config({
		base: "./",
		alias: {
			'jquery': 'module/jquery/jquery-1.8.1.min.js',
			'angular': 'module/angular/angular-1.2.2.js'
		}
	});
	seajs.use(['assets/js/ui_init.js'], function(ui,auth) {

	});
//	seajs.use(['supermap/map_init.js','supermap/scene_init.js','assets/js/ui_init.js'], function(mapAPI,scene3DAPI,ui) {
//
//	});
    authDiapatched();
    
    /*window.cameraLogin();*/
}

//绑定onbeforeunload事件   
window.onbeforeunload=function () {
	authDiapatched();
	window._webSocket.disconnect();
}
//退出系统
function loginOut(){
	window.location.href = window.fhzxApolloApi+"logout?userId="+window.authorization.userId;
}
//切换系统
function switchingSystem(){
	window.location.href = window.fhzxApolloApi+"index.html";
}
//top 设置
function setting(){
//弹出一个iframe层
  layer.open({
    type: 2,
    title: '设置值班组',
    shade: 0.3,
    maxmin: false,
    shadeClose: false, 
    area: ['500px', '260px'],
    content: './assets/html/top/setting.html'
  });
}
function updatePassword() {
	//弹出一个iframe层
	layer.open({
		type: 2,
		title: '修改密码',
		shade: 0.3,
		maxmin: false,
		shadeClose: false,
		area: ['500px', '350px'],
		content: window.frontHttpUrl +'scheduling/user/password.html'
	});
}