define(function (require, exports, module) {
    var format = require('../../common/format');

    function getCaseAffairsCategoryData(chartConfig) {
        var periodData = $.zui.store.get('caseAffairsCategoryYear').period;
        var nowDay = getNowDay();
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

        var basisData = $.zui.store.get('caseAffairsCategoryYear').basis;

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

    function getCriminalCaseTowHourData(chartConfig) {
        var periodData = $.zui.store.get('criminalCaseTowHourYear').period;
        var total = 0;
        var temp = {};
		if (!$.isEmptyObject(periodData)) {
			$.each(periodData, function (index, data) {
                total = eval(data.TOTAL+total);
			});
        }
        
        var nowDay = getNowDay();
        var averageDay = (total/nowDay).toFixed(2);
        var now = $.extend(true,temp,{
            total: total,
            averageDay: averageDay,
            table: periodData
        });
        return now;
    }

    function getSecurityAffairsData(chartConfig) {
        var periodData = $.zui.store.get('securityAffairsYear').period;
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

        var relativeData = $.zui.store.get('securityAffairsYear').basis;

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

    function getCriminalAffairsData(chartConfig) {
        var periodData = $.zui.store.get('criminalAffairsYear').period;
        var total = 0;
		if (!$.isEmptyObject(periodData)) {
			$.each(periodData, function (index, data) {
                total = eval(data.TOTAL+total);
			});
        }

        var criminalAffairsTable = []
        var basisData = $.zui.store.get('criminalAffairsYear').basis;
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
            averageMonth: (total/12).toFixed(2),
            period: total,
            criminalAffairsTable: criminalAffairsTable
        };
    }

    function getCriminalCaseTrendData(chartConfig) {
        var periodData = $.zui.store.get('criminalCaseTrendYear').period;
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
    
    function getCriminalSafedData(chartConfig){
        var criminalSafe = $.zui.store.get('criminalSafeYear');
        var result = [];
        if (!$.isEmptyObject(criminalSafe)) {
			$.each(criminalSafe, function (index, data) {
                result.push({
                    name: data.DIC_NAME,
                    total: data.TOTAL,
                    min: data.MINZHAI,
                    em: data.EMOBILE,
                    lq: data.LIANGQIANG
                });
			});
        }
        return result;
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
        montTpl = require('./tpl/year.html');
        var template = Handlebars.compile(montTpl);
        exportData = {
            caseAffairsCategory: getCaseAffairsCategoryData(chartConfig),
            criminalAffairs: getCriminalAffairsData(chartConfig),
            criminalCaseTowHour: getCriminalCaseTowHourData(chartConfig),
            securityAffairs: getSecurityAffairsData(chartConfig),
            criminalCaseTrend: getCriminalCaseTrendData(chartConfig),
            safe: getCriminalSafedData(chartConfig)
        };
        $('#preview_content').html(template(exportData));
    }

    
  function getNowDay() {
    var y = new Date().getFullYear();
    var isLeap = (0===y%4) && (0===y%100) || (0===y%400);
    return days = isLeap ? 366 : 365;
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
            AlaramText: delHtmlTag($('#AlaramText').html()),
            caseAnalysisText: delHtmlTag($('#caseAnalysisText').html()),
            title: format.Format(new Date(), 'yyyy年'),
            subTitle: format.Format(new Date(), 'yyyy年MM月dd日') 
        },exportData); 

        var encrypt = $.base64.encode(encodeURIComponent(JSON.stringify(result)));
        seajs.use(['../app/common/ajax'], function (ajax) {
            ajax.downloadPost('case/stat/export/year', {
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
                    linkElement.setAttribute("download", params.searchParams.time+'年警情分析.docx');
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
            var jsPath = '../app/js/year/';
            var requestUrl = 'case/stat/findExportYear';

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

                    console.log(result);

                    // 数据本地存储
                    $.zui.store.set('caseAffairsCategoryYear', result.caseAffairsCategory);
                    $.zui.store.set('criminalAffairsYear', result.criminalAffairs);
                    $.zui.store.set('securityAffairsYear', result.securityAffairs);
                    $.zui.store.set('criminalCaseTowHourYear', result.criminalCaseTowHour);
                    $.zui.store.set('criminalCaseTrendYear', result.criminalCaseTrend);
                    $.zui.store.set('criminalSafeYear', result.criminalSafe);

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