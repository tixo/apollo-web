define(function(require, exports, module) {
	var mapCut = {
		initMapCut:function(){
		    $('#tabs a').click(function(e) {
		        $('#tabs li').removeClass("current").removeClass("hoverItem");
		    });
			$('#tabs a').hover(function(){
		        if(!$(this).parent().hasClass("current")){
		           $(this).parent().addClass("hoverItem");
		        }
		    },function(){
		        $(this).parent().removeClass("hoverItem");
		    });
		    //点击地图展开闭合效果
		    $('ul.cards').on('click', function () {
		        $(this).toggleClass('transition');
		    });
		    //点击切换地图效果
		    $("ul.cards").click(function(){
				$(".card").each(function(){
					$(this).click(function(){
						cutStyle(this);
						var current = $(".z-card").html();
						if(current=="三维"){
							show3D();
						}else if(current=="影像"){
							showYingxiang();
						}else if(current=="地图"){
							show2D();							
						}
					});
				});
			});
		},
		//自动切换到3维
		cut3D:function(){
			var current = $(".z-card").html();
				if(current=="三维"){
					return;
				}else{
					cutStyle(".card-3");
					show3D();
				}
		},
		//自动切换到2维
		cut2D:function(){
			//判断是否在2维
			var current = $(".z-card").html();
				if(current=="影像"||current=="地图"){
					return;
				}else{
					cutStyle(".card-2");
					showYingxiang();
				}
		}
	};
	function cutStyle(doc){
		$(doc).addClass("map-top").siblings().removeClass("map-top");
		$(doc).children("span").addClass("z-card");
		$(doc).siblings().children("span").removeClass("z-card")
	}
	function show3D() {
		$("#map-tools3D").show();
		$("#map-tools").hide();
		$("#cesiumContainer").show();
		$("#map").hide();
	}
	function showYingxiang() {
		$("#map-tools3D").hide();
		$("#map-tools").show();
		$("#cesiumContainer").hide();
		$("#map").show();
		parent.window.mapUtil.mapAPI.changeBaseMap("yingxiang");
		parent.window.mapUtil.mapAPI.resize();
	}
	function show2D() {
		$("#map-tools3D").hide();
		$("#map-tools").show();
		$("#cesiumContainer").hide();
		$("#map").show();
		parent.window.mapUtil.mapAPI.changeBaseMap("map2D");
		parent.window.mapUtil.mapAPI.resize();
	}
    module.exports = mapCut;
});

