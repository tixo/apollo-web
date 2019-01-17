//判断客户端浏览器版本 若低于ie9则推荐下载chrome
(function ltie(){
	var b_name = navigator.appName; 
	var b_version = navigator.appVersion; 
	var version = b_version.split(";"); 
	var trim_version = version[1].replace(/[ ]/g, ""); 
	//if (b_name == "Microsoft Internet Explorer") { 
		/*如果低于IE8*/ 
		if (trim_version == "MSIE8.0" || trim_version == "MSIE7.0" || trim_version == "MSIE6.0") { 
			alert("您的IE浏览器版本过低，推荐使用ie 9以上版本或chrome浏览器。请到指定网站去下载相关版本。"); 
			//然后跳到需要连接的下载网站 
			window.location.href="module/plugins/browserUpdate/cn.html"; 
		} 
	//} 
})();
