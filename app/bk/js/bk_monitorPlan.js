var _ajax;
$(document).ready(function(){
	parent.seajs.use([parent.window.services.frontHttpUrl+"/scheduling/app/common/ajax.js"],function(ajax){
		_ajax = ajax;
		findAllSurveillance();
 	});
 	//切换更改地图切换位置  显示时间轴 时间段查询
 	$(window.parent.document).find("#map_cut").css("bottom", "48px");
	$(window.parent.document).find(".time-box").show();
  	$(window.parent.document).find(".time-xuanze").show();
});
//布控作战分页
function findAllSurveillance() {
	$(".bk-fa-box").mCustomScrollbar();
    $(".fenye-box").zPager({
        url: "/surveillance/info/findPage",
        btnShow: false,
        functionName: PeopleInformation,
        paramObject: {}
    });
}
//点击布控方案组展示查看方案	
function yincan(obj){ 
	//$(obj).parents(".bk-list-box").siblings().find(".right-btn").removeClass("right-btn-active");
	if(obj.className.indexOf("right-btn-active")>=0){
		$(obj).removeClass("right-btn-active");
	}else{
		$(obj).addClass("right-btn-active");
	}
	$(obj).parents(".bk-top").siblings().toggle();
	$("#startTime",window.parent.document).html($(obj).data("starttime"));
	$("#endTime",window.parent.document).html($(obj).data("endtime"));
}
//ajax获取布控作战内容拼接
function PeopleInformation(data){  
	$(".bk-fa-box").mCustomScrollbar("destroy");
	$(".bk-fa-box").html("");
	var bkStr="";
	$.each(data, function (i, item1) {
		bkStr+='<div class="bk-list-box">';
		bkStr+='<div class="bk-top">' ;  
		bkStr+='<span class="left-col"></span>' ; 
		bkStr+='<span class="center-title">' ; 
		bkStr+=item1.title ; 
		bkStr+='</span>' ; 
		var startTime = item1.beginTime.substring(0,10);
		var endTime = item1.endTime.substring(0,10);
		var none = "";
		if(i>0){
			bkStr+="<span class='right-btn' data-starttime='"+item1.beginTime+"' data-endtime='"+item1.endTime+"'  onclick='yincan(this)'></span>" ; 
			none = 'style="display: none;"';
		}else{
			bkStr+="<span class='right-btn right-btn-active' data-starttime='"+item1.beginTime+"' data-endtime='"+item1.endTime+"' id='openOne' onclick='yincan(this)'></span>" ; 
		}
		bkStr+='</div>' ; 
		bkStr+='<div id="yin" class="yin" '+none+'>' ;
		bkStr+='<div class="bk-list-ctn-top"  >' ;
		bkStr+='<div class="bk-list-ctn-top-name">布控时间：</div>' ; 
		bkStr+='<div class="bk-list-ctn-top-time">' ; 
		bkStr+='<p><span>起始：</span><span class="time1">' ; 
		bkStr+=startTime ; 
		bkStr+='</span></p><p><span>结束：</span><span class="time2">' ; 
		bkStr+=endTime ; 				
		bkStr+='</span></p>';
		bkStr+='</div>' ; 
		bkStr+='</div>' ; 
		bkStr+='<div class="bk-list-ctn">'
		$.each(item1.target, function (i, item) {
			bkStr+="<div class='bk-ren'id='"+item.id+"'><div class='ren-lft' style='margin: 6px;'>";
			bkStr+="<img src='"+item.targetFilePath+"'/></div>";
			bkStr+="<div class='ren-ctn'> ";
			/*bkStr+="<table class='ren-ctn-tab'><tr>";
			bkStr+="<td></td><td></td></tr>";
			bkStr+="<tr><td></td><td></td></tr>";
			bkStr+="<tr><td></td><td></td>";
			bkStr+="</tr></table>";*/
			bkStr+="</div><div class='ren-rit' data-starttime='"+item1.beginTime+"' data-endtime='"+item1.endTime+"' style='margin-top: 18px;margin-left: 120px;' title='查看布控被发现轨迹'><img src='img/eye-close.png'/>";
			bkStr+="</div></div>";
		});
		bkStr+='</div></div>' ; 
		bkStr+='</div>' ; 
	});
   	$(".bk-fa-box").append(bkStr);
	var $openOne = $("#openOne")[0];
	$("#startTime",window.parent.document).html($openOne.dataset.starttime);
	$("#endTime",window.parent.document).html($openOne.dataset.endtime);
	$(".bk-fa-box").mCustomScrollbar();
	//点击布控方案里的眼睛显示/隐藏
	$(".ren-rit").click(function(){  
		var peopleId = $(this).parents(".bk-ren").attr("id");
        if($(this).find('img').attr('src')=='img/eye-open.png'){ 
            $(this).find('img').attr('src','img/eye-close.png');
            parent.window.mbk.bkMapEvent.removeGuiJi(peopleId); //隐藏方案内容
			parent.window.mbk.bkMapEvent.mapInit.pluginsAPI.popup.clearPopup();
        }else{ 
        	parent.parent.ui.openLoading();
        	var startTime = this.dataset.starttime;
        	var endTime = this.dataset.endtime;
            $(this).find('img').attr('src','img/eye-open.png');
            parent.window.mbk.bkMapEvent.queryGuiJi(peopleId,startTime,endTime,parent.window.mbk); //显示方案内容
            parent.window._mapCut.cut2D();
        } 
	});
}