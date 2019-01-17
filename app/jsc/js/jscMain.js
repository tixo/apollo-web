/**
 * 主要功能入口
 */

define(function(require, exports, module) {
	var jscMapEvent = require('jscMapEvent.js');
    var jsclzy = require('lzy-echarts.js');
    var ajax = require("../../../scheduling/app/common/ajax.js");
    var utils = require('../../../config/common/utils.js');
	$(document).ready(function(){
		document.onreadystatechange = utils.subSomething;//当页面加载状态改变的时候执行这个方法. 
		//加载滚动条  滚动条加载顺序请勿改动   动态加载数据时使用id
	    $("#surveillance").mCustomScrollbar();
	    $("#scrollbar2").mCustomScrollbar();
	    findSurveillanceInfo();
		//警用资源
	    ajax.post('/api/dashboard/findPoliceResource', {}, function(response) {
	        generalPoliceResources(response.data.data);
	    });
	    findGeneralWarning();
	});
	//布控任务
	function findSurveillanceInfo(){
	    ajax.post('/api/dashboard/findSurveillanceInfo', {"rows":8,"year":2018}, function(response) {
	        generalDispatched(response.data.data);
	    }); 
	}
	//最新报警信息
	function findGeneralWarning(){
	    ajax.post('/api/dashboard/findGeneralWarning',{"rows":5,"year":2018}, function(response) {
	        generalWarningMessage(response.data.data);
	    }); 
	}
//布控任务
    function  generalDispatched(data){
        $("#bkTotal").html(data.totol);
        var bkStr="";
        $.each(data.list, function (i, item) {
            bkStr+="<p style='padding: 0 8px;'>";
            bkStr+="<span>"+(i+1)+"</span>";
            bkStr+="<span>"+item.name+"</span>，布控对象";
            bkStr+="<span>"+item.total+"</span>个";
           /* bkStr+="，布控时间<span>"+item.time+"天</span>";*/
            bkStr+="</p>";
        });
        $("#mCSB_1_container").html(bkStr);
    };

//警用资源
    function  generalPoliceResources(data){
        //警察
        var jc_total=data.totalPolice;
        var jc_zx=data.totalOnlinePolice;
        $("#jc_total").html(jc_total+"人");//警察总数
        $("#jc_zx").html(jc_zx);//在线警察总数
        $("#zx1").css("width",((jc_zx/jc_total)*100)+"%");
        //警车
        var jch_total=data.totalCar;
        var jch_zx=data.totalOnlineCar;
        $("#zx2").css("width",((jch_zx/jch_total)*100)+"%");
        $("#jch_total").html(jch_total+"辆");//警车总数
        $("#jch_zx").html(jch_zx);//在线警车总数
        //摄像头
        var sxt_total=data.totalCamera;
        var sxt_zx=data.totalOnlineCamera;
        parent.window.sxt_total = sxt_total;
        onlineCameraTotal();
        $("#sxt_total").html(sxt_total+"个");//摄像头总数
    }
    
    function onlineCameraTotal(){
    	parent.window.isBroken = 0;
    	parent.window.authorizationCameraList(parent.window.cameraUrl1);
    	parent.window.authorizationCameraList(parent.window.cameraUrl2);
    	parent.window.authorizationCameraList(parent.window.cameraUrl3);
    	parent.window.authorizationCameraList(parent.window.cameraUrl4);
    }

//最新报警信息
    function  generalWarningMessage(data){
        var bkStr="";
        $.each(data, function (i, item) {
            bkStr+="<p style='padding: 0 10px'>";
            bkStr+="<span>"+(i+1)+"</span>";
            item.time = item.time.substring(0,16);
            bkStr+="<span>"+item.time+"</span>";
            bkStr+=" 在 <span>"+item.place.substring(9,item.place.length)+"</span>";
            bkStr+=" 发生 <span>"+item.type+"</span>";
            bkStr+="</p>";
        });
        $("#mCSB_2_container").html(bkStr);
    }
    //刷新数据
    function websocketHandle(message){
	  	if(message.type=="case"){
	  		findGeneralWarning();
	  	}else{
	  		findSurveillanceInfo();
	  	}
    }
	var jsc = {
	    ajax:ajax,
	    utils:utils,
	    websocketHandle:websocketHandle
	};
    module.exports = jsc;
});
