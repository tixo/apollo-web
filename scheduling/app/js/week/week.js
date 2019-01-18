define(function (require, exports, module) {
    /**
     * 加载月统计方式模板和存储以及页面节点id
     * 
     * @param {请求参数} params 
     * @param {存储或节点id} storeKeys 
     * @param {页面模板名称前缀} tplSuffix 
     */
    function initMonthDepends(params) {
        var storeKeys = [];
        var montTpl = '';
        var unit = $.trim(params.searchParams.unit);
        //加载分页面模板局
        if ($.isEmptyObject(unit) || 'undefined' == unit || 0 == unit.length || '1' == unit) {
            //比率模板 [同比、环比]
            if (-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)) {
                //非专项[同比、环比] 分局
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/week/week_office_rate.html');
                    //caseUnitScatters caseEveryDayData caseAffairsCategory 'caseAffairsClassify'
                    storeKeys = ['caseUnitScatters', 'caseAffairsCategory', 'caseEveryDayData', 'criminalCase', 'securitylCase', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                } else {
                    //专项[同比环比] 分局
                    montTpl = require('../../tpl/week/week_office_rate_special.html');
                    storeKeys = ['caseUnitScatters', 'criminalCaseTowHour', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                }

            }
            //本期模板
            else {
                if ($.isEmptyObject(params.searchParams.category)) {
                    //非专项 本期 分局
                    montTpl = require('../../tpl/week/week_office_default.html');
                    storeKeys = ['caseUnitScatters', 'caseAffairsCategory', 'caseEveryDayData', 'caseAffairsClassify', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/week/week_office_default_special.html');
                    storeKeys = ['caseUnitScatters', 'criminalCaseTowHour', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                }

            }
        } else {
            //比率模板 [同比、环比]
            if (-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)) {
                if ($.isEmptyObject(params.searchParams.category)) {
                    //非专项 [同比、环比] 所
                    montTpl = require('../../tpl/week/week_place_rate.html');
                    storeKeys = ['caseEveryDayData', 'criminalCase', 'securitylCase', 'caseAffairsCategory', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/week/week_place_rate_special.html');
                    storeKeys = ['criminalCaseTowHour', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                }

            }
            //本期模板
            else {
                if ($.isEmptyObject(params.searchParams.category)) {
                    //非专项 本期 所
                    montTpl = require('../../tpl/week/week_place_default.html');
                    storeKeys = ['caseEveryDayData', 'criminalCase', 'securitylCase', 'caseAffairsCategory', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/week/week_place_default_special.html');
                    storeKeys = ['criminalCaseTowHour', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                }

            }
        }
        var template = Handlebars.compile(montTpl);

        $('#content').html(template());
        return storeKeys;
    }

    //模块默认导出方法
    exports.initialization = function (params) {
        seajs.use(['../app/common/ajax', '../app/common/chartRender'], function (ajax, chartRender) {
            var prefix = 'Week';
            var requestUrl = 'case/stat/findWeek';
            var storeKeys = initMonthDepends(params);
            chartRender.loadContent(storeKeys, params, ajax, prefix, requestUrl, './js/week/');
        });
    }
})