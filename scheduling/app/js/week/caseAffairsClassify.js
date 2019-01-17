/**
 * 各类刑事警情
 */
define(function (require, exports, module) {
	function getLocalData(){
        var legend = [];
		var periodSeriesData=[];
		var cols=[];
		//饼图没有[同比、环比]
		var locaData = $.zui.store.get('caseAffairsClassifyWeek').period;
		legend.push(locaData[0][0].DISPOSE_NAME);
		legend.push(locaData[1][0].DISPOSE_NAME);

		var dataName = [];
		for(var i in locaData[0]){
			dataName.push(locaData[0][i].CATEGORY_NAME);
			cols.push(locaData[0][i].CATEGORY_NAME);
		}	
	
		var datas =[],tbleData=[];	
		for(var i in locaData){
				var data =[],tbDa=[];
				tbDa.push(locaData[i][0].DISPOSE_NAME);
				for(var j in locaData[i]){
					data.push(locaData[i][j].TOTAL);
					tbDa.push(locaData[i][j].TOTAL);
				} 
				datas.push(data);
				tbleData.push(tbDa);	
		}
		
		for(var i in datas){
			periodSeriesData.push({
				name:legend[i],
				type:'bar',
                data:datas[i],
                label: {
					normal: {
						show: true,
						position: 'top',
						textStyle: {
							color: 'black'
						}
					}
				}
			});
		}	  

        return {
            legend:legend,
            dataName:dataName,
			seriesData:periodSeriesData,
			tbleData:tbleData,
			cols:cols
        }
    }
	function getConfig(data){	
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: data.legend,
                bottom: 'bottom'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisLabel: {
                    interval: 0,
                    rotate: 45,//倾斜度 -90 至 90 默认为0  
                    margin: 2,
                    textStyle: {
                        fontWeight: "bolder",
                        color: "#000000"
                    }
                },
                data: data.dataName
            }],
            yAxis: [{
                type: 'value'
            }],
            series: data.seriesData,
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                        color: 'black'
                    }
                }
            }
        };
    }
	

	exports.initialization = function (params, ajax, chartConfig) {
		var data = getLocalData();
		var config = getConfig(data);
		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig,config, 'caseAffairsClassifyWeek', 'bar', 'caseAffairsClassify');
		var tableTpl = require('../../tpl/table.html');
		var template = Handlebars.compile(tableTpl);
		var tbData = {
			col:data.cols,
			tableData:data.tbleData
		};
		//表格模板加载
		$('#caseAffairsClassifyTable').html(template(tbData));
	}

})
