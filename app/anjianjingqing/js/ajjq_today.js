var _ajax;
$(document).ready(function() {
    parent.seajs.use([parent.window.services.frontHttpUrl + "/scheduling/app/common/ajax.js"], function(ajax,jk) {
        _ajax = ajax;
        if(parent.majjq != undefined) {
            findTodayCase();
            //显示今日案件统计
            $(window.parent.document).find("#ajtx-box").show();
        }
    });
});
//查询今日案件
function findTodayCase() {
    _ajax.post("/api/case/findTodayCase", {}, function(response) {
        var data = response.data.data;
        if(data != null) {
            caseList(response.data.data);
        }
    }, processFailed);
}
//构造今日案件列表动态添加
function caseList(data) {
	//刑事，治安，其它（调解纠纷与救治）
    var xs = 0,za = 0,qt = 0;
    if(!$.isEmptyObject(data)) {
        $(".not-data").hide();
    } else {
    	//无数据
        $(".not-data").show();
        return;
    }
    $.each(data, function(i, item) {
        i = i + 1;
        var cells = '';
        var backgroundColor = "";
        var classifyImg = "";
        if(item.type == null) {
            item.type = "调解纠纷与救助";
        }
        if(i % 2 == 0) backgroundColor = "jin-zebra-lists";
        if(item.classify == 1) {
            xs++;
            classifyImg = "img/xs" + i + ".png";
        } else if(item.classify == 2) {
            za++;
            classifyImg = "img/za" + i + ".png";
            item.type = "治安案件";
        } else {
            qt++;
            classifyImg = "img/qt" + i + ".png";
        }
        item.img = classifyImg;
        cells += "<div class='jin-list " + backgroundColor + "' data-obj='" + JSON.stringify(item) + "' id='case" + item.id + "'>";
        cells += '<div class="criminal-left">' + '<img src="' + classifyImg + '"/></div>';
        cells += '<div class="criminal-right">';
        cells += '<span>' + item.time + '</span>在';
        cells += '<span>' + item.place + '</span>发生';
        cells += '<span>' + item.type + '</span>';
        cells += '</div>';
        cells += '</div>';
        $("#todayCase").append(cells);
        item.popupId = "caseDetailsPopup";
        parent.majjq.sametimeCaseTimeLine(item);
        $('#case' + item.id).bind('click', function() {
            parent.majjq.listSelected(item.id);
            parent.majjq.getPopup(item);
        });
        $(window.parent.document).find('#' + item.id).bind('click', function() {
            parent.majjq.listSelected(item.id);
            parent.majjq.getPopup(item);
        });
        parent.majjq.addCaseMarker(item);
        parent.majjq.markerIdArray(item.id);
    });
    if(parent.majjq != undefined) {
        //首页案件连接到案件警情
        var src = $(window.parent.parent.document).find("#left_iframe").attr("src");
        if(src.indexOf("?") != -1) {
            var arraytemp = src.split('?');
            arraytemp = arraytemp[1].split('=');
            parent.majjq.listSelected(arraytemp[1]);
            $('#case' + arraytemp[1]).click();
        }
    }
    $("#todayCase").mCustomScrollbar();
    caseTotal(xs, za, qt);
}
//今日案件统计
function caseTotal(xs, za, qt) {
    var numXs = getTotal(xs);
    var numZa = getTotal(za);
    var numQt = getTotal(qt); 
    $(window.parent.document).find("#numXs1").html(numXs[0]); 
    $(window.parent.document).find("#numXs2").html(numXs[1]); 
    $(window.parent.document).find("#numZa1").html(numZa[0]); 
    $(window.parent.document).find("#numZa2").html(numZa[1]); 
    $(window.parent.document).find("#numQt1").html(numQt[0]); 
    $(window.parent.document).find("#numQt2").html(numQt[1]);
}
//今日案件列表单击显示详情事件
function caseDetails(obj) {
    var caseObj = $(obj).data("obj");
    item.popupId = "caseDetailsPopup";
    parent.addCaseMarker(caseObj);
}
//案件统计分开显示
function getTotal(num) {
    var numArray = [];
    if(num < 10 && num > 0) {
        numArray.push(0);
        numArray.push(num);
    } else if(num > 9) {
        var str = num.toString();
        numArray.push(str.substring(0, 1));
        numArray.push(str.substring(1, 2));
    } else {
        numArray = [0, 0];
    }
    return numArray;
}
//查询失败返回
function processFailed(error) {
    console.log(error);
}