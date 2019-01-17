define(function (require, exports, module) {
    function getCaseAffairsCategoryData(chartConfig) {
        var periodData = $.zui.store.get('caseAffairsCategoryMonth').period;
        var total = 0;
        var temp = {};
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(data.TOTAL + total);
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
        }

        var nowDay = getNowDay();
        var averageDay = (total / nowDay).toFixed(2);
        var now = $.extend(true, temp, {
            total: total,
            averageDay: averageDay
        });

        var relativeData = $.zui.store.get('caseAffairsCategoryMonth').relative;

        var relativeTotal = 0;
        var temp = {};
        if (!$.isEmptyObject(relativeData)) {
            $.each(relativeData, function (index, data) {
                relativeTotal = eval(data.TOTAL + relativeTotal);
            });
            now['relative'] = relativeTotal;
            //环比
            var percent = chartConfig.getPercent(total, relativeTotal);

            //上升
            if (percent.icon) {
                now['percent'] = '上升' + percent.data;
            } else {
                now['percent'] = '下降' + percent.data;
            }
        }

        return now;
    }

    function getCriminalCaseTowHourData(chartConfig) {
        var periodData = $.zui.store.get('criminalCaseTowHourMonth').period;
        var total = 0;
        var temp = {};
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(data.TOTAL + total);
            });
        }

        var nowDay = getNowDay();
        var averageDay = (total / nowDay).toFixed(2);
        var now = $.extend(true, temp, {
            total: total,
            averageDay: averageDay,
            table: periodData
        });
        return now;
    }

    function getCaseDetails(){
        return $.zui.store.get('caseDetailsMonth').period;
    }

    function getSecurityAffairsData(chartConfig) {
        var periodData = $.zui.store.get('securityAffairsMonth').period;
        var period = {};
        var total = 0;
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                if (data.DIC_IDENT == '2') {
                    period['security'] = data.TOTAL;
                }
                if (data.DIC_IDENT == '3') {
                    period['help'] = data.TOTAL;
                }
                total = eval(total+data.TOTAL);
            });
        }

        var relativeData = $.zui.store.get('securityAffairsMonth').relative;

        var relative = {};
        var percent = {};
        var relativeTotal = 0;
        if (!$.isEmptyObject(relativeData)) {
            $.each(relativeData, function (index, data) {
                if (data.DIC_IDENT == '2') {
                    console.log('security =' + period.security + '/' + data.TOTAL);
                    var securityPercent = chartConfig.getPercent(period.security, data.TOTAL);

                    //上升
                    if (securityPercent.icon) {
                        percent['security'] = '上升' + securityPercent.data;
                    } else {
                        percent['security'] = '下降' + securityPercent.data;
                    }

                    relative['security'] = data.TOTAL;
                }
                if (data.DIC_IDENT == '3') {
                    console.log('security =' + period.help + '/' + data.TOTAL);
                    var helpPercent = chartConfig.getPercent(period.help, data.TOTAL);

                    if (helpPercent.icon) {
                        percent['help'] = '上升' + helpPercent.data;
                    } else {
                        percent['help'] = '下降' + helpPercent.data;
                    }

                    relative['help'] = data.TOTAL;
                }
                relativeTotal = eval(relativeTotal+data.TOTAL);
            });
        }

        var comparsionText = '';
        if(total > relativeTotal){
            comparsionText = '上升';
        }else if(total == relativeTotal){
            comparsionText = '持平';
        }
        else{
            comparsionText = '下降';
        }


        return {
            period: period,
            relative: relative,
            percent: percent,
            comparsionText: comparsionText
        };
    }

    function getPercentTxt(molecule, denominator){
		var percent = 0;
		if (0 == denominator) {
			percent = molecule * 100;
		} else {
			percent = eval((molecule / denominator) * 100)
		}

		return percent.toFixed(2) + '%';;
    }

    function getAllCriminalData(){
        var periodData = $.zui.store.get('criminalMonth').period;
        console.log(periodData);
        var total = 0;
        if(!$.isEmptyObject(periodData)){
            $.each(periodData, function (index, data) {
                total = eval(total + data.TOTAL);
            });
        }

        var percent = '';

        var relativeData = $.zui.store.get('criminalMonth').relative;
        var relativeTotal = 0;
        if(!$.isEmptyObject(relativeData)){
            relativeTotal = relativeData.total;
        }

        var comparsionText = '本月刑事案件较上月'
        if(total == relativeTotal){
            comparsionText = comparsionText+'持平。';
        }else if(total > relativeTotal){
            comparsionText = comparsionText+'上升。';
        }else{
            comparsionText = comparsionText+'下降。';
        }

        var criminalAffairsMonthPeriodData = $.zui.store.get('criminalAffairsMonth').period;
        var description = [];
        var criminalAffairsTotal = 0;
        if (!$.isEmptyObject(criminalAffairsMonthPeriodData)) {
            $.each(criminalAffairsMonthPeriodData, function (index, data) {
                var tempText = data.DIC_NAME + data.TOTAL+ '起';
                description.push(tempText);
                criminalAffairsTotal = eval(criminalAffairsTotal + data.TOTAL);
            });

            percent =  criminalAffairsMonthPeriodData.length + '类案件占刑事案件总量的'+getPercentTxt(criminalAffairsTotal,total)+'。';
        }

        
        return {
            comparsion: comparsionText,
            detail: description.join('，'),
            percent: percent
        }
    }

    function getCriminalAffairsData(chartConfig) {
        var periodData = $.zui.store.get('criminalAffairsMonth').period;
        var total = 0;
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(data.TOTAL + total);
            });
        }
        var sumary = {
            period: total
        };

        var relativeData = $.zui.store.get('criminalAffairsMonth').relative;

        var relativeTotal = 0;
        var comaprsion = [];
        if (!$.isEmptyObject(relativeData)) {
            var description = [];
            $.each(relativeData, function (index, data) {
                relativeTotal = eval(data.TOTAL + relativeTotal);

                var tempPeriod = periodData[index];
                var tempPercent = chartConfig.getPercent(tempPeriod.TOTAL, data.TOTAL);

                var tempText = tempPeriod.DIC_NAME + tempPeriod.TOTAL + '起，比上月' + data.TOTAL + '起';
                var compText = "";
                if (tempPercent.icon) {
                    compText = tempPercent.data + "↑"
                    tempText = tempText + '上升' + tempPercent.data;
                } else {
                    compText = tempPercent.data + "↓"
                    tempText = tempText + '下降' + tempPercent.data;
                }
                comaprsion.push({
                    name: tempPeriod.DIC_NAME,
                    num: tempPeriod.TOTAL,
                    relative: compText
                });
                description.push(tempText);
            });
            sumary['description'] = description.join('；') + '。';
            sumary['relative'] = relativeTotal;
            //sumary环比
            var percent = chartConfig.getPercent(total, relativeTotal);

            //上升
            if (percent.icon) {
                sumary['percent'] = '上升' + percent.data;
            } else {
                sumary['percent'] = '下降' + percent.data;
            }
        }

        var basisData = $.zui.store.get('criminalAffairsMonth').basis;
        if (!$.isEmptyObject(basisData)) {
            $.each(basisData, function (index, data) {

                var tempPeriod = periodData[index];
                var tempPercent = chartConfig.getPercent(tempPeriod.TOTAL, data.TOTAL);

                var compText = "";
                if (tempPercent.icon) {
                    compText = tempPercent.data + "↑"
                } else {
                    compText = tempPercent.data + "↓"
                }
                comaprsion[index].basis = compText;
            });
        }

        sumary['criminalAffairsTable'] = comaprsion;

        console.log(sumary);
        return {
            sumary: sumary
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
    function initMonthDepends(params, data, chartConfig) {
        var montTpl = '';

        var issue = params.searchParams.issue;
        var category = params.searchParams.category;
        if (2 == issue) {
            console.log('category='+category);

            // 刑事
            if (1 == category) {
                exportData = {
                    criminalAffairs: getCriminalAffairsData(chartConfig),
                    criminal: getAllCriminalData(),
                    criminalCaseTowHour: getCriminalCaseTowHourData(chartConfig)
                };
                montTpl = require('./tpl/month_criminal.html');
            } else {
                exportData = {
                    case: getCaseDetails(),
                    securityAffairs: getSecurityAffairsData(chartConfig)
                };
                montTpl = require('./tpl/month_security.html');
            }
        }else{
            exportData = {
                caseAffairsCategory: getCaseAffairsCategoryData(chartConfig),
                criminalAffairs: getCriminalAffairsData(chartConfig),
                criminalCaseTowHour: getCriminalCaseTowHourData(chartConfig),
                securityAffairs: getSecurityAffairsData(chartConfig)
            };
            montTpl = require('./tpl/month.html');
        }
        var template = Handlebars.compile(montTpl);
        $('#preview_content').html(template(exportData));
    }


    function getNowDay() {
        var date = new Date();
        return date.getDate();
    }

    function delHtmlTag(str) {
        if (!$.isEmptyObject(str)) {
            return $.trim(str.replace(/<[^>]+>/g, ""));
        }
        return; //去掉所有的html标记
    }

    window.export = function (params) {
        var format = require('../../common/format');
        var times = params.searchParams.time;
        console.log(times.substring(0,4)+'年'+times.substring(4,6)+'月');
        var issue = params.searchParams.issue;
        var category = params.searchParams.category;

        var exportName = '';
        var tempData = {};
        if (2 == issue) {
            // 刑事
            if (1 == category) {
                tempData = {
                    caseAffairsCategoryText: delHtmlTag($('#caseAffairsCategory_text').html()),
                    criminalCaseTowHourImage: eval('criminalCaseTowHour.getDataURL()').split(';base64,')[1],
                    caseAnalysisText: delHtmlTag($('#caseAnalysisText').html()),
                    warningTips: delHtmlTag($('#warningTips').html()),
                    title: times.substring(0,4)+'年'+times.substring(4,6)+'月',
                    subTitle: format.Format(new Date(), 'yyyy年MM月dd日')
                }
                exportName = '刑事警情专刊';
            } else {
                tempData = {
                    securityAffairsImage: eval('securityAffairs.getDataURL()').split(';base64,')[1],
                    warningTips: delHtmlTag($('#warningTips').html()),
                    caseAnalysisText: delHtmlTag($('#caseAnalysisText').html()),
                    securityAffairsText: delHtmlTag($('#securityAffairsText').html()),
                    title: times.substring(0,4)+'年'+times.substring(4,6)+'月',
                    subTitle: format.Format(new Date(), 'yyyy年MM月dd日')
                }
                exportName = '治安警情专刊';
            }
        }else{
            tempData = {
                caseAffairsCategoryImage: eval('caseAffairsCategory.getDataURL()').split(';base64,')[1],
                criminalAffairsImage: eval('criminalAffairs.getDataURL()').split(';base64,')[1],
                securityAffairsImage: eval('securityAffairs.getDataURL()').split(';base64,')[1],
                criminalCaseTowHourImage: eval('criminalCaseTowHour.getDataURL()').split(';base64,')[1],
                criminalCaseTowHourText: delHtmlTag($('#criminalCaseTowHourText').html()),
                warningEffect: delHtmlTag($('#warningEffect').html()),
                warningTips: delHtmlTag($('#warningTips').html()),
                caseAnalysisText: delHtmlTag($('#caseAnalysisText').html()),
                lawersText: delHtmlTag($('#lawersText').html()),
                title: times.substring(0,4)+'年'+times.substring(4,6)+'月',
                subTitle: format.Format(new Date(), 'yyyy年MM月dd日')
            }
            exportName = '警情分析';
        }

        var result = $.extend(true, tempData, exportData);
        console.log(result);

        var encrypt = $.base64.encode(encodeURIComponent(JSON.stringify(result)));
        params.sort = encrypt;
        seajs.use(['../app/common/ajax'], function (ajax) {
            ajax.downloadPost('case/stat/export/month', params, function (response) {
                var result = response.data;

                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([result], {
                        type: 'application/octet-stream'
                    });
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", times.substring(0,4)+'年'+times.substring(4,6)+exportName+'.docx');
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
        var times = params.searchParams.time;
        var issue = params.searchParams.issue;
        var category = params.searchParams.category;

        console.log(params);
        seajs.use(['../app/common/ajax', '../app/common/chartRender', '../app/common/chartConfig'], function (ajax, chartRender, chartConfig) {
            var prefix = 'Month';
            var requestUrl = 'case/stat/findExportMonth';

            var tempMode = {
            };

            if (2 == issue) {
                if (1 == category) {
                    tempMode = {
                        criminalAffairs: ['1','3'],
                        criminal: ['1','3'],
                        criminalCaseTowHour: ['1', '3']
                    };
                } else {
                    tempMode = {
                        caseDetails: ['1'],
                        securityAffairs: ['1', '3']
                    };
                }
            }else{
                tempMode = {
                    caseAffairsCategory: ['1', '3'],
                    securityAffairs: ['1', '3'],
                    criminalAffairs: ['1', '2', '3'],
                    criminalCaseTowHour: ['1', '2', '3']
                };
            }

            params.searchParams.mode = JSON.stringify(tempMode);

            ajax.post(requestUrl, params, function (response) {
                var result = response.data;
                if (result.code <= 0) {

                } else {
                    var copyParams = $.extend(true, {}, params);
                    copyParams.searchParams.mode = ['1'];

                    console.log(result);

                    console.log(tempMode);

                    // 数据本地存储
                    $.each(tempMode, function (key, value) {
                        console.log(result[key]);
                        $.zui.store.set(key + prefix, result[key]);
                    });

                    initMonthDepends(params, result, chartConfig);

                    if (2 == issue) {
                        if (1 == category) {
                            var criminalCaseTowHourParams = $.extend(true, {}, params);
                            criminalCaseTowHourParams.searchParams.mode = ['1'];
                            loadChart(criminalCaseTowHourParams, ajax, ['criminalCaseTowHour'], '../app/js/month/');
                        } else {
                            var securityAffairsParams = $.extend(true, {}, params);
                            securityAffairsParams.searchParams.mode = ['1', '3'];
                            loadChart(securityAffairsParams, ajax, ['securityAffairs'], '../app/js/month/');
                        }
                    }else{
                        var criminalAffairsParams = $.extend(true, {}, params);
                        criminalAffairsParams.searchParams.mode = ['1', '3'];
                        loadChart(copyParams, ajax, ['caseAffairsCategory'], '../app/js/month/');
                        loadChart(criminalAffairsParams, ajax, ['criminalAffairs'], '../app/js/month/');
    
                        var criminalCaseTowHourParams = $.extend(true, {}, params);
                        criminalCaseTowHourParams.searchParams.mode = ['1'];
                        loadChart(criminalCaseTowHourParams, ajax, ['criminalCaseTowHour'], '../app/js/month/');
    
                        var securityAffairsParams = $.extend(true, {}, params);
                        securityAffairsParams.searchParams.mode = ['1', '3'];
                        loadChart(securityAffairsParams, ajax, ['securityAffairs'], '../app/js/month/');
                    }
                }
            });
        });
    }
})