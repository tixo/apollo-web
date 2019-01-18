define(function (require, exports, module) {
    var format = require('../../common/format');

    function getCaseAffairsCategoryData(chartConfig) {
        var periodData = $.zui.store.get('caseAffairsCategoryQuarter').period;
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

        var averageDay = (total / nowDay).toFixed(2);
        var now = $.extend(true, temp, {
            total: total,
            averageDay: averageDay
        });

        return now;
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

    function getCriminalCaseTowHourData(chartConfig) {
        var periodData = $.zui.store.get('criminalCaseTowHourQuarter').period;
        var total = 0;
        var temp = {};
        var tableData = [];
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(data.TOTAL + total);
                tableData.push({
                    name: data.DIC_NAME,
                    total: data.TOTAL
                });
            });
        }

        var nowDay = getNowDay();
        var averageDay = (total / nowDay).toFixed(2);
        var now = $.extend(true, temp, {
            total: total,
            averageDay: averageDay,
            table: tableData
        });
        return now;
    }

    function getSecurityAffairsData(chartConfig) {
        var periodData = $.zui.store.get('securityAffairsQuarter').period;
        var period = {};
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                if (data.DIC_IDENT == '2') {
                    period['security'] = data.TOTAL;
                }
                if (data.DIC_IDENT == '3') {
                    period['help'] = data.TOTAL;
                }
            });
        }

        return {
            period: period
        };
    }

    function getCriminalAffairsData(chartConfig) {
        var periodData = $.zui.store.get('criminalAffairsQuarter').period;
        var total = 0;
        var description = [];
        var criminalAffairsTable = []
        if (!$.isEmptyObject(periodData)) {
            $.each(periodData, function (index, data) {
                total = eval(data.TOTAL + total);
                var tempText = data.DIC_NAME + data.TOTAL + '起';
                description.push(tempText);
                criminalAffairsTable.push({
                    name: data.DIC_NAME,
                    total: data.TOTAL
                });
            });
        }

        return {
            averageMonth: (total / 12).toFixed(2),
            total: total,
            description: description.join('、'),
            criminalAffairsTable: criminalAffairsTable
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
    function initQuarterDepends(params, data, chartConfig) {
        var montTpl = '';
        montTpl = require('./tpl/quarter.html');
        var template = Handlebars.compile(montTpl);
        exportData = {
            caseAffairsCategory: getCaseAffairsCategoryData(chartConfig),
            criminalAffairs: getCriminalAffairsData(chartConfig),
            criminalCaseTowHour: getCriminalCaseTowHourData(chartConfig),
            securityAffairs: getSecurityAffairsData(chartConfig)
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

        var result = $.extend(true, {
            caseAffairsCategoryImage: eval('caseAffairsCategory.getDataURL()').split(';base64,')[1],
            securityAffairsImage: eval('securityAffairs.getDataURL()').split(';base64,')[1],
            criminalCaseTowHourImage: eval('criminalCaseTowHour.getDataURL()').split(';base64,')[1],
            caseAffairsCategoryText: delHtmlTag($('#caseAffairsCategoryText').html()),
            criminalAffairsText: delHtmlTag($('#criminalAffairsText').html()),
            criminalCaseTowHourText: delHtmlTag($('#criminalCaseTowHourText').html()),
            securityAffairsText: delHtmlTag($('#securityAffairsText').html()),
            AlaramText: delHtmlTag($('#AlaramText').html()),
            caseAnalysisText: delHtmlTag($('#caseAnalysisText').html()),
            title: params.searchParams.title,
            secTitle: format.Format(new Date(params.searchParams.time), 'yyyy年')+getQuarterStartMonth(params)+'-'+eval(getQuarterStartMonth(params)+2)+'月',
            subTitle: format.Format(new Date(), 'yyyy年MM月dd日')
        }, exportData);

        var encrypt = $.base64.encode(encodeURIComponent(JSON.stringify(result)));
        seajs.use(['../app/common/ajax'], function (ajax) {
            ajax.downloadPost('case/stat/export/quarter', {
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
                    linkElement.setAttribute("download", params.searchParams.year +'年'+ params.searchParams.title +'警情分析.docx');
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
        console.log(params);
        // console.log(getCaseAffairsCategoryData());
        seajs.use(['../app/common/ajax', '../app/common/chartRender', '../app/common/chartConfig'], function (ajax, chartRender, chartConfig) {
            var prefix = 'Quarter';
            var jsPath = '../app/js/quarter/';
            var requestUrl = 'case/stat/findExportQuarter';

            var tempMode = {
                caseAffairsCategory: ['1'],
                securityAffairs: ['1'],
                criminalAffairs: ['1'],
                criminalCaseTowHour: ['1']
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
                    $.zui.store.set('caseAffairsCategoryQuarter', result.caseAffairsCategory);
                    $.zui.store.set('criminalAffairsQuarter', result.criminalAffairs);
                    $.zui.store.set('securityAffairsQuarter', result.securityAffairs);
                    $.zui.store.set('criminalCaseTowHourQuarter', result.criminalCaseTowHour);

                    initQuarterDepends(params, result, chartConfig);

                    loadChart(copyParams, ajax, ['caseAffairsCategory'], jsPath);

                    var criminalCaseTowHourParams = $.extend(true, {}, params);
                    criminalCaseTowHourParams.searchParams.mode = ['1'];
                    loadChart(criminalCaseTowHourParams, ajax, ['criminalCaseTowHour'], jsPath);

                    var securityAffairsParams = $.extend(true, {}, params);
                    securityAffairsParams.searchParams.mode = ['1'];
                    loadChart(securityAffairsParams, ajax, ['securityAffairs'], jsPath);
                }
            });

        });
    }
})