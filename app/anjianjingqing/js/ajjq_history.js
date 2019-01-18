var paramKey = "", paramValue = "", _ajax;
var paramObject = {};
$(document).ready(function () {
    parent.seajs.use([parent.window.services.frontHttpUrl + "/scheduling/app/common/ajax.js"], function (ajax,jk) {
        _ajax = ajax;
        selsectZpager();
    });
    //历史案件select
    $(".history-box-select li").click(function () {
        var paramObj = $(this);
        paramKey = paramObj[0].dataset.name;
        paramValue = paramObj[0].innerHTML;
        paramObj.addClass("li-bg-col");
        paramObj.siblings().removeClass("li-bg-col");
        $(".history-box-ctn>div.history-ctn-option").eq(paramObj.index()).toggle().siblings(".history-ctn-option").hide();
    });
    //清除查询条件
    $("#clearParam").click(function () {
        $(".option-gather-ctn>span").each(function () {
            $(this).hide();
        });
        //$(".option-gather-ctn").toggle();
        paramObject = {};
        $("#pagerHtmlWrap").css("top", 73);
        selsectZpager();
        $("#clearParam").html("全部");
    });
    //隐藏今日案件统计
    $(window.parent.document).find("#ajtx-box").hide();
    //初始化日期选择
    parent.window.majjq.initTime();
    //列表增加滚动条
    $("#pagerHtmlWrap").mCustomScrollbar();
    //加载筛选条件
    getSearchParam();
});

//设置选中信息
function searchParam(start, end) {
    $("#datehide").hide();
    var timeHtml = start + " 至  " + end;
    $('#daterange-btn span').html(timeHtml);
    $("#qsTime").html("时间：" + timeHtml);
    $("#qsTime").css("display", "inline-block");
    paramObject.startTime = start;
    paramObject.endTime = end;
    search();
}

//分页ajax查询
function selsectZpager() {
    //加载历史案件分页
    $("#historyCase").zPager({
        url: '/api/case/findHistoryCase',
        htmlBox: $('#mCSB_1_container'),
        btnShow: false
    });
}

var caseIdArray = [];

//获取历史案件列表
function getList(_data) {
    $('#mCSB_1_container').html("");
    if (caseIdArray.length != 0) {
        $(window.parent.document).find("#zhuWz").html('<div class="modal-time" id="now"><div class="modal-time-an"></div></div>');
        parent.majjq.removeCaseMarker(caseIdArray);
        caseIdArray = [];
    }
    if (_data == null) return;
    $.each(_data, function (i, item) {
        var cells = "";
        i = i + 1;
        var backgroundColor = "";
        var classifyImg = "";
        if (item.type == null) {
            item.type = "调解纠纷与救助";
        }
        if (i % 2 == 0) backgroundColor = "jin-zebra-lists";
        if (item.classify == 1) {
            classifyImg = "img/xs" + i + ".png";
        } else if (item.classify == 2) {
            classifyImg = "img/za" + i + ".png";
            item.type = "治安案件";
        } else {
            classifyImg = "img/qt" + i + ".png";
        }
        item.img = classifyImg;
        item.X = item.x;
        item.Y = item.y;
        var place = item.place;
        if(place.length>25){
        	place = place.substring(0,24);
        	place += "...";
        }
        cells += "<div class='jin-list " + backgroundColor + "'  data-obj='" + JSON.stringify(item) + "' id='case" + item.id + "'>";
        cells += '<div class="criminal-left">' + '<img src="' + classifyImg + '"/></div>';
        cells += '<div class="criminal-right">';
        cells += '<span>' + item.time + '</span>在';
        cells += '<span title='+item.place+'>' + place + '</span>发生';
        cells += '<span>' + item.type + '</span>';
        cells += '</div>';
        cells += '</div>';
        parent.majjq.sametimeCaseTimeLine(item);
        item.popupId = "caseDetailsPopup";
        $('#mCSB_1_container').append(cells);
        $('#case' + item.id).bind('click', function () {
            parent.majjq.listSelected(item.id);
            parent.majjq.getPopup(item);
        });
        $(window.parent.document).find('#' + item.id).bind('click', function () {
            parent.majjq.listSelected(item.id);
            parent.majjq.getPopup(item);
        });
        parent.majjq.addCaseMarker(item);
        parent.majjq.markerIdArray(item.id);
        caseIdArray.push(item.id);
    });
}

//加载筛选条件
function getSearchParam() {
    _ajax.post("/api/case/findCaseCondition", {}, function (response) {
        getSearchParamHtml(response.data.data);
    });

    function getSearchParamHtml(_data) {
        var paramHtml = "";
        var paramArray = [];
        $.each(_data, function (i, item) {
            paramHtml += '<div class="history-ctn-option" name="' + i + '">';
            $.each(item, function (j, item1) {
                paramHtml += '<span id="' + item1.ident + '">' + item1.name + '</span>';
            });
            paramHtml += '</div>';
        });
        $(".history-box-ctn").append(paramHtml);
        selectedArea();
    }
}

/**
 * 区域获取  v
 */
function selectedArea() {
    var config = {
        dataName: "HTC02:片区面",
        sql: "",
        url: parent.services.queryUrl,
        successCallback: onQueryArea,
        failCallback: processFailed
    };
    parent.majjq.ajjqSceneEvent.supermap3DUtils.query3DUtil.getSqlBydata(config);

    //查询成功返回结果函数
    function onQueryArea(queryEventArgs) {
        var selectedFeatures = queryEventArgs.result.features;
        $.each(selectedFeatures, function (i, item) {
            item = item.attributes;
            $("#queryArea").append('<span id="' + item.LAYER + '">' + item.LAYER + '</span>');
        });
        parmSelectClick();
    }
}

//筛选条件单击显示
function parmSelectClick() {
    $(".history-ctn-option>span").each(function () {
        $(this).click(function () {
            $(".history-ctn-option").hide();
            $("#" + paramKey).css("display", "inline-block");
            $("#" + paramKey).html(paramValue + ":" + $(this).html());
            var value = $(this).attr("id");
            if ("area" != paramKey) {
                value = parseInt(value);
            }
            paramObject[paramKey] = value;
            search();
        });
    });
}

//查询失败返回
function processFailed(error) {
    console.log(error);
}

//查询
function search() {
    setParamShow();
    setPagerHtmlTop();
    selsectZpager();
}

//更改名称
function setParamShow() {
    $("#clearParam").html("清空选项");
}

function setPagerHtmlTop() {
    var height = $(".option-gather-ctn").height();
    $("#pagerHtmlWrap").css("top", 65 + height);
}
