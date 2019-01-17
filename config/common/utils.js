define(function(require, exports, module) {
  var JK = JK || {};
  JK = {
    Object: {
      notNull: function(obj) { //判断某对象不为空..返回true 否则 false
        if (obj === null) return false;
        else if (obj === undefined) return false;
        else if (obj === "undefined") return false;
        else if (obj === "") return false;
        else if (obj === "[]") return false;
        else if (obj === "{}") return false;
        else return true;
      },
      notEmpty: function(obj) { //判断某对象不为空..返回obj 否则 ""
        if (obj === null) return "";
        else if (obj === undefined) return "";
        else if (obj === "undefined") return "";
        else if (obj === "") return "";
        else if (obj === "[]") return "";
        else if (obj === "{}") return "";
        else return obj;
      },
      serialize: function(form) {
        var o = {};
        $.each(form.serializeArray(), function(index) {
          if (o[this['name']]) {
            o[this['name']] = o[this['name']] + "," + this['value'];
          } else {
            o[this['name']] = this['value'];
          }
        });
        return o;
      }
    },
    lonlat: function(obj) {
			if (obj !== null&& obj !== undefined&&obj !== "undefined"&&obj !== ""&&obj !== "[]"&&obj !== "{}"){
				return typeof(obj) != "number" ? parseFloat(obj) : obj;
			};
    },
    //计算时间相差 和差的总秒数
		dateDif:function(startdate,enddate,minute){
			var time=[];
			if(startdate!=null){
				//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
			    startdate = startdate.replace(/\-/g, "/");
			    enddate = enddate.replace(/\-/g, "/");
			    //将计算间隔类性字符转换为小写
			    var sTime =new Date(startdate); //开始时间
			    var eTime =new Date(enddate); //结束时间
			    var date = eTime.getTime() - sTime.getTime(); 
			    if(date < 0){
			    	return 1;
			    }
			}
		    if(minute!=null){
		    	date = minute;
		    }
		    var days = date / 1000 / 60 / 60 / 24;
			  var daysRound = Math.floor(days);
		    var hours    = date/ 1000 / 60 / 60 - (24 * daysRound);
		    var hoursRound   = Math.floor(hours);
		    var minutes   = date / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
		    var minutesRound  = Math.floor(minutes);
		    var seconds   = date/ 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
		    var secondsRound  = Math.floor(seconds);
			if(hoursRound==0){hoursRound="00";}
			if(hoursRound < 10 && hoursRound>0){hoursRound="0"+hoursRound;}
			if(minutesRound==0){minutesRound="00";}
			if(minutesRound <10 && minutesRound >0){minutesRound="0"+minutesRound;}
			if(daysRound!=0){
				hoursRound = daysRound+"天"+hoursRound
			}
		    time[0]=(hoursRound +":"+minutesRound);
		    time[1]=date;
		    time[2]=daysRound;
		    return time;
		},
		
	subSomething:function(){ 
		if(document.readyState == "complete") //当页面加载状态 
			//关闭加载动画
      parent.ui.closeLoading();
	},
	initTime:function(inputSearch) {
        //定义locale汉化插件
        var locale = {
            "format": 'YYYYMMDDHHmmss',
            "separator": "~",
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
        $("#"+inputSearch).daterangepicker({
        		opens : 'left',
        		timePicker : true, //是否显示小时和分钟
			   		timePickerIncrement :1, //时间的增量，单位为分钟
			    	timePicker24Hour: true, //时间制
			    	alwaysShowCalendars:true,
			   	  showDropdowns: true,
			   	  maxDate: moment(new Date()), //设置最大日期
			   	  'locale': locale,
                //汉化按钮部分
                ranges: {
                    '今日': [moment().startOf('day'), moment()],
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
            	 $("#"+inputSearch).val(start.format('YYYYMMDDHHmmss')+"~"+end.format('YYYYMMDDHHmmss'));
            }
        );
    },
    caseAdressIsExist:function(marker){
			var isExist = true;
        	if(marker.lonlat.lon==undefined || marker.lonlat.lon==0){
	        	layer.msg("案件上图地址为空！");
        		return false;
        	}else if(marker.lonlat.lon<108.92244966802625||marker.lonlat.lon>109.02248777112224){
        		layer.msg("案件上图地址超出航天城范围！");
        		return false;
        	}else if(marker.lonlat.lat<34.11711344641523||marker.lonlat.lat>34.19483456198223){
        		layer.msg("案件上图地址超出航天城范围！");
        		return false;
        	}
        	return isExist;
		},
		  RiQi:function(sj){
      var now = new Date(sj);
      var   year=now.getFullYear();    
        var   month=now.getMonth()+1;    
        var   date=now.getDate();    
        var   hour=now.getHours();    
        var   minute=now.getMinutes();    
        var   second=now.getSeconds();    
        return   year+"-"+month+"-"+date+" "+hour+":"+minute;    
       
  }
}
  module.exports = JK;
})
