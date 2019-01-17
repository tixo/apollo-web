define(function(require, exports, module) {
    var ajjqMapEvent = require('ajjqMapEvent.js');
    //加载场景模块
    var ajjqSceneEvent = require('ajjqSceneEvent.js');
    var ajax = require('../../../scheduling/app/common/ajax.js');
    var queryUtil = ajjqSceneEvent.supermap3DUtils.query3DUtil;
    var mVectorLayer = ajjqMapEvent.mapInit.mapContent.vectorLayer;
    var mScene = ajjqSceneEvent.supermap3DUtils.sceneUtil;
    var timeLine = require('../../../config/common/timeLine.js');
    var utils = require('../../../config/common/utils.js');
    var mapTools = require('../../../config/common/mapTools/js/map_tools.js');
    var mapCut = require('../../../config/common/mapCut/js/map_cut.js');
    var rightResource = require('../../../config/common/rightResource/js/right_resource.js');
    var mapAddressSearch = require('../../../config/common/mapSearch/js/mapAddressSearch.js');
    var drawPolygon1 = ajjqMapEvent.mapInit.mapAPI.drawPolygon1;
    var _caseTuli = $("#tuli").html();
    var _markerIdArray = [];
    function initUi() { 
        mapTools.initMapTools(ajjqMapEvent, ajjqSceneEvent);
        mapCut.initMapCut();
        rightResource.initRightResource(ajjqMapEvent, ajjqSceneEvent, mapCut, mapTools);
        mapAddressSearch.initMapAddressSearch(ajjqMapEvent.mapInit.mapAPI.map,ajax,mVectorLayer,mapCut,mScene);
     /*  //注册右侧资源3维点击弹出气泡
        rightResource.sceneEvent.supermap3DUtils.sceneUtil.selectEntityListener(rightResource.open3DPopupWin);*/
        drawPolygon1.events.on({
            "featureadded": drawCompleted
        });
        $("#tbody").mCustomScrollbar();
        //今日、历史案件切换
        $('.tab_nav .tab').click(function() {
            var id = $(this).attr("data-id");
            $(this).addClass('select').siblings().removeClass('select');
            if(id == "s_jraj" || id == "s_lsaj") {
                $(".aj-manage-ctn").hide();
                $("#myFrameId", "#page-wrapper").show();
            } else {
                $(".aj-manage-ctn").show();
                $("#myFrameId", "#page-wrapper").hide();
            }
            removeCaseMarker(_markerIdArray);
            clearZhoubian();
            _markerIdArray = [];
            $("#zhuWz").html('<div class="modal-time" id="now"><div class="modal-time-an"></div></div>');
            timeLine.dynamicTimeline();
            ajjqMapEvent.mapInit.pluginsAPI.popup.clearPopup();
        });

        $(".modal-title").click(function() {
            $(".modal").hide();
        });
        $(".modal-fangda-clear").click(function() {
            $(".modal-fangda").hide();
        });
        ajax.get('/api/home/findCamera', {}, function(response) {
            videoList(response.data.data);
        });
        $(".modal-fangda-clear").click(function(){
        	$(".modal-fangda").hide();
        });
    }
	//案件marker数组   为移除maker
    function markerIdArray(markerIdArray) {
        _markerIdArray.push(markerIdArray);
    }
    //案件详情
    function ajDetails(id, obj) {
        buttonCut(obj);
        //案件详情
        ajax.post("/api/case/findCaseDetail/" + id, {}, function(response) {
            var obj = response.data.data;
            obj.popupId = "xqPopup";
            openCaseaDetails(obj);
        });
    }
    //构造案件详情
    function openCaseaDetails(obj) {
    	obj.dataAttr = JSON.stringify(obj);
        var contentHTML = template(obj.popupId, {
            content: obj
        });
        $(".popup02-right-box").html(contentHTML);
        $("#caseDetailsTable").mCustomScrollbar();
        $(".popup02-right-box").show();
        if($(".z-card").html() != "三维") {
            ajjqMapEvent.mapInit.pluginsAPI.popup.changePosition();
        }
    }
    //案件详情方大
    function max(obj) {
        if($("#fada-data-ctn").mCustomScrollbar().length > 0) {
            $("#fada-data-ctn").mCustomScrollbar("destroy");
            $("#fada-data-ctn").empty();
        }
        var caseDetailsTableHtml = $(".tab-detail").html();
        caseDetailsTableHtml = '<table class="tab-detail" >' + caseDetailsTableHtml + '</table>';
        $("#fada-data-ctn").html(caseDetailsTableHtml);
        $("#fada-data-ctn").mCustomScrollbar();
        $(".modal-fangda").show();
    }
    var pointTemp = {};
    //周边搜索
    function ajRound(obj) {
    	clearZhoubian();
        buttonCut(obj);
        var caseObj = {};
        caseObj.X = $(obj).data("x");
        caseObj.Y = $(obj).data("y");
        caseObj.popupId = "zhoubianPopup";
        openCaseaDetails(caseObj);
        $("#r").focus();
        //更改图例
        setZhoubianTL();
        //周边搜索查找资源
        $(".aj-erji-modal-search").click(function() {
            /*	$(".modal-backdrop-box2").hide();*/
            $(".mypopup").hide();
            $(".police-resource-list-box").show();
            $(".tab-police").html("<tr><th>设备ID</th><th>设备类型</th><th>设备位置</th></tr>");
            var zhoubianChecked = $(".aj-ctn-round").find('input[name="zhoubian"]:checked');
            var r = $("#r").val();
            if($.trim(r) == "") {
                return;
            }
            /*mapCut.cut2D();*/
            r = parseInt(r);
            var point = new SuperMap.Geometry.Point(caseObj.X, caseObj.Y);
            /* zhoubianPolygon(caseObj, point, r);
              if (zhoubianChecked.length != 0) {
                var typename = "";
                zhoubianChecked.each(function(i) {
                  var and = " or ";
                  if (i == 0) and = "";
                  typename += and + "name like '%" + this.dataset.typename + "%'"
                });
                selectedZBRec(typename, point, r);
              }*/
        });
        /*$("#r").click(function() {
        	 $(this).focus();
        });*/
    }
    //周边查询画园
    function zhoubianPolygon(zb, point, r) {
        var rDegree = (1 / queryUtil.mitersTodegree(point.getCentroid().y)) * r;
        var polygon = SuperMap.Geometry.Polygon.createRegularPolygon(point, rDegree, 50);
        var polygonFeature = new SuperMap.Feature.Vector(polygon, null, null);
        polygonFeatureArray.push(polygonFeature);
        mVectorLayer.addFeatures(polygonFeature);
    }
    //构造摄像头Geometry
 	var geometryPoint = [];
    function videoList(data) {
        $.each(data, function(i, item) {
            var geometry = new SuperMap.Geometry.Point(item.X, item.Y);
            geometry.obj = item;
            geometryPoint.push(geometry);
        });
    }
    //周边搜索激活画园
    function drawPolygon(obj) {
        mapCut.cut2D();
        ajjqMapEvent.mapInit.mapAPI.map.zoomTo(5);
        var lonlat = new SuperMap.LonLat(obj.dataset.x, obj.dataset.y);
        ajjqMapEvent.mapInit.mapAPI.map.setCenter(lonlat);
        //更改图例
        setZhoubianTL();
        ajjqSceneEvent.supermap3DUtils.popup3DUtil.closeAllPopup();
        //几何圆查询
        drawPolygon1.activate();
    }
	//画园回调  添加圆范围内的资源
    function drawCompleted(drawGeometryArgs) {
        clearZhoubian();
        drawPolygon1.deactivate();
        $(".police-resource-list-box").show();
        $(".tab-police").html("<tr><th>设备编号</th><th>设备位置</th></tr>");
        var zhoubianChecked = $(".aj-ctn-round").find('input[name="zhoubian"]:checked');
        var polygon = drawGeometryArgs.feature.geometry;
        polygonFeatureArray.push(drawGeometryArgs.feature);
        $.each(geometryPoint, function(i, obj) {
            if(polygon.intersects(obj)) {
                var item = obj.obj;
                var a=item;
                if(item.dataAttr!=undefined){
                	 delete item.dataAttr;//删除属性
                }
                item.dataAttr = JSON.stringify(a);
                policeZBResData.push(item);
                item.X = parseFloat(item.X);
                item.Y = parseFloat(item.Y);
                item.number = item.no
                item.img = "map-video.png";
                getPoliceResList(item, i);
                var popup = "videoPopup";
                var res = "treeVideo";
                item.zhoubian = 1;
                if(!ajjqMapEvent.isExist(item.id)) {
	                //2维增加标记点 并增加单击事件气泡窗口
	                rightResource.addMarkerClick(res, item);
	                //3维增加标记点 并增加气泡窗口
	                rightResource.add3DMarker(item, item.img, popup);
                }else{
                	$('#zhoubian' + item.id ).bind('click', function() {
						 var current = $(".z-card").html();
			    		if ("三维" == current) {
							var cameraConfig = {
					            x: item.X * 1,
					            y: item.Y * 1,
					            height: item.Y * 1 + 900,
					            heading: 0.0002141084319855795,
					            pitch: -1.5707953113269526,
					            roll: 0,
					            type: "flyto"
					        }
					        mScene.resetCenter(cameraConfig);
			    			rightResource.open3DPopupWin(mScene.getEntityById(item.id));
			    		}else{
			    			openInfoWin();
			    		}
			    		//单击事件回调函数
						function openInfoWin() {
							ajjqMapEvent.mapInit.mapAPI.map.setCenter(new SuperMap.LonLat(item.X, item.Y));
						    var contentHTML = template(item.popupId, { content: item });
					        var config = { x: item.X, y: item.Y, contentHTML: contentHTML, width: 302, offsetX: 0, offsetY: -40, center: false };
					        mapPopup.showPopup(config);
					        //mapPopup.changePosition();
						}
			        });										
                }
            }
        });
    }
    //设置图例显示
    function setZhoubianTL() {
        var tuliHtml = "";
        var zhoubianTL = {
            "派出所": "map-pcs.png",
            /* "岗亭": "map-gt.png",*/
            "摄像头": "map-dzjc.png"
        };
        $.each(zhoubianTL, function(key, value) {
            tuliHtml += '<li>';
            tuliHtml += '<span>';
            tuliHtml += '<img src="' + services.frontHttpUrl + 'config/common/rightResource/img/' + value + '" style="width:16px;">';
            tuliHtml += '</span>';
            tuliHtml += '<span>' + key + '</span>';
            tuliHtml += '</li>';
        });
        $("#tuli").html(tuliHtml);
    }
    var policeZBResData = []; //警用资源添加时存数据   来删除标记点
    var polygonFeatureArray = [];
    /**
     * 周边资源警用资源勾选资源加载数据函数  v
     * @param type 警用资源类型
     * @param mapImg 地图显示图标名称
     */
    function selectedZBRec(type, point, r) {
        var config = {
            r: r,
            url: services.queryUrl,
            sql: type,
            dataSets: ["HTC02:警用资源"],
            geometry: point,
            callback: onQueryZBRec
        };
        queryUtil.getBufferBydata(config);
        //查询成功返回结果函数
        function onQueryZBRec(queryEventArgs) {
            var selectedFeatures = queryEventArgs.result.features;
            $.extend(policeZBResData, selectedFeatures);
            var imgPath = services.frontHttpUrl + 'config/common/rightResource/img/';
            $.each(selectedFeatures, function(i, item) {
                item = item.attributes;
                var mapImg = getMapImg(item.NAME);
                item.X = parseFloat(item.SMX);
                item.Y = parseFloat(item.SMY);
                item.id = item.ID;
                item.img = "map-" + mapImg;
                getPoliceResList(item, i);
                if(!ajjqMapEvent.isExist(item.id)) {
                    var popup = "policeResPopup";
                    var res = "policeResources";
                    if((item.NAME).indexOf("电子警察") != -1) {
                        popup = "videoPopup";
                        res = "treeVideo";
                        item.type = item.NAME;
                        item.address = item.ADDRESS;
                        item.zhoubian = 1;
                    }
                    //2维增加标记点 并增加单击事件气泡窗口
                    rightResource.addMarkerClick(res, item);
                    //3维增加标记点 并增加气泡窗口
                    rightResource.add3DMarker(item, "map-" + mapImg, popup);
                }
            });
        }
    }
    //根据不同类型输出对应图标
    function getMapImg(type) {
        var img = "";
        var iconImg = {
            "电子警察": "dzjc.png",
            "派出所": "pcs.png",
            "岗亭": "gt.png",
            "电子诱导屏": "dzydp.png",
            "区域控制站": "qykzz.png",
            "信号灯": "xhd.png",
            "信号机": "xhj.png",
            "电子围栏": "dzwl.png"
        };
        $.each(iconImg, function(i, item) {
            if(type.indexOf(i) != -1) {
                img = item;
                return;
            }
        });
        return img;
    }
    //周边搜索列表
    function getPoliceResList(item, i) {
        var backgroundColor = "";
        var cells = '';
        if(i % 2 == 0) backgroundColor = "background-color: #f2f2f2";
        cells += "<tr style='" + backgroundColor + "'id='zhoubian" + item.id + "'>";
        /* cells += "<td>" + item.id + "</td>";*/
        cells += "<td>" + item.no + "</td>";
        cells += "<td>" + item.address + "</td>";
        cells += '</tr>';
        $(".tab-police").append(cells);
        $("#map_cut").css("bottom", "48px");
    }
    //清除周边搜索
    function clearZhoubian() {
        mVectorLayer.removeFeatures(polygonFeatureArray);
        $.each(policeZBResData, function(i, item) {
            var id = item.id;
            if(ajjqMapEvent.isExist(id)) {
            	var zTree = $.fn.zTree.getZTreeObj("treeVideo");
                var nodes = zTree.getCheckedNodes();
                if(nodes.length==0){
                	ajjqMapEvent.removeMarker(id);
               		ajjqSceneEvent.remove3DCaseEntity(id);
                }else{
                	var del = true;
                	$.each(nodes,function(i,node){
	                	if(node.icon!=undefined){
	                		if(node.attr==id){
	                			del=false;
	                			return true;
	                		}
	                	}
	                });
	                if(del){
	                	ajjqMapEvent.removeMarker(id);
	               		ajjqSceneEvent.remove3DCaseEntity(id);
	                }
                }
            }
        });
        $("#tuli").html(_caseTuli);
        $(".police-resource-list-box").hide();
        policeZBResData=[];
    }
    // 关闭周边搜索
    function closeZhoubian() {
        $(".mypopup").width("302px");
        $(".popup02-right-box").hide();
        clearZhoubian();
        ajjqSceneEvent.supermap3DUtils.popup3DUtil.closeAllPopup();
        if($(".z-card").html() != "三维") {
            ajjqMapEvent.mapInit.pluginsAPI.popup.changePosition();
        }
    }
	//关闭案件气泡
    function closeCase() {
        $("#myFrameId").contents().find(".jin-list").removeClass('list-selected');
        ajjqMapEvent.mapInit.pluginsAPI.popup.clearPopup();
        clearZhoubian();
    }
    //设备列表单击查看详情
    function policeResDetails(obj) {
        $(obj).addClass("bg-col");
        $(obj).siblings().removeClass("bg-col");
    }
    //切换气泡窗口 按钮选中状态更改
    function buttonCut(obj) {
        $(obj).addClass("modal-ctn-btn-col").siblings().removeClass("modal-ctn-btn-col");
    }
    //添加标记
    function addCaseMarker(obj) {
        var imgPath = "../../app/anjianjingqing/";
        obj.img = imgPath + obj.img;
        if(utils.Object.notNull(obj.X) && utils.Object.notNull(obj.Y)) {
            obj.X = utils.lonlat(obj.X);
            obj.Y = utils.lonlat(obj.Y);
            ajjqMapEvent.addCaseMarker(obj);
            //3维增加标记点 并增加气泡窗口
            ajjqSceneEvent.add3DCaseMarker(obj);
        }
    }
    //删除标记
    function removeCaseMarker(idArry) {
        $.each(idArry, function(i, id) {
            if(ajjqMapEvent.isExist(id)) {
                ajjqMapEvent.removeMarker(id);
                ajjqSceneEvent.remove3DCaseEntity(id);
            }
        });
    }
    //实时最新消息回调函数
    function websocketHandle(message) {
        if(!$.isEmptyObject(message.detail)) {
            var detail = JSON.parse(message.detail);
            var contentHTML = template("latestCasePopup", {
                content: detail
            });
            $("#latestCase").html(contentHTML);
            $("#latestCase").show();
            $("#closebktable").click(function() {
                $("#latestCase").hide();
            });
        }
    }
    /**
     * 时间轴
     */
    function sametimeCaseTimeLine(item) {
        var date = item.time;
        var dateH = Number(date.substring(11, 13));
        var dateM = date.substring(14, 16);
        var state = item.state;
        var hm = (dateM) / 60;
        var left = (((dateH + hm) / 24) * 100);
        //未读
        var wz = '<div class=\"dytb\" id=   \"' + item.id + '\" style=\" left:' + left + '%;\"><div><img src=\"' + item.img + '\"/></div></div>'; 
        $("#zhuWz").append(wz);   
    }
    //根据当前显示状态 弹出气泡
    function getPopup(item) {
        var current = $(".z-card").html();
        listSelected(item.id);
        if("三维" == current) {
            ajjqSceneEvent.open3DPopupCase(item);
        } else {
        	var marker={lonlat:{lon:item.X,lat:item.Y}};
    	    if(!utils.caseAdressIsExist(marker)){
				return;
			}
            ajjqMapEvent.openCaseWin(item);
        }
    }
    //选中变色
    function listSelected(id) {
        $("#myFrameId").contents().find("#case" + id).addClass('list-selected').siblings().removeClass('list-selected');
    }

    function initTime() {
        //定义locale汉化插件
        var locale = {
            "format": 'YYYY-MM-DD',
            "separator": " -222 ",
            "applyLabel": "确定",
            "cancelLabel": "取消",
            "fromLabel": "起始时间",
            "toLabel": "结束时间'",
            "customRangeLabel": "自定义",
            "weekLabel": "W",
            "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
            "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            "firstDay": 1
        };
        //初始化显示当前时间
        //$("#myFrameId").contents().find('#daterange-btn span').html(moment().subtract('hours', 1).format('YYYY-MM-DD') + ' 至  ' + moment().format('YYYY-MM-DD'));
        //日期控件初始化
        $("#myFrameId").contents().find('#daterange-btn').daterangepicker({
                'locale': locale,
                //汉化按钮部分
                ranges: {
                    '今日': [moment(), moment()],
                    '昨日': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '最近7日': [moment().subtract(6, 'days'), moment()],
                    '最近30日': [moment().subtract(29, 'days'), moment()],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                    '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                startDate: moment().subtract(29, 'days'),
                endDate: moment()
            },
            function(start, end) {
                $("#myFrameId")[0].contentWindow.searchParam(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            }
        );
    }

    //给外部提供接口
    var ajjq = {
        initUi: initUi,
        ajjqSceneEvent: ajjqSceneEvent,
        ajjqMapEvent: ajjqMapEvent,
        initTime: initTime,
        ajDetails: ajDetails,
        ajRound: ajRound,
        drawPolygon: drawPolygon,
        addCaseMarker: addCaseMarker,
        getPopup: getPopup,
        markerIdArray: markerIdArray,
        removeCaseMarker: removeCaseMarker,
        sametimeCaseTimeLine: sametimeCaseTimeLine,
        timeLine: timeLine,
        closeZhoubian: closeZhoubian,
        max: max,
        listSelected: listSelected,
        closeCase: closeCase,
        utils: utils,
        rightResource: rightResource,
        websocketHandle:websocketHandle,
        mapAddressSearch:mapAddressSearch
    };
    module.exports = ajjq;
});