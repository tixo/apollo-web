/**
 * 案件类型
 */
define(function (require, exports, module) {
    function getLocalData(){
        var legend = [];
        var allData = [];
        var periodSeriesData=[];
        var tempSeriesData=[];
		//饼图没有[同比、环比]
		var locaData = $.zui.store.get('caseAffairsCategoryMonth').period;
		$.each(locaData,function(index,data){
            legend.push(data.DIC_NAME);
            
            allData.push(data.TOTAL);
			tempSeriesData.push({
				name: data.DIC_NAME,
				value: data.TOTAL
			});
        });  
        
        var allCount = eval(allData.join('+'));
        
        periodSeriesData.push({
            name: '案件类型',
            value: allCount
        });

        periodSeriesData = $.merge(periodSeriesData,allData);

        return {
            legend:legend,
            table:periodSeriesData,
            chart:tempSeriesData
        }
    }

	function getConfig(data){
		return  {
			tooltip : {
				show: true,  
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				data: data.legend,
				bottom: 'bottom'
			},
			calculable : true,
            labelLine: {
                normal: {
                    show: true
                }
            },
			series : [
				{	
                    name:'案件类型',				
					type:'pie',
					radius : '55%',
					center: ['50%', '50%'],
					data:data.chart,
					itemStyle: {  
						emphasis: {  
							shadowBlur: 10,  
							shadowOffsetX: 0,  
							shadowColor: 'rgba(0, 0, 0, 0.5)'  
						},   
					   normal:{   
							label:{   
							   show: true,   
							   formatter: '{b} : {c} ({d}%)'   
							},   
							labelLine :{show:true}  
						}  
					} 
				}
			]
		};
								
	}
	exports.initialization = function (params, ajax, chartConfig) {

		var data = getLocalData();
		var config = null;

		//本次查询不包含同比或者环比
		if(-1 == $.inArray('2',params.searchParams.mode) && -1 == $.inArray('3',params.searchParams.mode)){
			config = getConfig(data);
		}
		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig,config, 'caseAffairsCategoryMonth', 'bar', 'caseAffairsCategory');

		var tableTpl = require('../../tpl/table.html');
		var template = Handlebars.compile(tableTpl);

		//表格模板加载
		// $('#caseAffairsCategoryTable').html(template(tableData));
	}
})
