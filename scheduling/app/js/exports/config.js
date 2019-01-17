define(function (require, exports, module) {
    exports.getOrder = function () {
        return {
            '_1': '一',
            '_2': '二',
            '_3': '三',
            '_4': '四',
            '_5': '五',
            '_6': '六',
            '_7': '七',
            '_8': '八',
            '_9': '九',
            '_10': '十'
        };
    };

    exports.getConfig = function () {
        return {
            caseAffairsCategory: {
                title: '接处警综合统计情况',
                tpl: '本月接处警共843起，日均接警28起，比上月744起上升13%。其中刑事案件30起，治安案件1起，调解纠纷与救助812起。'
            },
            criminalAffairs: {
                title: '各类刑事案件',
                tpl: '接处警综合统计情况{{}}'
            },
            securityAffairs: {
                title: '各类治安警情',
                tpl: '接处警综合统计情况{{}}'
            },
            caseUnitScatters: {
                title: '处警单位',
                tpl: '接处警综合统计情况{{}}'
            },
            criminalCaseTowHour: {
                title: '刑事案件每小时报案数',
                tpl: '接处警综合统计情况{{}}'
            },
            criminalCaseTrend: {
                title: '刑事案件趋势图',
                tpl: '接处警综合统计情况{{}}'
            },
            caseAffairsTrend: {
                title: '案件走势图',
                tpl: '接处警综合统计情况{{}}'
            },
            criminalTrend: {
                title: '案件走势图',
                tpl: '接处警综合统计情况{{}}'
                 
            }
        }
    }
})