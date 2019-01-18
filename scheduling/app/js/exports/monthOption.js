define(function (require, exports, module) {
    exports.getPreviewParams = function () {
        var format = require('../../common/format');
        return {
            name: format.Format(new Date(), 'yyyy年MM月') + '统计分析'
        };
    }

    exports.getPreviewOptions = function (params) {
        var options = [];
        var unit = $.trim(params.searchParams.unit);
        //分局
        if ($.isEmptyObject(unit) || 'undefined' == unit || 0 == unit.length || '1' == unit) {
            //比率 [同比、环比]
            if (-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)) {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    options = ['caseAffairsCategory', 'criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters'];
                } else {
                    options = ['criminalCaseTowHour', 'caseUnitScatters', 'caseAffairsTrend'];
                }
            }
            //本期
            else {
                //非专项查询
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters'];    
                }else{
                    options = ['criminalCaseTowHour','caseUnitScatters','caseAffairsTrend'];
                }                
            }
        } else {
            //比率 [同比、环比]
            if(-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)){
                //非专项查询
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','criminalAffairs', 'securityAffairs'];    
                }else{
                    options = ['caseAffairsCategory','criminalCaseTowHour'];
                }                               
            }
            //本期
            else{
                //非专项查询
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','criminalAffairs', 'securityAffairs'];   
                }else{
                    options = ['caseAffairsCategory','criminalCaseTowHour'];
                }                
            }               
        }
        return options;
    };
})