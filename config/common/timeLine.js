define(function(require, exports, module) {
	
     /**
     * 初始化时间轴 1天
     */
    function initTimeline() {
        var array = ['00', '02', '04', '06','08', '10', '12', '14', '16', '18', '20', '22', '24'];
        var liHtml = "<span class=\"lft\"></span>";
        $.each(array, function(i, h) {
            if (h == "22") {
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span>';
            } else if (h == "24") {
                liHtml += '<span>' + h + '</span></li>';
            } else {
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span></li>';
            }
        });
        dynamicTimeline();
        timeoutSet();
        return liHtml;
    }
     /**
     * 初始化时间轴 一月
     */
    function initTimelineMouth() {
    	var li = [];
        var array = ['01', '03', '05','07', '09', '11', '13', '15', '17', '19', '21', '23','25','27','29','31'];
        var htmlLi = '<span class="lft"></span>';
        var liHtml = "<span class=\"lft\"></span>";
        $.each(array, function(i, h) {
            if (h == "29") {
            	htmlLi+='<li><span></span></li>';
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span>';
            } else if (h == "31") {
                liHtml += '<span>' + h + '</span></li>';
            } else {
            	htmlLi+='<li></li>';
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span></li>';
            }
        });
        li[0] = htmlLi;
        li[1] = liHtml;
        dynamicTimelineMouth();
        timeoutSetMouth();
        return li;
    }
     /**
     * 时间轴进度条 时间设置为一分钟
     */
    function dynamicTimelineMouth() {
        var date = new Date();
        //var mouth = (date.getMonth())+1;
        var curMonthDays = new Date(date.getFullYear(), (date.getMonth()+1), 0).getDate();
        var day = curMonthDays / (date.getDate());
        var now = 100-((day * 2)/(date.getDate()) * 100);
        $("#now").css("width", now + "%");
    }
     function  timeoutSetMouth(){
    	setTimeout(dynamicTimelineMouth, 60000);
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
    function  timeoutSet(){
    	setTimeout(dynamicTimeline, 60000);
    }
     /**
     * 初始化时间轴 一月
     */
    function initTimelineYear() {
    	var li = [];
        var array = ['01', '02', '03','04', '05', '06', '07', '08', '09', '10', '11', '12'];
        var htmlLi = '<span class="lft"></span>';
        var liHtml = "<span class=\"lft\"></span>";
        $.each(array, function(i, h) {
            if (h == "10") {
            	htmlLi+='<li><span></span></li>';
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span>';
            } else if (h == "12") {
                liHtml += '<span>' + h + '</span></li>';
            } else {
            	htmlLi+='<li></li>';
                liHtml += '<li id=\"' + h + '\"><span>' + h + '</span></li>';
            }
        });
        li[0] = htmlLi;
        li[1] = liHtml;
        dynamicTimelineYear();
        timeoutSetYear();
        return li;
    }
     /**
     * 时间轴进度条 时间设置为一分钟
     */
    function dynamicTimelineYear() {
        var date = new Date();
        var mouth = (date.getMonth())+1;
        var curMonthDays = new Date(date.getFullYear(), (date.getMonth()+1), 0).getDate();
        var day = (date.getDate()) / curMonthDays;
        var fen = curMonthDays/12;
        var now = 100 - (((mouth + day) / 12) * 100);
        $("#now").css("width", now + "%");
    }
     function  timeoutSetYear(){
    	setTimeout(dynamicTimelineMouth, 60000);
    }
    //给外部提供接口
    var timeLine = {
    	initTimeline:initTimeline,
    	dynamicTimeline:dynamicTimeline,
    	initTimelineMouth,initTimelineMouth,
    	initTimelineYear,initTimelineYear
    	
    };
    module.exports = timeLine;
});
 