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
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/quarter/quarter_office_rate.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/quarter/quarter_office_rate_special.html');
                    storeKeys = ['criminalCaseTowHour', 'caseUnitScatters', 'caseAffairsTrend', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                }

            }
            //本期模板
            else {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/quarter/quarter_office_default.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/quarter/quarter_office_default_special.html');
                    storeKeys = ['criminalCaseTowHour', 'caseUnitScatters', 'caseAffairsTrend', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                }


            }
        } else {
            //比率模板 [同比、环比]
            if (-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)) {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/quarter/quarter_place_rate.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'securityAffairs', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/quarter/quarter_place_rate_special.html');
                    storeKeys = ['caseAffairsCategory', 'criminalCaseTowHour', 'caseAffairsTrend', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                }
            }
            //本期模板
            else {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/quarter/quarter_place_default.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'securityAffairs', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/quarter/quarter_place_default_special.html');
                    storeKeys = ['caseAffairsCategory', 'criminalCaseTowHour', 'caseAffairsTrend', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
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
            var prefix = 'Quarter';
            var requestUrl = 'case/stat/findQuarter';
            var storeKeys = initMonthDepends(params);
            chartRender.loadContent(storeKeys, params, ajax, prefix, requestUrl, './js/quarter/')
        });
    }
})