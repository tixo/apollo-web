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
        //加载分页面模板局
        if ($.isEmptyObject(unit) || 'undefined' == unit || 0 == unit.length || '1' == unit) {
            //比率模板 [同比、环比]
            if(-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)){
                //非专项
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','caseUnitScatters','criminalAffairs','securityAffairs','criminalCaseTowHour','criminalTrend'];
                }else{
                    options = ['caseUnitScatters','criminalCaseTowHour','criminalTrend'];
                }
                
            }
            //本期模板
            else{
                //非专项
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','caseUnitScatters','criminalAffairs','securityAffairs','criminalCaseTowHour','criminalTrend'];
                }else{
                    options = ['caseUnitScatters','criminalCaseTowHour','criminalTrend']
                }
               
            }
        } else {
            //比率模板 [同比、环比]
            if(-1 != $.inArray('2', params.searchParams.mode) || -1 != $.inArray('3', params.searchParams.mode)){
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','securityAffairs', 'criminalAffairs','criminalTrend']; 
                }else{
                    options = ['criminalTrend','criminalCaseTowHour'];
                }
                         
             }
            //本期模板
            else{
                if($.isEmptyObject(params.searchParams.category)){
                    options = ['caseAffairsCategory','securityAffairs','criminalAffairs','criminalTrend'];
                }else{
                    options = ['criminalTrend','criminalCaseTowHour'];
                }
            }            
        }
        return options;
    };
})