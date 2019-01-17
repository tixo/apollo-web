/*
 * 预案推演
 * @author gzq   update  zhangai
 * 2018.4.4
 */
var ajax, JK;
var dialog = window.parent.dialog;
var paramObject = {};
$(document).ready(function() {
    parent.seajs.use([parent.window.services.frontHttpUrl + "/scheduling/app/common/ajax.js", parent.window.services.frontHttpUrl + '/config/common/utils.js'], function(_ajax, _JK) {
        ajax = _ajax;
        JK = _JK;
        getCategory();//预案组分类
        //获取预案列表
        planInfo();
    });
    var $that = $(window.parent.document);
    $that.find(".time-box").css("display", "none");
    $that.find(".time-xuanze").css("display", "none");
    $that.find("#map_cut").css("bottom", "0px");
    //单击添加按钮弹出分组窗口
    $('#add-fenzu').on('click', function() {
    	$that.find("#updateBtn").hide();
    	$that.find("#saveBtn").show();
    	$that.find("div.gmodal-title").find("span:first").text("新建分组");
        $that.find("#fenzu-modal").show();
    });
    //关闭分组、打印窗口  
    $that.find(".modal-clear").click(function() {
        $(window.parent.document).find("#fenzu-modal").hide();
    });
    $that.find("#savePlanTem").click(function() {
        var id =  $(window.parent.document).find("#planimg-g-modal").data("id");
        ajax.post('/api/plan/update', { "id": id, "isTemplate": '1' }, function(response) {
            $(window.parent.document).find("#planimg-g-modal").hide();
        });
    });
    //分类选择事件绑定
    $("#categoryName").change(function(){
		if(this.value == ""){
			delete paramObject.categoryName;
		}else{
			paramObject.categoryName = $(this).find("option:selected").text();
		}
		planInfo();
	});
});
//获取 预案分类下拉框
function getCategory(){
	var dics = ['plan_category'];
	ajax.post('dic/info/findItemsBatch', dics, function (response) {
	    var result = response.data;
	    $.each(dics, function (index, data) {
	        if (!$.isEmptyObject(result[data])) {
	        	selectOption(data,result[data]);
	        }
	    });
	},processFailed);
}
//预案分页查询
function planInfo() {
	$(".ctn-yj-list-box").mCustomScrollbar();
    $("#planPage").zPager({
        url: "/api/plan/findPage",
        btnShow: false,
        functionName: planInfoList,
        paramObject: paramObject
    });

}
//预案查询成功回调
function planInfoList(list) {
	$(".ctn-yj-list-box").mCustomScrollbar("destroy");
	$(".ctn-yj-list-box").html("");
    var html = template('bkplan', {
        list: list
    });
    $('.ctn-yj-list-box').html(html);
    $(".ctn-yj-list-box").mCustomScrollbar();
}
/**
 * 展开布控预案列表
 */
function pulldown(obj) {
    $(obj).parents(".bkfa-box").find(".bkfa-box-fa").toggle();
}
/**
 * 修改布控预案分组
 */
function updateFenzu(obj) {
	var that = $(window.parent.document).find("#fenzu-modal");
	that.find("#updateBtn").show();
    that.find("#saveBtn").hide();
    that.find("div.gmodal-title").find("span:first").text("修改分组");
    var id = $(obj).parent().data("id");
    var name = $(obj).parent().data("name");
    var categoryid = $(obj).parent().data("categoryid");
    var description = $(obj).parent().data("description");
    that.find("#planCategory").val(categoryid);
    that.find("#planGroupName").val(name);
    that.find("#description").val(description);
    that.show(); 
    $(window.parent.document).find("#fenzu-modal")[0].dataset.id = id;
}
/**
 * 删除布控预案分组
 */
function deleteFenzu(obj) {
    var id = $(obj).parent().data("id");
    var d = dialog({
        content: '确定要删除该条分组？',
        okValue: '删除',
        ok: function() {
            //$(obj).parent().parent().html('');
            ajax.post('/api/group/delete/' + id, {}, function(response) {
                console.log("布控预案 删除分组");
                planInfo();
                return true;
            });
        },
        cancelValue: '取消',
        cancel: function() {}
    });
    d.show();
}
/**
 * 添加布控预案
 */
function addPlan(obj) {
    var that = $(obj);
    var id = $(obj).parent().data("id");
    var categoryName = $(obj).parent().data("categoryname");
    var categoryId = $(obj).parent().data("categoryid");
    var data = {
        "belongTaskId": id,
        "categoryId": categoryId,
        "categoryName": categoryName,
        "isTemplate": 0,
        "planName": "新建预案",
    };
    ajax.post('/api/plan/save', data, function(response) {
        console.log("布控预案  添加预案");
        planInfo();
    });
}
/**
 * 打印预案
 */
function printPlan(obj) {
    var id = $(obj).parent().parent().data("id");
    console.log(id);
    $(window.parent.document).find("#planimg-g-modal").data("id",id);
    var plot = parent.window.plot;
    plot.saveImg(id);
}

/**
 * 删除布控预案
 */
function delatePlan(obj) {
    var id = $(obj).parent().data("id");
    var d = dialog({
        content: '确定要删除该条预案？',
        okValue: '删除',
        ok: function() {
            //$(obj).parent().html('');
            //parent.window.plot.deleteSelectedFeaturesAnimation();//删除所有动画
            parent.window.plot.PlottingClear();
            ajax.post('/api/plan/delete/' + id, {}, function(response) {
                console.log("布控预案 删除预案");
                console.log(response);
                planInfo();
                return true;
            });
        },
        cancelValue: '取消',
        cancel: function() {}
    });
    d.show();
}

var clickTimer = null;
/**
 * 选中布控预案
 */
function selectedPlan(obj) {
    var id = $(obj).parent().data("id");
    if (clickTimer) {
        window.clearTimeout(clickTimer);
        clickTimer = null;
    }
    clickTimer = window.setTimeout(function() {
        $(obj).parent().parent().find("span .img2").css("display", "block");
        $(obj).parent().parent().find("span .img1").css("display", "none");
        $(".edit-plan").children("img").attr("data-state", false);
        $(".edit-plan").children("img").attr("src", "./img/update.png");
        var plot = parent.window.plot;
        plot.plottingEdit.deactivate();//注销绘制控件
        plot.deleteSelectedFeaturesAnimation();//删除所有动画
        plot.openSmlFileOnServer(id);//打开指定的已发布态势图文件到指定图层
        $(".plan-item").css('background-color', '#f0f6ff');
        $(obj).parent().css('background-color', 'rgba(212, 229, 255, 0.7)');
        $(obj).parent().find("span .img1").css("display", "block");
        $(obj).parent().find("span .img2").css("display", "none");
    }, 300);
}

/**
 * 更改布控预案名称
 */
function changePlan(obj) {
    var id = $(obj).parent().data("id");
    if (clickTimer) {
        window.clearTimeout(clickTimer);
        clickTimer = null;
    }
    var planName = $(obj).children("input");
    planName.attr('readonly', false);
    planName.click(function(event) {
        event.stopPropagation();
    })
    planName.blur(function() {
        //保存
        planName.attr('readonly', true);
        ajax.post('/api/plan/update', { "id": id, "planName": planName.val() }, function(response) {
            console.log("布控预案 编辑预案");
            console.log(response);
        });
    });
    planName.keydown(function(e) {
        keycode = e.which || e.keyCode;
        if (keycode == 13) {
            //保存
            planName.attr('readonly', true);
            console.log(planName.value);
            ajax.post('/api/plan/update', { "id": id, "planName": planName.val() }, function(response) {

                console.log("布控预案 编辑预案");
                console.log(response);
            });
        }
    });
}


/**
 * 编辑布控预案
 */
function editPlan(obj) {
	parent.mbk.mapCut.cut2D();
    var id = $(obj).parent().data("id");
    var that = $(obj).children("img");
    var state = that.attr("data-state");
    var plot = parent.window.plot;
    $(obj).parent().parent().find("span .img2").css("display", "block");
    $(obj).parent().parent().find("span .img1").css("display", "none");
    //plot.openSmlFileOnServer(id);
    $(".plan-item").css('background-color', '#f0f6ff');
    $(obj).parent().css('background-color', 'rgba(212, 229, 255, 0.7)');
    $(obj).parent().find("span .img1").css("display", "block");
    $(obj).parent().find("span .img2").css("display", "none");
    if (state == "false") {
    	if(!$(window.parent.document).find(".police-select8").hasClass("dest")){
			$(window.parent.document).find("#plot")[0].click();
		}
    	$(window.parent.document).find("#clearSymbolDiv").show();
        $(".edit-plan").children("img").attr("data-state", false);
        $(".edit-plan").children("img").attr("src", "./img/update.png");
        that.attr("data-state", true);
        that.attr("src", "./img/updating.png");
        plot.deleteSelectedFeaturesAnimation();//删除所有动画
        plot.openSmlFileOnServer(id);//打开指定的态势图
    } else {
        that.attr("data-state", false);
        that.attr("src", "./img/update.png");
        plot.save(id);//保存态势图
        //plot.plottingEdit.deactivate();
        $(window.parent.document).find("#clearSymbolDiv").hide();
    }
}
//播放动画
function play(obj) {
    var plot = parent.window.plot;
    plot.createAnimation();//创建动画
    console.log(parent.parent.window.mapUtil.mapContent.plottingLayer)
    //创建定时器，调用执行
    window.setInterval(function(){parent.parent.window.mapUtil.mapContent.goAnimationManager.execute()}, 100);
    if (null === parent.parent.window.mapUtil.mapContent.goAnimationManager.goAnimations) {
        return;
    }
    for (var i = 0; i < parent.parent.window.mapUtil.mapContent.goAnimationManager.goAnimations.length; i++) {
        parent.parent.window.mapUtil.mapContent.goAnimationManager.goAnimations[i].play();
    }
    setTimeout(function(){plot.deleteSelectedFeaturesAnimation();}, 10000);
    //删除所有动画
}
 //动态添加下拉框
function selectOption(selectClass,data){
	$(window.parent.document).find("."+selectClass).html("<option value='0'>全部</option>");
	$("."+selectClass).html(" <option value=''>全部</option>");
	$.each(data, function (index, d) {
	    $(window.parent.document).find("."+selectClass).append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
	    $("."+selectClass).append('<option value="' + d.DIC_IDENT + '">' + d.DIC_NAME + '</option>');
	});
	$(window.parent.document).find("#planCategory").find('option[value=0]').remove();
}
function processFailed(e){
	console.log("查询失败"+e);
}