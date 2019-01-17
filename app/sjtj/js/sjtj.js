/**
 * 主要功能入口
 *
 *  当有布控对象识别出或者出现新案件时，地图左上角弹出弹框，显示报警信息，并以声音提示。
 *  案件类的显示报警时间、地点、类型；
 *  在报警出现时，地图上在布控摄像头报警或是再案发地点处高亮闪烁。
 *
 *  在三维场景添加以上操作
 */
define(function(require, exports, module) {
    var syMapEvent = require('sjtjMapEvent.js');
    //加载场景模块
    var sjtjSceneEvent = require('sjtjSceneEvent.js');
    var ajax = require("../../../scheduling/app/common/ajax.js");
    var JK = require('../../../config/common/utils.js');
    var mScene = sjtjSceneEvent.supermap3DUtils.sceneUtil;
    var mapPopup = syMapEvent.mapInit.pluginsAPI.popup;
    var scenePopup = sjtjSceneEvent.supermap3DUtils.popup3DUtil;
    var mVectorLayer = syMapEvent.mapInit.mapContent.vectorLayer;
    var map = syMapEvent.mapInit.mapAPI.map;
    var mapCut = require('../../../config/common/mapCut/js/map_cut.js');
    var mapTools = require('../../../config/common/mapTools/js/map_tools.js');
    var video = require('../../../config/common/rightResource/js/video.js');
    var rightResource = require('../../../config/common/rightResource/js/right_resource.js');
    var mapAddressSearch = require('../../../config/common/mapSearch/js/mapAddressSearch.js');
    
    var drawPolygon1 = syMapEvent.mapInit.mapAPI.drawPolygon1;
    var _bottom = "", _top = ""; //右侧资源切换全局变量
    var imgPath = services.frontHttpUrl+'config/common/rightResource/img/';
    var videoIds = [],carIds = [],policeIds = [],bjzIds=[];
    var makerSize = {"width":20,"height":29};
    var chkbox = {
            enable: true, 
            chkboxType:  { "Y": "", "N": "" },
            chkStyle: "radio",  //单选框
            radioType: "all"   //对所有节点设置单选
        };
    // zTree 参数配置，
    var setting = {
        check: {
            enable: true, 
            chkboxType:  { "Y": "", "N": "" },
            chkStyle: "radio",  //单选框
            radioType: "all"   //对所有节点设置单选
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: function(treeId, treeNodes) {
                //用于捕获 勾选 或 取消勾选 之前的事件回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选
            },
            onClick: function(event, treeId, treeNodes) {
                return true;
            },
            onCheck: onCheck,
            onExpand: function(event, treeId, treeNodes) {}
        }
    };
   function init() {
    	mapTools.initMapTools(syMapEvent, sjtjSceneEvent);
        mapCut.initMapCut();
        mapAddressSearch.initMapAddressSearch(map,ajax,mVectorLayer,mapCut,mScene);
        rightResource.initParam(syMapEvent, sjtjSceneEvent, mapCut, mapTools);
        rightResource.findInteresPoint();
        video.initVideo(sjtjSceneEvent, syMapEvent, mapCut);
        drawPolygon1.events.on({
            "featureadded": drawCompleted
        });
        plan();
        //右侧资源标签切换
        $(".police-select").each(function() {
            $(this).find(".titleName").click(function() {
                var select = $(this).parents('.police-select');
                if(select.hasClass("dest")) {
                    select.removeClass("dest").animate({ right: -180}, 500);
                    select.css({
                        "top": _top + "px",
                        "z-index": "9999"
                    });
                    //切换其它的
                } else if(select.siblings().hasClass("dest")) {
                    var top = parseInt(select.css("top").replace("px", ""));
                    $(".dest").css({
                        "top": _top + "px",
                        "z-index": "9999"
                    });
                    _top = top;
                    select.siblings().removeClass("dest").animate({right: -180}, 500);
                    select.addClass("dest").animate({right: 0}, 500);
                    _bottom = parseInt(select.css("bottom").replace("px", ""));
                    _top = parseInt(select.css("top").replace("px", ""));
                    if(_bottom < 50) {
                        select.css({
                            "top": (top + _bottom - 50) + "px",
                            "z-index": "8999"
                        });
                    }
                } else {
                    select.addClass("dest").animate({right: 0}, 500);
                    _bottom = parseInt(select.css("bottom").replace("px", ""));
                    _top = parseInt(select.css("top").replace("px", ""));
                    if(_bottom < 50) {
                        var top = parseInt(select.css("top").replace("px", ""));
                        select.css({
                            "top": (top + _bottom - 50) + "px",
                            "z-index": "8999"
                        });
                    }
                }
            });
            var axis = {axis:"yx",
					scrollButtons:{enable:true},
					theme:"3d"};
			$(".treeScrollbar").mCustomScrollbar(axis);
        });
        }
        $(function() {
            $("#level1 > a").click(function() {
                $("#level2").toggle(500, function() {});
            });
        });
		//webSocket推送回调函数
        function websocketHandle(message) {
        	if(!$.isEmptyObject(message.detail)){
		  		var detail = JSON.parse(message.detail);
		  		message.details = detail;
		  		message.messageId = message.id;
	        	var data = [message];
	        	  //清除
          		/*$("#bj").html('');*/
	            sametimeCase(data);
	            sametimeCaseTimeLine(data);
	            showWarning(data, "ee0", ".gif");
	            var X = JK.lonlat(detail.X);
                var Y = JK.lonlat(detail.Y);
                if(X!=null&&X!=undefined){
                	map.zoomTo(5);
                	map.setCenter(new SuperMap.LonLat(X,Y));
                }
           }
        }
        //警车详情
		function findCarDetail(obj){
			ajax.post("/api/right/findCarDetail/"+obj.id,{},function(response){
				var data = response.data.data;
				if(data!=null){
					data.name = obj.name;
					data.img = "map-police-car.png";
					data.zhoubian = true;
					data.popupId = "policeCarPopup";
					data.makerSize = makerSize;
					addMarker(data,"treePoliceCar");
					var geometry = new SuperMap.Geometry.Point(data.X, data.Y);
					data.no = data.name;
					data.address = data.seat.substring(9, data.seat.length);
                    geometry.obj = data;
                    geometryPoint[data.id] = geometry;
                    carIds.push(data);
				}
			},processFailed);
		}
		//警员详情
		function findPoliceDetail(obj){
			ajax.post("/api/right/findPoliceDetail/"+obj.detail.id,{},function(response){
				var data = response.data.data;
				if(data!=null&&data.X!=undefined){
					data.img = "map-police.png";
					if(obj.Status!=undefined){
						data.img = "police-watch.png";
					}
					data.makerSize = makerSize;
				    data.name = obj.name;
					data.zhoubian = true;
					data.popupId = "policePopup";
					addMarker(data,"treePolice");
					var geometry = new SuperMap.Geometry.Point(data.X, data.Y);
					data.no = data.number +" ("+ data.name+")";
					data.address = data.seat;
	                geometry.obj = data;
	                geometryPoint[data.id] = geometry;
	                policeIds.push(data);
			    }
	 		},processFailed);
		}
		
		function getChildren(treeId,treeNode,status) {
			if(!$.isEmptyObject(treeNode)){
				$.each(treeNode, function(i,item) {
					if(!item.isParent && item.icon!=undefined){
						if(status == 1){
							item.Status = 1;
						}
						findPoliceDetail(treeId,item);
					}else{
						getChildren(treeId,item.children);
					}
				});
			}	
		}
        var value = {
        	    //init所有视频信息
                initVideosMsg: function() {
                    ajax.get('/api/home/findCamera', {}, function(response) {
                    	var data = response.data.data;
                    	data.splice(1,1);//勿删
						data.splice(1,1);//勿删 删除ztree 派出所
                         $.each(data, function(i, item) {
		                    var type = item.cameraType;
					    	if(type.indexOf("球机")!=-1){
					    		item.img = "map-video1"+item.stage+".png";
					    	}else{
					    		if(item.stage==3 && type.indexOf("4G")!=-1){
					    			item.img ="map-4G.png"
					    		}else{
					    			item.img = "map-video2"+item.stage+".png";
					    		}
					    	}
					    	 if(item.dataAttr!=undefined){
				            	 delete item.dataAttr;//删除属性
				            }
		                    item.dataAttr = JSON.stringify(item);
		                    var geometry = new SuperMap.Geometry.Point(item.X, item.Y);
		                    item.popupId = "sxtPopup";
		                    geometry.obj = item;
		                    geometryPoint[item.id] = geometry;
		                }); 
                    },processFailed);
                },
                //加载所有视频信息
                getVideosMsg: function(state) {
                    ajax.get('/api/home/findCamera', {}, function(response) {
                    	var data = response.data.data;
                    	data.splice(1,1);//勿删
						data.splice(1,1);//勿删 删除ztree 派出所
                        videos.videoList(data);
                    },processFailed);
                },
                getCarsMsg: function() {
					ajax.post("/api/right/findCar",{},function(response){
						var data = response.data.data;
						var check = {
							enable: true, //显示复选框
							chkboxType: {"Y": "ps","N": "ps"}
						};
						setting.check = check;
						var zTree = $.fn.zTree.init($("#treePoliceCarHide"), setting,data);
						zTree.checkAllNodes(true);
						var nodes = zTree.getCheckedNodes();
						$.each(nodes, function(i,item) {
							if(item.icon!=undefined){
			                    findCarDetail(item);
							}
						});
			 		},processFailed);
                },
                getPoicesMsg: function() {
					ajax.post("force/info/findAll",{},function(response){
						var data = response.data.data;
				        $.each(data, function(i,item) {
				        	if(item.status != null && item.status == 1){
				        		//值班警员
				        		$.each(item.member, function(j,poice) {
				        			poice.Status = 1;
				        			findPoliceDetail(poice);
				        		});
				        	}else{
				        		$.each(item.member, function(j,poice) {
				        			findPoliceDetail(poice);
				        		});
				        	}
				        });
					},processFailed);
                },
                //加载时间轴报警信息
                getHistoricalMsg: function() {
                    ajax.post('/api/home/sametimeCaseTimeLine', {}, function(response) {
                        var data = response.data;
                        sametimeCaseTimeLine(data.data);
                        showWarning(data.data);
                    });
                },
                //获取实时报警信息
                getUnreadMsg: function() {
                    ajax.post('/api/home/sametimeCase', {"rows": 6,"status": 0}, function(response) {
                        var data = response.data.data;
                        if(!$.isEmptyObject(data)) {
                            sametimeCase(response.data.data);                             //展示地图闪烁点
            				/*showWarning(data, "ee0", ".gif");
                            voicePrompt();*/
                        }
                    });
                },
                getBjzMsg:function(){
                	ajax.post('/alarm/pillar/findAll', {}, function(response) {
                    	var data = response.data;
                    	$.each(data,function(i,pillarInfo){
							pillarInfo.img = "map-bjz.png";
							pillarInfo.makerSize = makerSize;
                    		var params = pillarInfo.params;
	                        var arry = params.split("|");
	                        pillarInfo.cameraIndex = arry[0];
	                        pillarInfo.stage = arry[1];
	                        pillarInfo.X = JK.lonlat(pillarInfo.mapDimension);
	                        pillarInfo.Y = JK.lonlat(pillarInfo.mapLongitude);
	                        var time = JK.RiQi(pillarInfo.createTime);
	                        pillarInfo.time = time;
	                        pillarInfo.cameraType = "球机";
	                        pillarInfo.type = "校园报警终端";
	                        pillarInfo.Ptype = "3";
	                        pillarInfo.popupId = "bjzRecPopup";
	                        pillarInfo.eID = pillarInfo.id;
	                        var dataStr1 = JSON.stringify(pillarInfo);
	            	        pillarInfo.dataStr = dataStr1;
	            	        addMarker(pillarInfo,"bjzRecPopup");
	            	        bjzIds.push(pillarInfo);
                    	});
                    },processFailed);
                }
            };
            //初始化时间轴
        initTimeline();
        //初始化right-box btn
        initRightbox();
    	setInterval(setIntervalRightbox, 60000);
        //历史左上角报警信息
        value.getUnreadMsg();
        //setInterval("getHistoricalMsg()", 60000);
        //显示在在最上图层
        setTimeout(function(){
        	//时间轴 
        	value.getHistoricalMsg();
        },1000);
        //激活画园
        function drawPolygon(obj) {
        	if($("#cesiumContainer").css("display") != 'none') {
        		mapCut.cut2D();
		        map.zoomTo(5);
		        var lonlat = new SuperMap.LonLat(obj.dataset.x, obj.dataset.y);
		        map.setCenter(lonlat);
        	}
        	scenePopup.closeAllPopup();
            drawPolygon1.activate();
        }
        var polygonFeatureArray = [],zhoubianArray=[];
        //画园回调
        function drawCompleted(drawGeometryArgs) {
            closeZhoubian();
            drawPolygon1.deactivate();
            $(".police-resource-list-box").show();
            $(".map-tab").css("right","275px");
            $(".tab-police").html("<tr><th>编号</th><th>位置</th></tr>");
            var zhoubianChecked = $(".aj-ctn-round").find('input[name="zhoubian"]:checked');
            var polygon = drawGeometryArgs.feature.geometry;
            polygonFeatureArray.push(drawGeometryArgs.feature);
            $.each(geometryPoint, function(i, item) {
                if(polygon.intersects(item)) {
                    item = item.obj;
                    getPoliceResList(item, i);
                    if(!syMapEvent.isExist(item.id)){
	                    if(JK.Object.notNull(item.X) &&JK.Object.notNull(item.Y)){
							item.X= JK.lonlat(item.X);
						    item.Y = JK.lonlat(item.Y);
							item.attr = item.id;
							//2维增加标记点 并增加气泡窗口
							addMarkerObj.addMarkerClick(item.popupId,item,item.popupId);
							//3维增加标记点 并增加气泡窗口
							addMarkerObj.add3DMarker(item,item.img,item.popupId);
							if(item.popupId=="sxtPopup"){
								zbVideoIds.push(item);
							}else if(item.popupId=="policeCarPopup"){
								zbCarIds.push(item);
							}else if(item.popupId=="policePopup"){
								zbPoliceIds.push(item);
							}
						}
                    }
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
			    			open3DPopupWin(mScene.getEntityById(item.id));
			    		}else{
			    			openInfoWin();
			    		}
			    		//单击事件回调函数
						function openInfoWin() {
							map.setCenter(new SuperMap.LonLat(item.X, item.Y));
						    var contentHTML = template(item.popupId, { content: item });
					        var config = { x: item.X, y: item.Y, contentHTML: contentHTML, width: 302, offsetX: 0, offsetY: -40, center: false };
					        mapPopup.showPopup(config);
					        mapPopup.changePosition();
						}
			        });
                }
            });
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
        }
        var zbVideoIds=[],zbPoliceIds=[],zbCarIds=[];
        // 关闭周边搜索
        function closeZhoubian() {
            mVectorLayer.removeFeatures(polygonFeatureArray);
            /*$("#tuli").html(_caseTuli);*/
            $(".police-resource-list-box").hide();
            $(".map-tab").css("right","10px");
            var rb = $('.box-ctn-box input[type=checkbox]');
            rb.each(function(i) {
                switch(i) {
                    case 0:
                        if(!this.checked) {
                            $.each(zbVideoIds, function(i, item) {
			                    syMapEvent.removeMarker(item.id);
			                    sjtjSceneEvent.removeEntity(item.id);
			                });
			                zbVideoIds=[];
                        }
                        break;
                    case 1:
                    	if(!this.checked) {
	                        $.each(zbPoliceIds, function(i, item) {
			                    syMapEvent.removeMarker(item.id);
			                    sjtjSceneEvent.removeEntity(item.id);
			                }); 
			                zbPoliceIds=[];
			            }
                        break; 
                    case 2:
                    	if(!this.checked) {
	                        $.each(zbCarIds, function(i, item) {
			                    syMapEvent.removeMarker(item.id);
			                    sjtjSceneEvent.removeEntity(item.id);
			                }); 
			                zbCarIds=[];
			            }
                        break;
                }
            });
        }
        /**
         * 解析当天历史数据到时间轴
         */
        function sametimeCaseTimeLine(data) {
            //var data = data.sametimeCase;
            $.each(data, function(i, item) {
            	if(item.type=="target"||item.type=="alarm_pillar"){
                	item.details.id=item.messageId;
                }
                var id = item.details.id;
                var status = item.status;
                switch(item.type) {
                    case 'case':
                        var item = item.details;
                        var time = item.time;
                        var timeH = Number(time.substring(11, 13));
                        var timeM = time.substring(14, 16);
                        var state = item.state;
                        var hm = (timeM) / 60;
                        var left = (((timeH + hm) / 24) * 100);
                        var wz = "";
                        //未读
                        if("0" == status) {
                            wz += '<div class=\"dytb\" data-type=\"aj\" id=\"' + id + '\"  style=\" left:' + left + '%;\"><div><img src=\"img/untreated.png\" /></div></div>'; 
                        } else if("1" == status) { //已读
                            wz += '<div class=\"dytb\" data-type=\"aj\" id=\"' + id + '\"  style=\" left:' + left + '%;\"><div><img src=\"img/finish.png\"/></div></div>'; 
                        }
                        $("#zhuWz").append(wz);   
                        $("#" + timeH).append('<span style=\"display: none;\">' + item.time + '@' + item.state + '@' + item.id + '</span>'); 
                        //caseDetails(this, item, id);
                        break;
                    case 'target':
                        var item = item.details;
                        var time = item.date;
                        var timeH = Number(time.substring(11, 13));
                        var timeM = time.substring(14, 16);
                        var state = item.state;
                        var hm = (timeM) / 60;
                        var left = (((timeH + hm) / 24) * 100);
                        var wz = "";
                        //未读
                        if("0" == status) {
                            wz += '<div class=\"dytb\" data-type=\"bk\" id=\"' + id + '\"  style=\" left:' + left + '%;\"><div><img src=\"img/case-untreated.png\" /></div></div>'; 
                        } else if("1" == status) { //已读
                            wz += '<div class=\"dytb\" data-type=\"bk\" id=\"' + id + '\"  style=\" left:' + left + '%;\"><div><img src=\"img/finish.png\"/></div></div>'; 
                        }
                        $("#zhuWz").append(wz);   
                        $("#" + timeH).append('<span style=\"display: none;\">' + item.time + '@' + item.state + '@' + item.id + '</span>'); 
                        //caseDetails(this, item, id);
                        break;
                    case 'alarm_pillar':
                        var item = item.details;
                        var time = JK.RiQi(item.createTime);
                        var timeH = Number(time.substring(11, 13));
                        var timeM = time.substring(14, 16);
                        var state = item.state;
                        var hm = (timeM) / 60;
                        var left = (((timeH + hm) / 24) * 100);
                        var wz = "";
                        //未读
                        if("0" == status) {
                            wz += '<div class=\"dytb\" data-type=\"bk\" id=\"' + id + '\"  style=\" left:' + left + '%;\"><div><img src=\"img/case-untreated.png\" /></div></div>'; 
                        } else if("1" == status) { //已读
                            wz += '<div class=\"dytb\" data-type=\"bk\" id=\"' + id + '\"  style=\" left:' + left + '%;\"><div><img src=\"img/finish.png\"/></div></div>'; 
                        }
                        $("#zhuWz").append(wz);   
                        $("#" + timeH).append('<span style=\"display: none;\">' + time + '@' + item.state + '@' + item.id + '</span>'); 
                        //caseDetails(this, item, id);
                        break;
                }
                $("#" + id).click(function() {
                	if($("#map").css("display") != 'none') {
                        var marker = syMapEvent.getMarker(id);
                        open2DPopupWin(marker);
                    }
                    if($("#cesiumContainer").css("display") != 'none') {
                        open3DPopupWin(mScene.getEntityById(id));
                    }
                });
            }); 
        }

        /**
         * 解析实时报警信息展示到左上角
         */
        function sametimeCase(data) {
            //var data = data.sametimeCase;
           /* $(".btn-box").click();*/
            var bkStr = "";
            $.each(data, function(i, item) {
                switch(item.type) {
                    case 'case':
                        var id = item.details.id;
                        var item = item.details;
                        bkStr += "<div class='case-dark anjian' id='case" + id + "'>";
                        bkStr += "<span>" + item.time.substring(0, 16) + "</span>";
                        bkStr += " 在 <span>" + item.place.substring(9, item.place.length) + "</span>";
                        bkStr += " 发生 <span>" + item.type + "</span>";
                        bkStr += "</div>";
                        break;
                    case 'target':
                        var id = item.messageId;
                        var item = item.details;
                        //秦羽紧急布控任务，布控对象2个，布控持续时间15天
                        bkStr += "<div class='case-dark bukong' id='case" + id + "'>";
                        bkStr += "<span>" + item.date.substring(0, 16) + "&nbsp;&nbsp;</span>";
                        bkStr += "摄像头发现布控对象&nbsp;&nbsp;<span>" + item.rwname + "</span>";
                        bkStr += "</div>";
                        break;
                    case 'alarm_pillar':
                     	var id = item.messageId;
                        var item = item.details;
                        var time = JK.RiQi(item.createTime);
                        bkStr += "<div class='case-dark anjian' id='case" + id + "'>";
                        bkStr += "<span>" + time + "</span>";
                        bkStr += "  <span>" + item.address + "</span>";
                        bkStr += " <span style='color:red'><b>校园报警终端报警</b></span>";
                        bkStr += "</div>";
                        break;
                }
            });  
            $("#bj").append(bkStr);
        }
        function ajaxDataFilter(responseData) {
            responseData.nocheck = true;
            $.each(responseData.children, function(i, item) {
                item.nocheck = true;
            });
            return responseData;
        }
		//加载预案树
        function plan() {
        	ajax.get("/api/plan/findTreePlanDoc",{},function(response){
	    		var data = response.data.data;
                var treeNodes = {"id":"parent1","pid":"0","name":"预案文档","open":true};
				treeNodes.children =  data;
				setting.check = chkbox;
                $.fn.zTree.init($("#treePlan"), setting, ajaxDataFilter(treeNodes));
              
		    },processFailed);
        }
		//预案勾选回调函数
        function onCheck(event, treeId, treeNodes) {
        	layer.closeAll();
            var documentSrc = treeNodes.planDocumentUrl;
            var width = (document.body.clientWidth - 500) + "px";
            ajax.get('plan/info/prepare?filePath=' + documentSrc, {}, function(response) {
                var result = response.data;
                if(result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    var browserUrl = top.fhzxApolloApi + 'plan/info/preview?filePath=' + documentSrc + '&userId=' + top.authorization.userId + '&userToken=' + top.authorization.userToken;
                    //打开layer图层并将doc转成pdf浏览
					    var index = layer.open({
                        id: 'export_preview',
                        title: '预案文档预览',
                        type: 2,
                        shade: 0,
                        //skin: 'layui-layer-lan',
                        content: top.frontHttpUrl + 'scheduling/plan/preview/viewer.html?file=' + encodeURIComponent(browserUrl),
                        /*area: [eval(window.screen.hight) + 'px', eval(window.screen.width - 400) + 'px'],
                        maxWidth: window.screen.width - 400 + 'px',*/
                        area: ['300px', '250px'],
                        offset: ['50px', width],
                        maxmin: true,
                        moveOut: true,
                        closeBtn: 2,
                        btnAlign: 'c',
                        /* btn: ['关闭'],*/
                        yes: function(index, layero) {
                            layer.closeAll();
                        },
                        cancel: function() {
                            //右上角关闭回调
                            var treeObj = $.fn.zTree.getZTreeObj(treeId);
                            treeObj.checkAllNodes(false);
                        }
                    });
                    /*layer.full(index);*/
                }
            });
        }
        /**
         * 解析视频数据
         */
        var geometryPoint = {};
        var videos = {
            videoList: function(data) {
                $.each(data, function(i, item) {
                    item.X = JK.lonlat(item.X);
                    item.Y = JK.lonlat(item.Y);
                    videoIds.push({
                        "id": item.id
                    });
                    var type = item.cameraType;
			    	if(type.indexOf("球机")!=-1){
			    		item.img = "map-video1"+item.stage+".png";
			    	}else{
			    		if(item.stage==3 && type.indexOf("4G")!=-1){
			    			item.img ="map-4G.png"
			    		}else{
			    			item.img = "map-video2"+item.stage+".png";
			    		}
			    	}
			    	var img = imgPath+item.img;
                    var icon = buildConfig(1, img, null, null, "sxtPopup", null, null);
                    var marker = new SuperMap.Marker(new SuperMap.LonLat(item.X, item.Y), icon);
                    marker.attr = item.id
                    syMapEvent.addMarker(marker);
                    item.Ptype = "sp";
                    item.eID = item.id;
                    if(item.dataAttr!=undefined){
		            	 delete item.dataAttr;//删除属性
		            }
                    item.dataAttr = JSON.stringify(item);
			    	/*var img = './img/map-video.png';*/
                    var billboardConfig = buildConfig(2,img, item, item.id, "sxtPopup", null, null);
                    sjtjSceneEvent.addEntity(billboardConfig);
                    var _2DPopupConfig = buildConfig(3, null, item, null, "sxtPopup", 280, 100);
                    marker.popup_config = _2DPopupConfig;
                    var geometry = new SuperMap.Geometry.Point(item.X, item.Y);
                    item.popupId = "sxtPopup";
                    geometry.obj = item;
                    geometryPoint[item.id] = geometry;
                    openPopup(marker);
                }); 
            },

            removeVideosMarker: function(data) {
                $.each(videoIds, function(i, item) {
                    syMapEvent.removeMarker(item.id)
                }); 
            },
            removeVideosEntity: function(data) {
                $.each(videoIds, function(i, item) {
                    sjtjSceneEvent.removeEntity(item.id);
                }); 
            }
        };
        /**
         * 地图上展示闪烁点 //case-untreated
         */
        var isVoicePrompt = false;
        function showWarning(data, imgName, suffix) {
            //标记图层上添加标记
            $.each(data, function(i, item) {
                var messageId = item.messageId;
                if(item.type=="target"){
                	item.details.id=messageId;
                }
                var id = item.details.id;
                var status = item.status;
                if(status==undefined || status=="" || status==0 ){//未读
                	imgName="ee0";
                	suffix=".gif";
                	isVoicePrompt =true;
                }else{
                	imgName="ee3";
                	suffix=".png";
                }
                switch(item.type) {
                    case 'case':
                        var caseDetails = item.caseDetail;
                        var caseInfo = item.details;
            	        caseInfo.caseDetail = caseDetails;
                        caseInfo.X = JK.lonlat(caseInfo.X);
                        caseInfo.Y = JK.lonlat(caseInfo.Y);
                        caseInfo.Ptype = "0";
                        caseInfo.eID = id;
                        caseInfo.mID = messageId;
                        var icon = buildConfig(1, './img/' + imgName + suffix, null, null, null, null, null);
                        var marker = new SuperMap.Marker(new SuperMap.LonLat(caseInfo.X, caseInfo.Y), icon);
                        marker.attr = id
                        var _2DPopupConfig = buildConfig(3, null, caseInfo, null, "jqPopup", 250, 260);
                        marker.popup_config = _2DPopupConfig;
                        marker.messageId = messageId;
                        syMapEvent.addMarker(marker);
                        openPopup(marker);
                        item.messageId = messageId;
                        caseInfo.scene="3DWarning";
                        var billboardConfig = buildConfig(2, './img/' + imgName + suffix, caseInfo, id, null, null, null);
                        sjtjSceneEvent.addEntity(billboardConfig);
                        break;
                    case 'target':
                    	var surveillanceInfo = item.surveillanceInfo;
                        var targetInfo = item.details;
            	        targetInfo.surveillanceInfo = surveillanceInfo;
            	        var dataStr1 = JSON.stringify(targetInfo.cameraDetail);
            	        targetInfo.dataStr = dataStr1;
                        targetInfo.X = JK.lonlat(targetInfo.X);
                        targetInfo.Y = JK.lonlat(targetInfo.Y);
                        targetInfo.Ptype = "1";
                        targetInfo.eID = id;
                        targetInfo.mID = messageId;
                        var icon = buildConfig(1, './img/' + imgName + '1' + suffix, null, null, null, null, null);
                        var marker = new SuperMap.Marker(new SuperMap.LonLat(targetInfo.X, targetInfo.Y), icon);
                        marker.attr = id
                        var _2DPopupConfig = buildConfig(3, null, targetInfo, null, "bkPopup", 360, 200);
                        marker.popup_config = _2DPopupConfig;
                        marker.messageId = messageId;
                        openPopup(marker);
                        syMapEvent.addMarker(marker);
                        targetInfo.messageId = messageId;
                        targetInfo.scene="3DWarning";
                        var billboardConfig = buildConfig(2, './img/' + imgName + '1' + suffix, targetInfo, id, null, null, null);
                        sjtjSceneEvent.addEntity(billboardConfig);
                        break;
                    case 'alarm_pillar':
                        var pillarInfo = item.details;
                        var params = pillarInfo.params;
                        var arry = params.split("|");
                        pillarInfo.cameraIndex = arry[0];
                        pillarInfo.id = id;
                        pillarInfo.stage = arry[1];
                        pillarInfo.X = JK.lonlat(pillarInfo.mapDimension);
                        pillarInfo.Y = JK.lonlat(pillarInfo.mapLongitude);
                        var time = JK.RiQi(pillarInfo.createTime);
                        pillarInfo.time = time;
                        pillarInfo.cameraType = "球机";
                        pillarInfo.type = "校园报警终端";
                        pillarInfo.Ptype = "3";
                        pillarInfo.popupId = "bjzPopup";
                        pillarInfo.eID = id;
                        pillarInfo.mID = messageId;
                        var dataStr1 = JSON.stringify(pillarInfo);
            	        pillarInfo.dataStr = dataStr1;
                        var icon = buildConfig(1, './img/' + imgName + suffix, null, null, null, null, null);
                        var marker = new SuperMap.Marker(new SuperMap.LonLat(pillarInfo.X, pillarInfo.Y), icon);
                        marker.attr = id
                        var _2DPopupConfig = buildConfig(3, null, pillarInfo, null, "bjzPopup", 250, 260);
                        marker.popup_config = _2DPopupConfig;
                        marker.messageId = messageId;
                        syMapEvent.addMarker(marker);
                        openPopup(marker);
                        item.messageId = messageId;
                        pillarInfo.scene="3DWarning";
                        var billboardConfig = buildConfig(2, './img/' + imgName + suffix, pillarInfo, id, null, null, null);
                        sjtjSceneEvent.addEntity(billboardConfig);
                        break;
                }
            })
            if(isVoicePrompt){
            	voicePrompt();
            }
        };
        /**
         * 弹出事件气泡、关闭气泡
         */
        function openPopup(marker) {
            marker.events.on({
                "click": open2DPopupWin,
                "scope": marker
            });
            var id = marker.attr;
            $('#case' + id).bind('click', function() {
                $(".case-dark").removeClass("selected");
                $(this).addClass("selected");
                if($("#map").css("display") != 'none') {
                    open2DPopupWin(marker);
                }
                if($("#cesiumContainer").css("display") != 'none') {
                    open3DPopupWin(mScene.getEntityById(id));
                }
            });
            //打开气泡窗口
            function open2DPopupWin() {
            	var id = marker.attr;
            	if(marker.messageId!=undefined) { 
	                popupClose(id, marker.messageId);
	            }
            	if(!JK.caseAdressIsExist(marker)){
	        		return;
	        	}
                map.zoomTo(5);
                var lonlat = marker.getLonLat();
                map.setCenter(lonlat);
                var tempId = marker.popup_config.tempId;
                if("sxtPopup"==tempId){
                	video.closeVideo();
                }
                mapPopup.showPopup(marker.popup_config);
                if(marker.messageId!=undefined) {
                	var audio = document.getElementById("audioPlay");
		            if(audio != null) {
		                //关闭报警声音
		                audio.pause();
		            }
                	//信息已读
                    if(marker.popup_config.contentHTML.indexOf("布控")!=-1){
                    	marker.icon.imageDiv.firstChild.setAttribute("src", "./img/ee31.png");
                    }else{
                    	marker.icon.imageDiv.firstChild.setAttribute("src", "./img/ee3.png");
                    }
                }
            }
        }
        //打开气泡窗口
        function open2DPopupWin(marker) {
        	var id = marker.attr;
        	if(marker.messageId!=undefined) { 
                popupClose(id, marker.messageId);
            }
        	if(!JK.caseAdressIsExist(marker)){
        		return;
        	}
        	map.zoomTo(5);
            var lonlat = marker.getLonLat();
            map.setCenter(lonlat);
            mapPopup.showPopup(marker.popup_config);
            if(marker.messageId!=undefined) { 
                if(marker.popup_config.contentHTML.indexOf("布控")!=-1){
                    	marker.icon.imageDiv.firstChild.setAttribute("src", "./img/ee31.png");
                    }else{
                		marker.icon.imageDiv.firstChild.setAttribute("src", "./img/ee3.png");
                }
            }
        }
        /**
         * 三维气泡
         */
        function open3DPopupWin(entity) {
        	var item = entity._billboard.attributes;
        	var id = item.eID;
        	if(item.mID!=undefined) { 
                popupClose(id, item.mID);
            }
        	var marker={lonlat:{lon:item.X,lat:item.Y}};
        	if(!JK.caseAdressIsExist(marker)){
        		return;
        	}
            var cameraConfig = {
			            x: item.X * 1,
              			y: item.Y * 1,
			            height: item.Y  * 1 + 900,
			            heading: 0.0002141084319855795,
			            pitch: -1.5707953113269526,
			            roll: 0,
			            type: "flyto"
			        }
            mScene.resetCenter(cameraConfig);
            var _3DPopupConfig = {};
            if(item.Ptype == "0") {
                _3DPopupConfig = buildConfig(4, null, item, null, 'jqPopup', 200, 80);
            } else if(item.Ptype == "1") {
                _3DPopupConfig = buildConfig(4, null, item, null, 'bkPopup', 200, 200);
            } else if(item.Ptype == "sp") {
                _3DPopupConfig = buildConfig(4, null, item, null, 'sxtPopup', 200, 80);
            }else{
            	_3DPopupConfig = buildConfig(4, null, item, null, item.popupId, 200, 80);
            }
            scenePopup.showPopup(_3DPopupConfig);
            var id = item.eID;
            if(item.mID!=undefined) {
            	var audio = document.getElementById("audioPlay");
	            if(audio != null) {
	                //关闭报警声音
	                audio.pause();
	            }
                entity._billboard._image._value = "./img/ee3.png";
            }
        }

        function popupClose(id, messageId) {
            ajax.post('/api/home/read/' + messageId, null, function(response) {
                $('#case' + id).remove();
                $('#' + id + " img").attr("src", "./img/finish.png");
               /* $('#' + id).unbind();*/
                /*$('#' + id).bind('click', function() {
                    var scope = parent.window.scope;
                    var name = "";
                    if($(this).attr("data-type") == "aj") {
                        for(var i = 0; i < services.menus.length; i++) {
                            if(services.menus[i].id == "p_ajjq") {
                                name = services.menus[i].name;
                                break;
                            }
                        }
                    } else if($(this).attr("data-type") == "bk") {
                        for(var i = 0; i < services.menus.length; i++) {
                            if(services.menus[i].id == "p_bkgl") {
                                name = services.menus[i].name;
                                break;
                            }
                        }
                    }
                    changeSelectMenue(scope, name, id);
                });*/
            });
        }

        /*
         *切换主菜单
         */
        function changeSelectMenue(scope, name, id) {
            for(var i = 0; i < scope.menus.length; i++) {
                if(scope.menus[i].name == name) {
                    scope.menus[i].show = true;
                    services.new_menus = scope.menus[i].secondarymenu;
                    parent.ui.changeLeftIframe(scope.menus[i].href + "?id=" + id);
                } else {
                    scope.menus[i].show = false;
                }
            }
            scope.$apply();
        }

        /*
         * 生成配置
         */
        function buildConfig(_id, icoUrl, item, id, tempId, width, height) {
            //图标大小
            var n = 20;
            var h = 28;
            var size = new SuperMap.Size(n, h);
            if(icoUrl != null && icoUrl.indexOf("ee") != -1) {
                size = new SuperMap.Size(30, 25);
                n = 30;
                h = 25;
            }else if("sxtPopup"==tempId){
            	n = 20;
            	h = 29;
            	size = new SuperMap.Size(20,29);
            }
            var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
            switch(_id) {
                case 1:
                    //生成图标
                    var icon = new SuperMap.Icon(icoUrl, size, offset);
                    //marker 配置
                    return icon;
                    break;
                case 2:
                    //entity 配置
                    var billboardConfig = {
                        eID: id,
                        url: icoUrl,
                        x: item.X,
                        y: item.Y,
                        z: 500,
                        width: n,
                        height: h,
                        attributes: item
                    };
                    return billboardConfig;
                    break;
                case 3:
                    //二维popup 配置
                    var contentHTML = template(tempId, {
                        content: item
                    });
                    var _2DPopupConfig = {
                    	tempId:tempId,
                        x: item.X,
                        y: item.Y,
                        contentHTML: contentHTML,
                        width: width,
                        height: height,
                        offsetX: 0,
                        offsetY: -30,
                        center: false
                    };
                    return _2DPopupConfig;
                    break;
                case 4:
                    //三维popup 配置
                    var cartesian3 = mScene.cesium.Cartesian3.fromDegrees(item.X, item.Y, 500)
                    var _3DPopupConfig = {
                        tempId: tempId,
                        singlePopup: true,
                        cartesian3: cartesian3,
                        data: {
                            content: item
                        },
                        width: width,
                        height: height,
                        offsetX: 0,
                        offsetY: -20,
                        supermap3DUtils: sjtjSceneEvent.supermap3DUtils
                    };
                    return _3DPopupConfig;
                    break;
            }
        }
        /**
         * 判断是否是资源id
         */
        function isRes(id) {
            var isres = false;
            $.each(videoIds, function(i, item) {
                if(item.id === id)
                    isres = true;
                return;
            }); 
            return isres;
        }
        /**
         * 初始化时间轴
         */
        function initTimeline() {
            var array = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
            var liHtml = "<span class=\"lft\"></span>";
            $.each(array, function(i, h) {
                if(h == "23") {
                    liHtml += '<li id=\"' + h + '\"><span>' + h + '</span>';
                } else if(h == "24") {
                    liHtml += '<span>' + h + '</span></li>';
                } else {
                    liHtml += '<li id=\"' + h + '\"><span>' + h + '</span></li>';
                }
            });
            $("#timelineAdd").html(liHtml);
            dynamicTimeline();
        }
        /**
         * 时间轴进度条 时间设置为一分钟
         */
        function dynamicTimeline() {
            var time = new Date();
            var hour = time.getHours();
            var min = (time.getMinutes()) / 60;
            var now = 100 - (((hour + min) / 24) * 100);
            $("#now").css("width", now + "%");
            setTimeout(dynamicTimeline, 60000);
        }
        
        function setIntervalRightbox(){
        	removeRES();
        	value.getCarsMsg();
            value.getPoicesMsg();
        }
        /**
         * 初始化right-box
         */
        function initRightbox() {
        	geometryPoint = {};
            value.getCarsMsg();
            value.getPoicesMsg();
            value.initVideosMsg();
            var rb = $('.box-ctn-box input[type=checkbox]');
            rb.each(function(i) {
                $(this).click(function() {
                    switch(i) {
                        case 0:
                            if(this.checked) {
                                value.getVideosMsg();
                                //alert('添加marker');
                            } else {
                                //去掉marker
                                videos.removeVideosMarker();
                                videos.removeVideosEntity();
                                videoIds=[];                            }
                            break;
                        case 1:
                        	if(this.checked) {
                                value.getPoicesMsg();
                            } else {
		                        $.each(policeIds, function(i, item) {
				                    syMapEvent.removeMarker(item.id);
				                    sjtjSceneEvent.removeEntity(item.id);
				                }); 
				                policeIds=[];
				            }
                            break;
                        case 2:
                        	if(this.checked) {
                                value.getCarsMsg();
                            } else {
		                        $.each(carIds, function(i, item) {
				                    syMapEvent.removeMarker(item.id);
				                    sjtjSceneEvent.removeEntity(item.id);
				                }); 
				                carIds=[];
				            }
                            break;
                        case 3:
	                        if(this.checked) {
	                                value.getBjzMsg();
	                            } else {
			                        $.each(bjzIds, function(i, item) {
					                    syMapEvent.removeMarker(item.id);
					                    sjtjSceneEvent.removeEntity(item.id);
					                }); 
					                bjzIds=[];
					            }
                            break;
                    }
                });
            });
        }
        
        function removeRES(){
        	if(policeIds.length!=0){
        		$.each(policeIds, function(i, item) {
	                syMapEvent.removeMarker(item.id);
	                sjtjSceneEvent.removeEntity(item.id);
	                delete geometryPoint[item.id];
	            }); 
	            policeIds=[];
        	}
            if(carIds.length!=0){
	            $.each(carIds, function(i, item) {
	                syMapEvent.removeMarker(item.id);
	                sjtjSceneEvent.removeEntity(item.id);
	                delete geometryPoint[item.id];
	            }); 
	            carIds=[];
	        }
        }
        /**
         * 播放声音提示
         */
        function voicePrompt() {
            var borswer = window.navigator.userAgent.toLowerCase();
            // isIE?
            if(!!window.ActiveXObject || "ActiveXObject" in window) {
                //IE内核浏览器
                var strEmbed = '<embed name="embedPlay" src="./wav/5051.wav" autostart="true" hidden="true" loop="false"></embed>';
                if($("body").find("embed").length <= 0)
                    $("body").append(strEmbed);
                var embed = document.embedPlay;
                //浏览器不支持 audion，则使用 embed 播放
                embed.volume = 100;
                //embed.play();这个不需要
            } else {
                //非IE内核浏览器
                var strAudio = "<audio id='audioPlay' src='./wav/5051.wav' hidden='true'>";
                if($("body").find("audio").length <= 0)
                    $("body").append(strAudio);
                var audio = document.getElementById("audioPlay");
                //浏览器支持 audion
                audio.play();
            }
        }
        //添加标记2、3 维
	    function addMarker(obj,treeId){
			var type = resType(treeId);
			if(JK.Object.notNull(obj.X) &&JK.Object.notNull(obj.Y)){
				if(!syMapEvent.isExist(obj.id)){
					obj.X= JK.lonlat(obj.X);
				    obj.Y = JK.lonlat(obj.Y);
					obj.attr = obj.id;
					//2维增加标记点 并增加气泡窗口
					addMarkerObj.addMarkerClick(treeId,obj);
					//3维增加标记点 并增加气泡窗口
					addMarkerObj.add3DMarker(obj,obj.img,type[1]);
				}
			}
		}
        var addMarkerObj = {
			/**
		 	* 2维标记添加单击事件
		 	* @param treeId //ztree id
		 	* @param item//气泡显示内容对象
		 	*/
			addMarkerClick:function(treeId,item,type) {
				var img = imgPath+item.img;
				item.makerSize = makerSize;
				var size = new SuperMap.Size(item.makerSize.width,item.makerSize.height);
				var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
				var lonLat = new SuperMap.LonLat(item.X, item.Y);
			    var marker = new SuperMap.Marker(lonLat, new SuperMap.Icon(img, size, offset));
			    marker.attr = item.id;
				syMapEvent.addMarker(marker);
				//例如点击marker弹出popup 
				marker.events.on({
					"click": openInfoWin,
					"scope": marker
				});
				var zhoubian;
				if(item.zhoubian!=undefined){
					zhoubian=1;
				}
				//单击事件回调函数
				function openInfoWin() {
					map.setCenter(lonLat);
					var marker = this;
					var popupTemId = resType(treeId);
					popupTemId = popupTemId[1];
					if(!$.isEmptyObject(type)){
						popupTemId=type;
					}
				    var contentHTML = template(popupTemId, { content: item });
			        var config = { x: item.X, y: item.Y, contentHTML: contentHTML, width: 302, offsetX: 0, offsetY: -40, center: false };
			        mapPopup.showPopup(config);
			        mapPopup.changePosition();
			        if(zhoubian==1){
			        	$(".jilu-tiao").show();
			        }
				}
			},
			//3维增加标记
			 add3DMarker:function(item, imgName, popupIdValue) {
			    item.popupId = popupIdValue;
			    var img = imgPath+item.img;
				item.makerSize = makerSize;
			    var config = { eID: item.id, url: img, width: item.makerSize.width, height: item.makerSize.height, x: item.X, y: item.Y, z: 500, attributes: item };
			    mScene.addEntityBillboard(config);
			}
		}
        function resType(type) {
		    var result = new Array();
		    var nodeImg = "",
		        popupTemId = "";
		    switch (type) {
		        case "treePolice":
		            nodeImg = "police.png";
		            popupTemId = "policePopup";
		            break;
		        case "treePoliceCar":
		            nodeImg = "police-car.png";
		            popupTemId = "policeCarPopup";
		            break;
		        case "policeResources":
		            popupTemId = "policeResPopup";
		            break;
		        case "treeVideo":
		            nodeImg = "video.png";
		            popupTemId = "videoPopup";
		            break;
		        case "bjzPopup":
		            nodeImg = "bjz.png";
		            popupTemId = "bjzPopup";
		            break;
		        case "bjzRecPopup":
		            nodeImg = "bjz.png";
		            popupTemId = "bjzRecPopup";
		            break;
		    }
		    result[0] = nodeImg;
		    result[1] = popupTemId;
		    return result;
	    }
        //所有视频弹出iframe窗口
        function getAllVideo(){
        	var allVideo = layer.open({
        		id:"aa",
			    type: 2,
			    title: '所有视频',
			    shade: 0.3,
			    maxmin: true,
			    shadeClose: true, 
			    area: ['800px', '560px'],
			    content: 'videoAll.html',
			    cancel: function() {
			    	$("#aa").find("iframe")[0].contentWindow.window.clearIntervalCameraFun();   
	            }
			  });
			  layer.full(allVideo);
		}
        $(".modal-fangda-clear").click(function(){
        	$(".modal-fangda").hide();
        });
        function planVideo(dataStrParam){
        	rightResource.video.openVideo(dataStrParam);
        }
	        //查询失败返回
		function processFailed(error){
	    	console.log(error);
		}
        //给外部提供接口
        var sjtj = {
            sjtjSceneEvent: sjtjSceneEvent,
            sjtjMapEvent: syMapEvent,
            mapCut: mapCut,
            drawPolygon: drawPolygon,
            closeZhoubian: closeZhoubian,
            video: video,
            init:init,
            websocketHandle:websocketHandle,
            getAllVideo:getAllVideo,
            rightResource:rightResource,
            mapAddressSearch:mapAddressSearch,
            ajax:ajax,
            planVideo:planVideo,
            open3DPopupWin:open3DPopupWin
           };
        module.exports = sjtj;
});