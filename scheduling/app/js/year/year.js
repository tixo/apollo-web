define(function (require, exports, module) {
    /**
     * 加载年统计方式模板和存储以及页面节点id
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
                    montTpl = require('../../tpl/year/year_office_rate.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/year/year_office_rate_special.html');
                    storeKeys = ['criminalCaseTowHour', 'caseUnitScatters', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                }

            }
            //本期模板
            else {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/year/year_office_default.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/year/year_office_default_special.html');
                    storeKeys = ['criminalCaseTowHour', 'caseUnitScatters', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsMainDistrict', 'caseAffairsHeatMap'];
                }


            }
        } else {
            //比率模板 [同比、环比]
            if (-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)) {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/year/year_place_rate.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'securityAffairs', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/year/year_place_rate_special.html');
                    storeKeys = ['caseAffairsCategory', 'criminalCaseTowHour', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                }
            }
            //本期模板
            else {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    montTpl = require('../../tpl/year/year_place_default.html');
                    storeKeys = ['caseAffairsCategory', 'criminalAffairs', 'securityAffairs', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
                } else {
                    montTpl = require('../../tpl/year/year_place_default_special.html');
                    storeKeys = ['caseAffairsCategory', 'criminalCaseTowHour', 'criminalCaseTrend', 'caseAffairsDistrict', 'caseAffairsHeatMap'];
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
            var prefix = 'Year';
            var requestUrl = 'case/stat/findYear';
            var storeKeys = initMonthDepends(params);
            chartRender.loadContent(storeKeys, params, ajax, prefix, requestUrl, './js/year/')
        });
    }
})