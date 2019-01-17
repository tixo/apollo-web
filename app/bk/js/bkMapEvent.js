/**
 * 地图功能入口
 */
define(function(require, exports, module) {
    var mapInit = require("../../../supermap/map_init.js");
    var selectFeature = require("../../../supermap/plugins/selectFeature.js");
    var historyTrack = require("../../../supermap/plugins/historyTrack.js");
    var ajax= require("../../../scheduling/app/common/ajax.js");
    var gjFeatureList = {},peopleId,entities = {};
        
    //ajax请求布控方案坐标数据
    function queryGuiJi(id,startTime,endTime) {
        peopleId = id;
        ajax.post('api/surveillance/findCamera', { "id": peopleId, "startTime":startTime,"endTime":endTime}, function(response) {
            parent.parent.ui.closeLoading();
            successGuiJi(response.data.data);
        });
    }
    //  ajax  布控数据处理轨迹绘制
    function successGuiJi(datas) {
    	if(datas!=null){
    		var features = mapInit.pluginsAPI.jwdsj_bkgj.createPath(mapInit.mapContent.vectorLayer, datas);
	        var ss= null;
	        var lines3D = [];
	        $.each(datas, function(i, item) {
	        	lines3D.push(item.X*1);
			    lines3D.push(item.Y*1);
			    lines3D.push(490+item.Y*1);
	            var date = item.captureTime;
	            var dateH = Number(date.substring(11, 13));
	            var dateM = date.substring(14, 16);
	            var hm = (dateM) / 60;
	            var left = (((dateH + hm) / 24) * 100);
	            ss =item
	            var wz = '<div class="dytb" id="' + item.id + '" data-item=\''+JSON.stringify(item)+'\' onclick="mbk.bkMapEvent.openPointPopup(this)" style=" left:' + left + '%;"><div><img src="img/camera.png" /></div></div>'
	            $("#zhuWz").append(wz);   
	            $("#" + dateH).append('<span style="display: none;">' + item.tiem + '@' + '@' + item.id + '</span>'); 
	            item.id = peopleId+i;
	            if(i==0){
	            	item.img = "stPoint.png";
	            }else if(i==datas.length-1){
	            	item.img = "edPoint.png";
	            }else{
	            	item.img = "map-video.png";
	            }
                _rightResource.add3DMarker(item,"map-video.png","policeCarPopup_camera");
	        });
	        var mScene = window.mbk.bkSceneEvent.supermap3DUtils.sceneUtil;
	        mScene.addEntityPolyline(lines3D,peopleId);
	        entities[peopleId] = datas.length;
	        gjFeatureList[peopleId] = features;
    	}
    }
	//摄像头气泡
    function openPointPopup(obj) {
    	var item = $(obj).data("item");
    	var dataStr1 = JSON.stringify(item.cameraDetail);
        item.dataStr = dataStr1;
        mbk.bkMapEvent.mapInit.pluginsAPI.popup.clearPopup();
        var contentHTML = template(
            "policeCarPopup_camera", {
                content: item
            }
        );
        var config = {
            x: item.X,
            y: item.Y,
            contentHTML: contentHTML,
            width: 332,
            height: 190,
            offsetX: 0,
            offsetY: -40,
            center: false
        };
        mbk.bkMapEvent.mapInit.pluginsAPI.popup.showPopup(config);
    }
    //  ajax  布控数据处理
    function removeGuiJi(peopleId) {
    	$("#zhuWz").empty();
        mapInit.pluginsAPI.jwdsj_bkgj.clearFeatures(gjFeatureList[peopleId]);
        var mScene = window.mbk.bkSceneEvent.supermap3DUtils.sceneUtil;
        var entNum = entities[peopleId];
        for(var i=0;i<entNum;i++){
        	mScene.clearEntityById(peopleId+i);
        }
        mScene.clearEntityById(peopleId);
        delete gjFeatureList[peopleId];
    }
	//************************
    function initSelectFeature() {
        var config = {
            map: mapInit.mapAPI.map, //地图类
            vectorLayer: mapInit.mapContent.vectorLayer, //创建选择要素控件所需的图层
            selectSuccess: selectSuccess, //选中要素事件回调
            unSelected: unSelected //取消或者未选中要素回调
        }
        selectFeature.initSelectFeature(config);
            //判断点击对象是否为线段
        function selectSuccess(vectorLayer) {
            if (vectorLayer.style.externalGraphic == "../../assets/img/main_html/marker/fangxiang.png") {

            } else {
                openInfoWin(vectorLayer);
            }
        }
        function unSelected() {
            mbk.bkMapEvent.mapInit.pluginsAPI.popup.clearPopup();
        }
    }
    //摄像头气泡
    function openInfoWin(vectorLayer) {   
        mbk.bkMapEvent.mapInit.pluginsAPI.popup.clearPopup();
        var item = vectorLayer.attributes;
    	var dataStr1 = JSON.stringify(item.cameraDetail);
        item.dataStr = dataStr1;
        var contentHTML = template(
            "policeCarPopup_camera", {
                content: item
            }
        );
        var config = {
            x: vectorLayer.geometry.x,
            y: vectorLayer.geometry.y,
            contentHTML: contentHTML,
            width: 332,
            height: 190,
            offsetX: 0,
            offsetY: -40,
            center: false
        };
        mbk.bkMapEvent.mapInit.pluginsAPI.popup.showPopup(config);
        $("#shipin_show").click(function() {
            $(".shipin-box").show();
        });
    }
	//获取轨迹坐标系
   /* function queryTime() {
        $.ajax({
            url: "js/time_Gj.json", //json文件位置
            type: "get", //请求方式为get
            dataType: "json",
//          data: {id:id,startDate:startDate,endDate:endDate},
            success: function(data) {
                successTime(data);
            },
            error: function() {
                alert('错啦！');
            }
        });
   }*/
    function queryTime(startTime,endTime) {
    	parent.parent.ui.openLoading();
        var pids = [];
        for (pid in gjFeatureList) {
            pids.push(pid);
        }
        for (var i = 0; i < pids.length; i++) {
            removeGuiJi(pids[i]);
            queryGuiJi(pids[i],startTime,endTime)
        }
    }
//	关闭时间轴对应展示
    function removeAllJFeature() {
        for (pid in gjFeatureList) {
            removeGuiJi(pid);
        }
    }
    //对外封装接口
    var bkMapEvent = {
        queryTime: queryTime,
        mapInit: mapInit,
        queryGuiJi: queryGuiJi,
        removeGuiJi: removeGuiJi,
        historyTrack: historyTrack,
        initSelectFeature: initSelectFeature,
        successGuiJi: successGuiJi,
        removeAllJFeature: removeAllJFeature,
        openPointPopup:openPointPopup
    };
    module.exports = bkMapEvent;
    window.bkMapEvent = bkMapEvent;
});
