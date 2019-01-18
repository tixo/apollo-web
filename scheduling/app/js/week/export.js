define(function (require, exports, module) {
    var format = require('../../common/format');

    function getCaseAffairsCategoryData(chartConfig) {
        var periodData = $.zui.store.get('caseAffairsCategoryWeek').period;
        var nowDay = getNowDay();
        var total = 0;
        var temp = {
            criminal: {},
            security: {},
            help: {}
        };

        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(data.TOTAL + total);
                if (data.DIC_IDENT == '1') {
                    temp.criminal['period'] = data.TOTAL;
                }
                if (data.DIC_IDENT == '2') {
                    temp.security['period'] = data.TOTAL;
                }
                if (data.DIC_IDENT == '3') {
                    temp.help['period'] = data.TOTAL;
                }
            });
        }

        var averageDay = (total / 7).toFixed(2);
        var now = $.extend(true, temp, {
            total: total,
            averageDay: averageDay
        });

        var relativeData = $.zui.store.get('caseAffairsCategoryWeek').relative;
        
        var relativeTotal = 0;
        if (!$.isEmptyObject(relativeData)) {
            $.each(relativeData, function (index, data) {
                relativeTotal = eval(data.TOTAL+relativeTotal);
                if (data.DIC_IDENT == '1') {
                    temp.criminal['relative'] = data.TOTAL;
                    temp.criminal['minus'] = getMinus(temp.criminal['period'] ,data.TOTAL);
                }
                if (data.DIC_IDENT == '2') {
                    temp.security['relative'] = data.TOTAL;
                    temp.security['minus'] = getMinus(temp.security['period'],data.TOTAL);
                }
                if (data.DIC_IDENT == '3') {
                    temp.help['relative'] = data.TOTAL;
                    temp.help['minus'] = getMinus(temp.help['period'],data.TOTAL);
                }
            });
            now['relative'] = relativeTotal;
            now['minus'] = getMinus(total,relativeTotal);

        }
        return now;
    }

    /**
     * 差值计算
     * 
     * @param {*} sub 
     * @param {*} minu 
     */
    function getMinus(sub,minu){
        var minus = eval(sub-minu);
        var result = '';
        //差值
        if(0==minus){
            result = '持平';
        } 
        else if(minus > 0){
            result = '上升'+minus+'起';
        }
        else{
            result = '下降'+Math.abs(minus)+'起';
        }
        return result;
    }

    function getPercentTxt(chartConfig, molecule, denominator) {
        var percent = chartConfig.getPercent(molecule, denominator);
        var percentTxt = '';
        //上升
        if (percent.icon) {
            percentTxt = '上升' + percent.data;
        } else {
            percentTxt = '下降' + percent.data;
        }
        return percentTxt;
    }

    function getSecurityAffairsData(chartConfig) {
        var periodData = $.zui.store.get('securityAffairsWeek').period;
        var total = 0;
        var relativeTotal = 0;
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(total+data.TOTAL);
            });
        }

        var relativeData = $.zui.store.get('securityAffairsWeek').relative;
        if (!$.isEmptyObject(relativeData)) {
            $.each(relativeData, function (index, data) {
                relativeTotal = eval(relativeTotal+data.TOTAL);
            });
        }

        return {
            total: total,
            relativeTotal: relativeTotal,
            percent: getPercentTxt(chartConfig,total,relativeTotal)
        };
    }

    function getCriminalAffairsData(chartConfig) {
        var periodData = $.zui.store.get('criminalAffairsWeek').period;
        var total = 0;
        var description = [];
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(data.TOTAL + total);
                var tempText = data.DIC_NAME + data.TOTAL + '起';
                description.push(tempText);
            });
        }

        var relativeTotal = 0;
        var relativeData = $.zui.store.get('criminalAffairsWeek').relative;
        if (!$.isEmptyObject(relativeData)) {
            $.each(relativeData, function (index, data) {
                relativeTotal = eval(data.TOTAL + relativeTotal);
            });
        }

        return {
            average: (total / 7).toFixed(2),
            total: total,
            relativeTotal: relativeTotal,
            percent: getPercentTxt(chartConfig,total,relativeTotal),
            description: description.join('、')
        };
    }


    function getEastCaseAffairsCategoryData(chartConfig){
        var periodData = $.zui.store.get('eastCaseAffairsCategoryWeek').period;
        var relativeData = $.zui.store.get('eastCaseAffairsCategoryWeek').relative;

        var period = getWeekData(periodData);
        var relative = getWeekData(relativeData);
        
        var percent = {
            criminal: getPercentTxt(chartConfig, period.criminal, relative.criminal),
            security: getPercentTxt(chartConfig, period.security, relative.security),
            help: getPercentTxt(chartConfig, period.help, relative.help),
            all: getPercentTxt(chartConfig, period.total, relative.total)
        };
        


        return {
            period: period,
            relative: relative,
            percent: percent
        };
    }
 
    function getWeekData(source){
        var total = 0;
        var temp = {};
        $.each(source, function (index, data) {
            total = eval(data.TOTAL+total);
            if (data.DIC_IDENT == '1') {
                temp['criminal'] = data.TOTAL;
            }
            if (data.DIC_IDENT == '2') {
                temp['security'] = data.TOTAL;
            }
            if (data.DIC_IDENT == '3') {
                temp['help'] = data.TOTAL;
            }
        });
        temp['total'] = total;
        return temp;
    }

    function getQinyuCaseAffairsCategoryData(chartConfig){
        var periodData = $.zui.store.get('qinyuCaseAffairsCategoryWeek').period;
        var relativeData = $.zui.store.get('qinyuCaseAffairsCategoryWeek').relative;
        var period = getWeekData(periodData);
        var relative = getWeekData(relativeData);
        
        var percent = {
            criminal: getPercentTxt(chartConfig, period.criminal, relative.criminal),
            security: getPercentTxt(chartConfig, period.security, relative.security),
            help: getPercentTxt(chartConfig, period.help, relative.help),
            all: getPercentTxt(chartConfig, period.total, relative.total)
        };
        


        return {
            period: period,
            relative: relative,
            percent: percent
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
    function initWeekDepends(params, data, chartConfig) {
        var montTpl = '';
        montTpl = require('./tpl/week.html');
        var template = Handlebars.compile(montTpl);
        exportData = {
            caseAffairsCategory: getCaseAffairsCategoryData(chartConfig),
            criminalAffairs: getCriminalAffairsData(chartConfig),
            securityAffairs: getSecurityAffairsData(chartConfig),
            east: getEastCaseAffairsCategoryData(chartConfig),
            qinyu: getQinyuCaseAffairsCategoryData(chartConfig),
            title: params.searchParams.title
        };
        $('#preview_content').html(template(exportData));
    }


    function getNowDay() {
        var y = new Date().getFullYear();
        var isLeap = (0 === y % 4) && (0 === y % 100) || (0 === y % 400);
        return days = isLeap ? 366 : 365;
    }

    function delHtmlTag(str) {
        if (!$.isEmptyObject(str)) {
            return $.trim(str.replace(/<[^>]+>/g, ""));
        }
        return; //去掉所有的html标记
    }

    //获得本季度的开始月份
    function getQuarterStartMonth(params) {
        //当前月
        var nowMonth = new Date(params.searchParams.time).getMonth()+1;
        var quarterStartMonth = 0;
        if (nowMonth <= 3) {
            quarterStartMonth = 1;
        }
        if (3 < nowMonth && nowMonth <= 6) {
            quarterStartMonth = 4;
        }
        if (6 < nowMonth && nowMonth <= 9) {
            quarterStartMonth = 7;
        }
        if (9 < nowMonth && nowMonth <= 12) {
            quarterStartMonth = 10;
        }
        return quarterStartMonth;
    }

    //获得本季度的开始日期
    function getQuarterStartDate() {

        var quarterStartDate = new Date(new Date().getYear(), getQuarterStartMonth(), 1);
        return formatDate(quarterStartDate);
    }

    //或的本季度的结束日期
    function getQuarterEndDate() {
        var quarterEndMonth = getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(new Date().getYear(), quarterEndMonth, getMonthDays(quarterEndMonth));
        return formatDate(quarterStartDate);
    }

    window.export = function (params) {
        console.log('export');
        console.log(params);
        var result = $.extend(true, {
            caseAffairsCategoryImage: eval('caseAffairsCategory.getDataURL()').split(';base64,')[1],
            securityAffairsImage: eval('securityAffairs.getDataURL()').split(';base64,')[1],
            caseAffairsCategoryText: delHtmlTag($('#caseAffairsCategoryText').html()),
            caseAffairsCategoryCompareText: delHtmlTag($('#caseAffairsCategoryCompareText').html()),
            criminalAffairsText: delHtmlTag($('#criminalAffairsText').html()),
            securityAffairsText: delHtmlTag($('#securityAffairsText').html()),
            AlaramText: delHtmlTag($('#AlaramText').html()),
            lawersText: delHtmlTag($('#lawersText').html()),
            caseAnalysisText: delHtmlTag($('#caseAnalysisText').html()),
            warningEffectText: delHtmlTag($('#warningEffectText').html()),
            secTitle: params.searchParams.title,
            subTitle: format.Format(new Date(), 'yyyy年MM月dd日')
        }, exportData);

        var encrypt = $.base64.encode(encodeURIComponent(JSON.stringify(result)));
        seajs.use(['../app/common/ajax'], function (ajax) {
            ajax.downloadPost('case/stat/export/week', {
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
                    linkElement.setAttribute("download", params.searchParams.year+params.searchParams.title + '警情分析.docx');
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
        seajs.use(['../app/common/ajax', '../app/common/chartRender', '../app/common/chartConfig'], function (ajax, chartRender, chartConfig) {
            var prefix = 'Week';
            var jsPath = '../app/js/week/';
            var requestUrl = 'case/stat/findExportWeek';

            var tempMode = {
                caseAffairsCategory: ['1','3'],
                securityAffairs: ['1','3'],
                criminalAffairs: ['1','3']
            };

            params.searchParams.mode = JSON.stringify(tempMode);

            ajax.post(requestUrl, params, function (response) {
                var result = response.data;
                if (result.code <= 0) {

                } else {
                    var copyParams = $.extend(true, {}, params);
                    copyParams.searchParams.mode = ['1','3'];

                    // 数据本地存储
                    $.zui.store.set('caseAffairsCategoryWeek', result.caseAffairsCategory);
                    $.zui.store.set('criminalAffairsWeek', result.criminalAffairs);
                    $.zui.store.set('securityAffairsWeek', result.securityAffairs);

                    $.zui.store.set('eastCaseAffairsCategoryWeek', result.eastCaseAffairsCategory);
                    $.zui.store.set('qinyuCaseAffairsCategoryWeek', result.qinyuCaseAffairsCategory);

                    initWeekDepends(params, result, chartConfig);

                    loadChart(copyParams, ajax, ['caseAffairsCategory'], jsPath);

                    var securityAffairsParams = $.extend(true, {}, params);
                    securityAffairsParams.searchParams.mode = ['1','3'];
                    loadChart(securityAffairsParams, ajax, ['securityAffairs'], jsPath);
                }
            });

        });
    }
})