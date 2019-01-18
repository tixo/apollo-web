define(function (require, exports, module) {
    var format = require('../../common/format');

    function getCaseAffairsCategoryData(chartConfig,params) {
        var periodData = $.zui.store.get('caseAffairsCategoryHalf').period;
        var nowDay = getNowDay(params);
        var total = 0;
        var temp = {
            criminal:{},
            security:{},
            help:{}
        };

		if (!$.isEmptyObject(periodData)) {
			$.each(periodData, function (index, data) {
                total = eval(data.TOTAL+total);
                if(data.DIC_IDENT == '1'){
                    temp.criminal['period'] = data.TOTAL;
                    temp.criminal['average'] = (data.TOTAL/nowDay).toFixed(2);
                }
                if(data.DIC_IDENT == '2'){
                    temp.security['period'] = data.TOTAL;
                    temp.security['average'] = (data.TOTAL/nowDay).toFixed(2);
                }
                if(data.DIC_IDENT == '3'){
                    temp.help['period'] = data.TOTAL;
                    temp.help['average'] = (data.TOTAL/nowDay).toFixed(2);
                }
			});
        }
        
        var averageDay = (total/nowDay).toFixed(2);
        var now = $.extend(true,temp,{
            total: total,
            year: format.Format(new Date(), 'yyyy年'),
            averageDay: averageDay
        });

        var basisData = $.zui.store.get('caseAffairsCategoryHalf').basis;

        var basisTotal = 0;
		if (!$.isEmptyObject(basisData)) {
			$.each(basisData, function (index, data) {
                basisTotal = eval(data.TOTAL+basisTotal);

                if(data.DIC_IDENT == '1'){
                    temp.criminal['basis'] = data.TOTAL;
                    temp.criminal['percent'] = getPercentTxt(chartConfig,temp.criminal['period'], data.TOTAL);
                }
                if(data.DIC_IDENT == '2'){
                    temp.security['basis'] = data.TOTAL;
                    temp.security['percent'] = getPercentTxt(chartConfig,temp.security['period'] , data.TOTAL);
                }
                if(data.DIC_IDENT == '3'){
                    temp.help['basis'] = data.TOTAL;
                    temp.help['percent'] = getPercentTxt(chartConfig,temp.help['period'] , data.TOTAL);
                }
            });

            now['basis'] = basisTotal;
            //同比
            now['percent'] = getPercentTxt(chartConfig,total, basisTotal);
        }

        return now;
    }

    function getPercentTxt(chartConfig,molecule, denominator){
        var percent = chartConfig.getPercent(molecule, denominator);
        var percentTxt = '';
        //上升
        if(percent.icon){
            percentTxt= '上升'+percent.data;
        }else{
            percentTxt = '下降'+percent.data;
        }
        return percentTxt;
    }

    function getCriminalCaseTowHourData(chartConfig,params) {
        var periodData = $.zui.store.get('criminalCaseTowHourHalf').period;
        var total = 0;
        var temp = {};
		if (!$.isEmptyObject(periodData)) {
			$.each(periodData, function (index, data) {
                total = eval(data.TOTAL+total);
			});
        }
        
        var nowDay = getNowDay(params);
        var averageDay = (total/nowDay).toFixed(2);
        var now = $.extend(true,temp,{
            total: total,
            averageDay: averageDay,
            table: periodData
        });
        return now;
    }

    function getSecurityAffairsData(chartConfig) {
        var periodData = $.zui.store.get('securityAffairsHalf').period;
        var period = {};
		if (!$.isEmptyObject(periodData)) {
			$.each(periodData, function (index, data) {
                if(data.DIC_IDENT == '2'){
                    period['security'] = data.TOTAL;
                }
                if(data.DIC_IDENT == '3'){
                    period['help'] = data.TOTAL;
                }
			});
        }

        var relativeData = $.zui.store.get('securityAffairsHalf').basis;

        var basis = {};
        var percent = {};
		if (!$.isEmptyObject(relativeData)) {
			$.each(relativeData, function (index, data) {
                if(data.DIC_IDENT == '2'){
                    var securityPercent = chartConfig.getPercent(period.security, data.TOTAL);
                    
                    //上升
                    if(securityPercent.icon){
                        percent['security'] = '上升'+securityPercent.data;
                    }else{
                        percent['security'] = '下降'+securityPercent.data;
                    }

                    basis['security'] = data.TOTAL;
                }
                if(data.DIC_IDENT == '3'){
                    var helpPercent = chartConfig.getPercent(period.help, data.TOTAL);
                    
                    if(helpPercent.icon){
                        percent['help'] = '上升'+helpPercent.data;
                    }else{
                        percent['help'] = '下降'+helpPercent.data;
                    }

                    basis['help'] = data.TOTAL;
                }

            });         
        }

        // console.log({
        //     period: period,
        //     basis: relative,
        //     percent: percent
        // });
        return {
            period: period,
            basis: basis,
            percent: percent
        };
    }

    function getCriminalAffairsData(chartConfig,params) {
        var periodData = $.zui.store.get('criminalAffairsHalf').period;
        var total = 0;
		if (!$.isEmptyObject(periodData)) {
			$.each(periodData, function (index, data) {
                total = eval(data.TOTAL+total);
			});
        }

        var criminalAffairsTable = []
        var basisData = $.zui.store.get('criminalAffairsHalf').basis;
        if (!$.isEmptyObject(basisData)) {         
			$.each(basisData, function (index, data) {

                var tempPeriod = periodData[index];
                var tempPercent = chartConfig.getPercent(tempPeriod.TOTAL, data.TOTAL);

                var compText = "";
                if(tempPercent.icon){
                    compText=tempPercent.data+"↑"
                }else{
                    compText=tempPercent.data+"↓"
                }                
                criminalAffairsTable.push({
                    name:tempPeriod.DIC_NAME,
                    period: tempPeriod.TOTAL,
                    basis: data.TOTAL,
                    percent: compText
                });
            });
        }

        var year = format.Format(new Date(), 'yyyy');
        return {
            year: year,
            basisYear: eval(year-1),
            averageMonth: (total/6).toFixed(2),
            period: total,
            title: params.searchParams.title,
            criminalAffairsTable: criminalAffairsTable
        };
    }

    function getCriminalCaseTrendData(chartConfig) {
        var periodData = $.zui.store.get('criminalCaseTrendHalf').period;
        var total = 0;
		if (!$.isEmptyObject(periodData)) {
			$.each(periodData, function (index, data) {
                total = eval(data.TOTAL+total);
			});
        }
        return {
            year: format.Format(new Date(), 'yyyy'),
            averageMonth: (total/12).toFixed(2),
            period: total
        };
    }
    

    var exportData = {};
    /**
     * 加载月统计方式模板和存储以及页面节点id
     * 
     * @param {请求参数} params 
     * @param {存储或节点id} storeKeys 
     * @param {页面模板名称前缀} tplSuffix 
     */
    function initMonthDepends(params,data,chartConfig) {
        var montTpl = '';
        montTpl = require('./tpl/half.html');
        var template = Handlebars.compile(montTpl);
        exportData = {
            caseAffairsCategory: getCaseAffairsCategoryData(chartConfig,params),
            criminalAffairs: getCriminalAffairsData(chartConfig,params),
            criminalCaseTowHour: getCriminalCaseTowHourData(chartConfig,params),
            securityAffairs: getSecurityAffairsData(chartConfig),
            criminalCaseTrend: getCriminalCaseTrendData(chartConfig),
            params: params
        };
        $('#preview_content').html(template(exportData));
    }

    function getDate(year, month){
        var d = new Date(year, month, 0);
        return d.getDate();
    }

  function getNowDay(params) {
    var times = params.searchParams.time.split('-');
    var start = new Date(params.searchParams.year,times[0].substr(4),0).getMonth()+1;
    var end = new Date(params.searchParams.year,times[1].substr(4),0).getMonth()+1;

    var days = 0;
    for (var index = start; index <= end; index++) {
        days = eval(days+getDate(params.searchParams.year,index));
    }

    return days;
  }

    function delHtmlTag(str) {
        if(!$.isEmptyObject(str)){
            return $.trim(str.replace(/<[^>]+>/g, ""));
        }
        return; //去掉所有的html标记
    }

    window.export = function (params) {
        
        var result = $.extend(true,{
            caseAffairsCategoryImage: eval('caseAffairsCategory.getDataURL()').split(';base64,')[1],
            criminalAffairsImage: eval('criminalAffairs.getDataURL()').split(';base64,')[1],
            securityAffairsImage: eval('securityAffairs.getDataURL()').split(';base64,')[1],
            criminalCaseTowHourImage: eval('criminalCaseTowHour.getDataURL()').split(';base64,')[1],
            criminalCaseTrendImage: eval('criminalCaseTrend.getDataURL()').split(';base64,')[1],
            caseAffairsCategoryText: delHtmlTag($('#caseAffairsCategory_text').html()),
            criminalCaseTrendText: delHtmlTag($('#criminalCaseTrendText').html()),
            criminalCaseTowHourText: delHtmlTag($('#criminalCaseTowHourText').html()),
            securityAffairsText: delHtmlTag($('#securityAffairsText').html()),
            StealText: delHtmlTag($('#StealText').html()),
            AlaramText: delHtmlTag($('#AlaramText').html()),
            caseAnalysisText: delHtmlTag($('#caseAnalysisText').html()),
            title: params.searchParams.year+params.searchParams.title,
            subTitle: format.Format(new Date(), 'yyyy年MM月dd日') 
        },exportData); 

        var encrypt = $.base64.encode(encodeURIComponent(JSON.stringify(result)));
        seajs.use(['../app/common/ajax'], function (ajax) {
            ajax.downloadPost('case/stat/export/half', {
               sort: encrypt
            }, function (response) {
                var result = response.data;
              
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([result], {
                        type: 'application/octet-stream'
                    });
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", params.searchParams.year+params.searchParams.title+'警情分析.docx');
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                    console.log(ex);
                }
            });
        });
    }
    
    function loadChart(params, ajax, storeKeys, jsPath) {
        var instancePath = jsPath;
        seajs.use('../app/common/chartConfig', function (chartConfig) {
            $.each(storeKeys, function (index, ins) {
                var instance = instancePath + ins;
                //console.log('instance='+instance);
                seajs.use(instance, function (instance) {
                    instance.initialization(params, ajax, chartConfig);
                });
            });
        });
    }

    exports.preview = function (params) {
        // console.log(getCaseAffairsCategoryData());
        seajs.use(['../app/common/ajax', '../app/common/chartRender', '../app/common/chartConfig'], function (ajax, chartRender,chartConfig) {
            var prefix = 'Year';
            var jsPath = '../app/js/half/';
            var requestUrl = 'case/stat/findExportHalf';

            var tempMode = {
                caseAffairsCategory : ['1', '2'],
                securityAffairs: ['1', '2'],
                criminalAffairs: ['1', '2'],
                criminalCaseTowHour: ['1', '2'],
                criminalCaseTrend: ['1', '2']
            };

            params.searchParams.mode = JSON.stringify(tempMode);

            ajax.post(requestUrl, params, function (response) {
                 var result = response.data;
                 if (result.code <= 0) {
                     
                 } else {
                    var copyParams = $.extend(true, {}, params);
                    copyParams.searchParams.mode = ['1'];


                    // 数据本地存储
                    $.zui.store.set('caseAffairsCategoryHalf', result.caseAffairsCategory);
                    $.zui.store.set('criminalAffairsHalf', result.criminalAffairs);
                    $.zui.store.set('securityAffairsHalf', result.securityAffairs);
                    $.zui.store.set('criminalCaseTowHourHalf', result.criminalCaseTowHour);
                    $.zui.store.set('criminalCaseTrendHalf', result.criminalCaseTrend);

                    initMonthDepends(params,result,chartConfig);

                    var criminalAffairsParams = $.extend(true, {}, params);
                    criminalAffairsParams.searchParams.mode = ['1','2'];
                    loadChart(copyParams, ajax, ['caseAffairsCategory'], jsPath);
                    loadChart(criminalAffairsParams, ajax, ['criminalAffairs'],jsPath);
                    loadChart(criminalAffairsParams, ajax, ['criminalCaseTrend'],jsPath);

                    var criminalCaseTowHourParams = $.extend(true, {}, params);
                    criminalCaseTowHourParams.searchParams.mode = ['1'];
                    loadChart(criminalCaseTowHourParams, ajax, ['criminalCaseTowHour'], jsPath);

                    var securityAffairsParams = $.extend(true, {}, params);
                    securityAffairsParams.searchParams.mode = ['1','2'];
                    loadChart(securityAffairsParams, ajax, ['securityAffairs'], jsPath);
                 }
            });

        });
    }
})