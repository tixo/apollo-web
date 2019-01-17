//系统功能按钮配置
angular.module('MenusApp', []).controller('MenusListCtrl', function ($scope) {
	//默认加载系统第一个功能
	var menus = [];
	var screenValue = 1920;
	//根据屏幕分辨率加载按钮背景图标
	if (window.screen.width <= 1440) {
		screenValue = 1366;
	} else {
		screenValue = 1920;
	}
	for (var i = parent.window.services.menus.length - 1; i >= 0; i--) {
		var new_menu = parent.window.services.menus[i];
		new_menu.screenValue = screenValue;
		menus.push(new_menu);
	}
	$scope.menus = menus;
	for (var i = 0; i < $scope.menus.length; i++) {
		if ($scope.menus[i].show) {
			var loadHref = $scope.menus[i].href;
			var secondarymenu = $scope.menus[i].secondarymenu;
			var name = $scope.menus[i].name;
			setTimeout(function () {
				// 适配拆分后的系统菜单加载
				if (!$.isEmptyObject(secondarymenu)) {
					parent.window.services.new_menus = secondarymenu;
					parent.new_menus = secondarymenu;
					parent.ui.changeLeftIframe(loadHref);
				} else {
					$("#left_iframe", parent.document).attr("src", loadHref);
					if("驾驶舱"==name){
						//开启加载动画
	                	parent.ui.openLoading();
	                	$("#"+$scope.menus[5].id).css("background","url(./img/"+$scope.menus[5].name+$scope.menus[5].screenValue+"s.png) no-repeat center");
					}
				}
			}, 500);
		}
	}

	$(".main_top_right_middle").append("<div style='clear:both'></div>");
	//菜单按钮点击事件
	$scope.menuBtnClick = function (menu,obj) {
		var nameStr = "驾驶舱首页一标三实案件警情布控管理";
		for (var i = 0; i < $scope.menus.length; i++) {
			if ($scope.menus[i].name == menu.name) {
				$scope.menus[i].show = true;
				if(nameStr.indexOf(menu.name)!=-1){
			    　　     parent.ui.openLoading();
			　　 }
				//当前父级菜单的子菜单
				if (menu.secondarymenu != undefined) {
					parent.window.services.new_menus = menu.secondarymenu;
					parent.new_menus = menu.secondarymenu;
				}
				parent.ui.changeLeftIframe(menu.href);
				$("#"+menu.id).css("background","url(./img/"+menu.name+menu.screenValue+"s.png)  no-repeat center");
			} else {
				$scope.menus[i].show = false;
				$("#"+$scope.menus[i].id).css("background","url(./img/"+$scope.menus[i].name+$scope.menus[i].screenValue+".png) no-repeat center");
			}
		}
		parent.window.scope = $scope;
	}
});
function showTime(){
	var now=new Date();
	var year=now.getFullYear();
	var month=now.getMonth()+1;
	var day=now.getDate();
	var week= " 星期"+"日一二三四五六".charAt(new Date().getDay());
	$("#date").html(year+"年"+month+"月"+day+"日"+" "+week);
}
