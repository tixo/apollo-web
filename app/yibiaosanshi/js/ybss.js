define(function(require, exports, module) {
    //加载地图模块
    var ybssMapEvent = require('ybssMapEvent.js');
    //加载场景模块
    var ybssSceneEvent = require('ybssSceneEvent.js');
	//地图工具栏
	var mapTools = require('../../../config/common/mapTools/js/map_tools.js');
	var mapCut = require('../../../config/common/mapCut/js/map_cut.js');
	var rightResource = require('../../../config/common/rightResource/js/right_resource.js');
    var paramPeopleObject = {},paramHouseObject = {},paramWorkplaceObject = {};
    var backgroundColor = "";
    /**
     * 初始化UI点击事件
     */
    function initUi() {
    	//初始化地图工具栏
    	mapTools.initMapTools(ybssMapEvent,ybssSceneEvent);
    	mapCut.initMapCut();
    	rightResource.initRightResource(ybssMapEvent,ybssSceneEvent,mapCut,mapTools);
    	$("#danwei").mCustomScrollbar();
        $("#fangwu").mCustomScrollbar();
        $("#renkouScrollbar").mCustomScrollbar();
        //点击楼层
        $(".louceng-ctn ul li").each(function() {
            $(this).click(function() {
                $(this).addClass("actv").siblings().removeClass("actv");
				
            })
        });
        $(".top-btn").click(function() {
            var dataf = $(".top-btn").data("f");
            var dataNum = $(".top-btn").data("num");
            var a = (dataNum - 9) * -35;
            dataf += -35;
            if (dataf == a) {
                return;
            }
            var movePx = dataf + "px";
            $(".top-btn").data("f", dataf);
            $(".louceng-ctn ul").animate({ "marginTop": movePx }, 500);
        });

        $(".btm-btn").click(function() {
            var marginTopPx = $(".louceng-ctn ul").css("margin-top");
            var marginTop = parseInt(marginTopPx.substring(0, marginTopPx.indexOf("p")));
            if (marginTop == 0) {
                return;
            }
            marginTop += 35;
            var movePx = marginTop + "px";
            $(".louceng-ctn ul").animate({ "marginTop": movePx }, 500);
        });
        $(".leaflet-map-pane").css("top", "32px");
        //实有人口，房屋，单位列表页签切换
        $('#ybssTabs a').click(function(e) {
	     	$("#content1").show();
	     	$('#ybssTabs li').removeClass("current");
	        $(this).parent().addClass("current");
	        $("#content div").removeClass("show");
	        $('#' + $(this).attr('title')).addClass('show');
	        $("#content1 div").removeClass("show");
	        $('#' + $(this).attr('name')).addClass('show');
	        selectedCallback($(this)[0].innerText);
	    });
	    //默认打开一标三实加载实有人口数据
	    queryPeople(); //实有人口
	    //实有人口，房屋，单位 回车搜索
	    $('#so-renkou').keydown(function(e) {
		    keycode = e.which || e.keyCode;
		    if (keycode == 13) {
				queryPeople();
		    }
		});
		$('#so-danwei').keydown(function(e) {
		    keycode = e.which || e.keyCode;
		    if (keycode == 13) {
		      queryHouse();
		    }
		});
		$('#so-fangwu').keydown(function(e) {
		    keycode = e.which || e.keyCode;
		    if (keycode == 13) {
		       queryWorkplace();
		    }
		});
		//人口搜索按钮事件
		$("#btn-soso-rk").click(function(){
			 queryPeople();
		})
		//房屋搜索按钮事件
		$("#btn-soso-fw").click(function(){
			 queryHouse();
		});
		//单位搜索按钮事件
		$("#btn-soso-dw").click(function(){
			queryWorkplace();
		});
		//人口下拉筛选选中
		$("#tab2-bottom>select").each(function(){
			$(this).change(function(){
				if(this.value == ""){
					delete paramPeopleObject[this.name];
				}else{
					paramPeopleObject[this.name] = this.value;
				}
				queryPeople();
			});
		});
		//房屋下拉筛选选中
		$("#tab3-bottom>select").each(function(){
			$(this).change(function(){
				if(this.value == ""){
					delete paramHouseObject[this.name];
				}else{
					paramHouseObject[this.name] = this.value;
				}
				queryHouse();
			});
		});
		//单位下拉筛选选中
		$("#tab4-bottom>select").each(function(){
			$(this).change(function(){
				if(this.value == ""){
					delete paramWorkplaceObject[this.name];
				}else{
					paramWorkplaceObject[this.name] = this.value;
				}
				queryWorkplace();
			});
		});
    }
	 /**
     * 左侧人口，房屋，单位列表切换回调事件
     * @param String titleName 选型卡名称
     */
    function selectedCallback(titleName) {
        switch (titleName) {
            case "实有人口":
                queryPeople(); //实有人口
                break;
            case "实有房屋":
                queryHouse(); //实有房屋
                break;
            case "实有单位":
                queryWorkplace(); //实有单位
                break;
        }
    }
     /**
     * 查询所有实有人口数据
     * @param {Object} entity
     */
    function queryPeople() {
    	var param = $("#so-renkou").val();
    	param = $.trim(param);
    	if(param!=""){
	        var n = parseInt(param);
			if (!isNaN(n)){
			    paramPeopleObject.cardNumber = param;
			}else{
				paramPeopleObject.name = param;
			}
		}else{
			paramPeopleObject.cardNumber = "";
			paramPeopleObject.name ="";
	}
		//加载实有人口分页
		$("#fenye-renkou").zPager({
			url:"api/population/findPage",
			btnShow: false,
			functionName:findPopulationList,
			paramObject:paramPeopleObject
		});
		$("#fenye-renkou").show();
        $("#fenye-danwei").hide();
        $("#fenye-fangwu").hide();
    }
    function findPopulationList(data){
        $("#renkouScrollbar").mCustomScrollbar("destroy");
        var boarddiv = "";
        if(!$.isEmptyObject(data)){
	        $.each(data, function(i,item) {
	        	i % 2 == 0?backgroundColor = "ybss-zebra-lists":backgroundColor = "";
	        	var dataAttr = JSON.stringify(item);
				 boarddiv+= "<div class='rk-name-ctn " + backgroundColor + "' data-attr='" + dataAttr + "'>"+
								"<div class='rk-tp'>" + (i+1) + "</div>" +
					            "<div class='rk-name'>" +
					            "<span class='name'>" + item.name + "</span>" +
					            "<p class='location'><span>位置：</span>" + item.address + "</p>" +
					            "</div>" +
					            /*"<div class='rk-photograph'><img src='../../app/yibiaosanshi/img/poty02.png'></div>" +*/
	    					"</div>";
	        });
	    }
        $("#renkouScrollbar").html(boarddiv);
		$(".rk-name-ctn").each(function() {
		    $(this).click(peopleClick);
		});
	    $("#renkouScrollbar").mCustomScrollbar();
    }
	//点击人口列表事件
    function peopleClick() {
    	mapCut.cut3D();
    	ybssSceneEvent.supermap3DUtils.popup3DUtil.closeAllPopup();
        var dataAttr = eval('(' + $(this).attr("data-attr") + ')');
        dataAttr.objStr = $(this).attr("data-attr");
        indexren = eval('(' + $(this).attr("data-attr") + ')');
        rensuozailou = dataAttr.floorNo
        ybssSceneEvent.queryFloorLayer(dataAttr,"PEOPLE");
        $(this).addClass('list-selected').siblings().removeClass('list-selected');
    }
    //实有房屋
    function queryHouse() {
    	var param = $("#so-fangwu").val();
    	param = $.trim(param);
    	if(param!=""){
			paramHouseObject.address = param;
		}else{
			paramHouseObject.address = "";
		}
    	//加载实有房屋分页
		$("#fenye-fangwu").zPager({
		    url:"api/house/findPage",
			btnShow: false,
			functionName:findHouseList,
			paramObject:paramHouseObject
		});
		$("#fenye-fangwu").show();
        $("#fenye-danwei").hide();
        $("#fenye-renkou").hide();
    }
    //实有房屋查询成功
    function findHouseList(queryData) {
    	$("#fangwu").mCustomScrollbar("destroy");
    	var boarddiv = "";
    	if(!$.isEmptyObject(queryData)){
	        $.each(queryData, function(i,item) {
	        	var dataAttr = JSON.stringify(item);
	        	i % 2 == 0?backgroundColor = "ybss-zebra-lists":backgroundColor = "";
	       	    boarddiv+= "<div id='" + item.id + "' class='rk-name-ctn " + backgroundColor + "' data-attr='" + dataAttr + "'>" +
				"<div class='rk-tp'>" + (i+1)+ "</div>" +
					"<div class='rk-name'>" +
						"<span class='name'>" + item.name + "</span>" +
						"<p class='location'><span>位置：</span>" + item.address+ "</p>" +
					"</div>" +
				"</div>";
	        });
        }
        $("#fangwu").html(boarddiv);
		$(".rk-name-ctn").each(function() {
		    $(this).click(houseClick);
		});
	    $("#fangwu").mCustomScrollbar();
    }
	//单击房屋列表对象
    function houseClick() {
    	mapCut.cut3D();
    	ybssSceneEvent.supermap3DUtils.popup3DUtil.closeAllPopup();
        var dataAttr = eval('(' + $(this).attr("data-attr") + ')');
        dataAttr.objStr = $(this).attr("data-attr");
        fangwuzuozailou = dataAttr.floorNo;
        ybssSceneEvent.queryFloorLayer(dataAttr,"HOUSE");
        $(this).addClass('list-selected').siblings().removeClass('list-selected');
    }
    //实有单位
    function queryWorkplace() {
    	var param = $("#so-danwei").val();
    	param = $.trim(param);
    	if(param!=""){
			paramWorkplaceObject.name = param;
		}else{
			paramWorkplaceObject.name = "";
		}
    	//加载实有房屋分页
		$("#fenye-danwei").zPager({
			url:"api/company/findPage",
			btnShow: false,
			functionName:findWorkplace,
			paramObject:paramWorkplaceObject
		});
		$("#fenye-danwei").show();
        $("#fenye-fangwu").hide();
        $("#fenye-renkou").hide();
    }
    //单位查询成功回调函数
    function findWorkplace(queryData) {
		$("#danwei").mCustomScrollbar("destroy");
		var boarddiv = "";
		if(!$.isEmptyObject(queryData)){
			$.each(queryData, function(i,item) {
				var dataAttr = JSON.stringify(item);
				item.nameL=item.name;
	        	if(item.name.length>16){
	        		item.nameL = item.name.substr(0,16)+"...";
	        	}
	        	i % 2 == 0?backgroundColor = "ybss-zebra-lists":backgroundColor = "";
				boarddiv+="<div id='" + item.id + "' class='rk-name-ctn " + backgroundColor + "' data-attr='" + dataAttr + "'>" +
								"<div class='rk-tp'>" + (i+1)+ "</div>" +
								"<div class='rk-name'>" +
									"<span class='name' title='" + item.name + "'>" + item.nameL + "</span>" +
									"<p class='location'><span>位置：</span>" + item.address+ "</p>" +
								"</div>" +
						   "</div>";
			});
		}
		$("#danwei").html(boarddiv);
		$(".rk-name-ctn").each(function() {
		    $(this).click(clickWorkplace);
		});
	    $("#danwei").mCustomScrollbar();
    };
    //单击单位列表对象
    function clickWorkplace() {
    	mapCut.cut3D();
    	ybssSceneEvent.supermap3DUtils.popup3DUtil.closeAllPopup();
        var dataAttr = eval('(' + $(this).attr("data-attr") + ')');
        dataAttr.objStr = $(this).attr("data-attr");
        danweilouceng = dataAttr.floorNo;
        ybssSceneEvent.queryFloorLayer(dataAttr,"WORKPLACE");
        $(this).addClass('list-selected').siblings().removeClass('list-selected');
    }
     //查询失败返回
    function processFailed(error) {
        console.log("查询失败");
    }
    //给外部提供接口
    var ybss = {
        ybssSceneEvent: ybssSceneEvent,
        ybssMapEvent: ybssMapEvent,
        rightResource:rightResource,
        initUi:initUi
    };
    module.exports = ybss;
});