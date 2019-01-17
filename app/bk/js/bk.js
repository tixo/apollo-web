define(function(require, exports, module) {
	//加载地图模块
	var bkMapEvent = require('bkMapEvent.js');
	//加载场景模块
	var bkSceneEvent = require('bkSceneEvent.js');
	//加载标绘图库
	var symbolLib = require('symbol_lib.js');
	//地图工具栏
	var mapTools = require('../../../config/common/mapTools/js/map_tools.js');
	var mapCut = require('../../../config/common/mapCut/js/map_cut.js');
	var rightResource = require('../../../config/common/rightResource/js/right_resource.js');
	var timeLine = require('../../../config/common/timeLine.js');
	var ajax = require('../../../scheduling/app/common/ajax.js');
	function initUi(){
		//初始化地图工具栏
		mapTools.initMapTools(bkMapEvent,bkSceneEvent);
		mapCut.initMapCut();
		rightResource.initRightResource(bkMapEvent,bkSceneEvent,mapCut,mapTools);
		/*var li = timeLine.initTimelineMouth();
        $(".shuxian").html(li[0]);
        $(".shuxian >li").css("width","6.5%");
        $("#timelineAdd").html(li[1]);
        $("#timelineAdd >li").css("width","6.5%");*/
       /* var li = timeLine.initTimelineMouth();
        * $(".shuxian").html(li[0]);
        $(".shuxian >li").css("width","6.4%");
        $("#timelineAdd").html(li[1]);
        $("#timelineAdd >li").css("width","6.4%");*/
       /* $("#timelineAdd").html(timeLine.initTimeline());*/
      initTimeline();
		//***************左边布控切换******************
		$('.tab_nav .tab').click(function() {
			bkMapEvent.removeAllJFeature();
			symbolLib.PlottingClear();
			$("#clearSymbolDiv").hide();
	        var id = $(this).attr("data-id");
	        $(this).addClass('select').siblings().removeClass('select');
	        if(id == "s_bkya" || id == "s_bkzz"){
	        	$(".aj-manage-ctn").hide();
		        $("#myFrameId","#page-wrapper").show();
	        }else{
	        	$(".aj-manage-ctn").show();
		        $("#myFrameId","#page-wrapper").hide();
	        }
	    });

	    /*********点击选择时间**********/
	   $(".time-btn").click(function(){
	   		var maxDate = $(".right-btn-active", window.frames["myFrameName"].document).attr("data-endtime");
	   		var minData = $(".right-btn-active", window.frames["myFrameName"].document).attr("data-starttime");
	   		$("#datetimepickerStart-bk1").val(minData);
	   		$("#datetimepickerStart-bk2").val(maxDate);
	   		$("#startTime",window.parent.document).html(minData);
	        $("#endTime",window.parent.document).html(maxDate);
	   		$('#datetimepickerStart-bk1').datetimepicker({
				format:"Y-m-d H:i:s",
				lang:"ch",  //语言选择中文 注：旧版本 新版方法：$.datetimepicker.setLocale('ch');
				/*maxDate:maxDate.substr(0,maxDate.indexOf(" ")),     //设置最大年份
				minDate:minData.substr(0,maxDate.indexOf(" ")),      //设置最小年份*/
				allowInput:"false",
			});
			$('#datetimepickerStart-bk2').datetimepicker({
				format:"Y-m-d H:i:s",
				lang:"ch",  //语言选择中文 注：旧版本 新版方法：$.datetimepicker.setLocale('ch');
				/*maxDate:maxDate.substr(0,maxDate.indexOf(" ")),     //设置最大年份
				minDate:minData.substr(0,maxDate.indexOf(" ")),      //设置最小年份*/
				allowInput:"false",
			});
	   		$(".time-modal").show();
	   });
	   $(".time-clear").click(function(){
	   		$(".time-modal").hide();
	   });
	   $(".time-tj-btn").click(function(){
	   		var time_qi = $("#datetimepickerStart-bk1").val();
	   		var time_zhi = $("#datetimepickerStart-bk2").val();
	   		$(".qi").empty();
	   		$(".zhi").empty();
	   		$(".qi").append(time_qi);
	   		$(".zhi").append(time_zhi);
	   		$(".time-modal").hide();
	   		bkMapEvent.queryTime(time_qi,time_zhi);
	   });
        $("#plantempCategory").change(function(){
			var  categoryName= $(this).find("option:selected").text();
			symbolLib.findTemplatePlans(categoryName);
		});
		 //更新预案分组
	    $("#updateBtn").click(function() {
	    	var groupObj = { "categoryId": $("#planCategory").val(), "categoryName": $("#planCategory").find("option:selected").text(), "description": $("#description").val(), "planGroupName": $("#planGroupName").val() };
	        	groupObj.id = $("#fenzu-modal").data("id");
	            ajax.post('/api/group/update', groupObj, function(response) {
	               // planInfo();
	            });
	        $("#fenzu-modal").hide();
	    });
	    //添加预案分组
	    $("#saveBtn").click(function() {
	    	var groupObj = { "categoryId": $("#planCategory").val(), "categoryName": $("#planCategory").find("option:selected").text(), "description": $("#description").val(), "planGroupName": $("#planGroupName").val() };
	        ajax.post('/api/group/save', groupObj, function(response) {
	           // planInfo();
	        });
	        $("#fenzu-modal").hide();
	    });
	}
	 /**
     * 初始化时间轴
     */
    function initTimeline() {
        var array = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
        var liHtml = "<span class=\"lft\"></span>";
        $.each(array, function(i, h) {
            if (h == "23") {
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span>';
            } else if (h == "24") {
                liHtml += '<span>' + h + '</span></li>';
            } else {
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span></li>';
            }
        });
        dynamicTimeline();
        $("#timelineAdd").html(liHtml);
    }
     /**
     * 时间轴进度条 时间设置为一分钟
     */
    function dynamicTimeline() {
        var date = new Date();
        var hour = date.getHours();
        var min = (date.getMinutes()) / 60;
        var now = 100 - (((hour + min) / 24) * 100);
        $("#now").css("width", now + "%");
        setTimeout(dynamicTimeline, 60000);
    }
    //推演图片打印
    function doPrint(){
    	var imgHtml = $("#planImgPrint").find("img")[0].outerHTML;
    	 $('#printIframe')[0].contentWindow.iframePrint(imgHtml);
    }
    //websocket回调函数
    function websocketHandle(message){
    	if(!$.isEmptyObject(message.detail)){
	  		var detail = JSON.parse(message.detail);
	  		var time = JSON.parse(message.generationTime);
	  		detail.BeginTime = time.BeginTime.substring(0,10);
	  		detail.EndTime = time.EndTime.substring(0,10);
		  	var contentHTML = template("latestBkPopup", {
			      content: detail
			  });
		  	$("#latestBk").html(contentHTML);
		  	$("#latestBk").show();
		  	$("#closebktable").click(function() {
				$("#latestBk").hide();
			});
	  	}
    }
	//给外部提供接口
	var bk={
		initUi:initUi,
		bkSceneEvent:bkSceneEvent,
		bkMapEvent:bkMapEvent,
		symbolLib: symbolLib,
   		rightResource:rightResource,
   		mapCut:mapCut,
   		websocketHandle:websocketHandle,
   		doPrint:doPrint
	};
	module.exports=bk;
});
