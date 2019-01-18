define(function (require, exports, module) {
    exports.getPreviewParams = function () {
        var format = require('../../common/format');
        return {
            name: format.Format(new Date(), 'yyyy年') + '统计分析'
        };
    }

    exports.getPreviewOptions = function (params) {
        var options = [];
        var unit = $.trim(params.searchParams.unit);
        //加载分局
        if ($.isEmptyObject(unit) || 'undefined' == unit || 0 == unit.length || '1' == unit) {
            //比率 [同比、环比]
            if (-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)) {
                //非专项[同比、环比] 分局
                if ($.isEmptyObject(params.searchParams.category)) {
                    options = ['caseUnitScatters', 'caseAffairsCategory', 'caseEveryDayData', 'criminalCase', 'securitylCase'];
                } else {
                    //专项[同比环比] 分局
                    options = ['caseUnitScatters', 'criminalCaseTowHour'];
                }

            }
            //本期
            else {
                if ($.isEmptyObject(params.searchParams.category)) {
                    //非专项 本期 分局
                    options = ['caseUnitScatters', 'caseAffairsCategory', 'caseEveryDayData', 'caseAffairsClassify'];
                } else {
                    options = ['caseUnitScatters', 'criminalCaseTowHour'];
                }

            }
        } else {
            //比率模板 [同比、环比]
            if (-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)) {
                if ($.isEmptyObject(params.searchParams.category)) {
                    //非专项 [同比、环比] 所
                    options = ['caseEveryDayData', 'criminalCase', 'securitylCase', 'caseAffairsCategory'];
                } else {
                    options = ['criminalCaseTowHour'];
                }

            }
            //本期模板
            else {
                if ($.isEmptyObject(params.searchParams.category)) {
                    //非专项 本期 所
                    options = ['caseEveryDayData', 'criminalCase', 'securitylCase', 'caseAffairsCategory'];
                } else {
                    options = ['criminalCaseTowHour'];
                }

            }
        }
        return options;
    };
})