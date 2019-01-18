define(function (require, exports, module) {  
    exports.getPreviewParams = function() {
        var format = require('../../common/format');
        return {
            name:format.Format(new Date(),'yyyy年')+'统计分析'
        };
    }

    exports.getPreviewOptions = function(params) {
        var options = [];
        var unit = $.trim(params.searchParams.unit);
        if ($.isEmptyObject(unit) || 'undefined' == unit || 0 == unit.length || '1' == unit) {
            //比率模板 [同比、环比]
            if(-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)){
                //非专项查询
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters', 'criminalCaseTrend'];   
                }else{
                    options = ['criminalCaseTowHour','caseUnitScatters', 'criminalCaseTrend'];
                }
    
            }
            //本期模板
            else{
                //非专项查询
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','criminalAffairs', 'criminalCaseTowHour', 'securityAffairs', 'caseUnitScatters', 'criminalCaseTrend'];    
                }else{
                    options = ['criminalCaseTowHour','caseUnitScatters', 'criminalCaseTrend'];
                }
                
               
            }
        } else {
            //比率模板 [同比、环比]
            if(-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)){
                //非专项查询
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','criminalAffairs', 'securityAffairs', 'criminalCaseTrend'];    
                }else{
                    options = ['caseAffairsCategory','criminalCaseTowHour', 'criminalCaseTrend'];
                }
            }
            //本期模板
            else{
                //非专项查询
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','criminalAffairs', 'securityAffairs', 'criminalCaseTrend'];   
                }else{
                    options = ['caseAffairsCategory','criminalCaseTowHour', 'criminalCaseTrend'];
                }
                
            }            
        }
        return options;
    };
})