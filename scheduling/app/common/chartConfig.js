define(function (require, exports, module) {

	function getChartConfig(xData, seriesData, legend, customerConfig) {
		if (!$.isEmptyObject(customerConfig)) {
			return customerConfig;
		}

		return {
			tooltip: {
				trigger: 'axis',
				axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				data: legend,
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
				data: xData
			}],
			yAxis: [{
				type: 'value'
			}],
			series: seriesData,
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

	exports.refreshChartData = function (option, myChart, id) {
		if (!myChart) {
			//使用制定的配置项和数据显示图表
			myChart = echarts.init(document.getElementById(id));
		}
		myChart.setOption(option);
		eval('window.' + id + '=myChart');
		//自适应
		window.addEventListener("resize", function () {
			myChart.resize();
		});
	}

	exports.getPercent = function (molecule, denominator) {
		var result = {};
		var percent = 0;
		var icon = '';
		if (0 == denominator) {
			percent = molecule * 100;
		} else {
			percent = eval(((molecule / denominator) - 1) * 100)
		}

		if (percent < 0) {
			result.icon = false;
		} else {
			result.icon = true;
		}

		result.data = percent.toFixed(2) + '%';
		return result;
	}

	//获取图数据
	exports.loadChartAndTbale = function (params, chartConfig, customerConfig, cacheKey, chartType, chartId, tableHeads) {
		var xData = [];
		var series = [];
		var legend = [];
		var tableData = [];

		//同比百分比数据
		var basisPercent = [];
		var isBasis = false;
		//环比百分比数据
		var relativePercent = [];
		var isRelative = false;

		//同比|环比第一列显示
		var basisLable = '';
		var relativeLable = '';

		var tableCol = [];
		var criminalAffairsMonthCache = $.zui.store.get(cacheKey)

		//加载[本期]缓存数据
		if (-1 != $.inArray('1', params.searchParams.mode)) {
			var periodSeriesData = [];
			var periodData = null;
			var periodTableData = {};

			//console.log(criminalAffairsMonthCache.period);
			if (!criminalAffairsMonthCache || 'undefined' == criminalAffairsMonthCache.period) {
				new $.zui.Messager('提示消息:本期数据没有加载', {
					icon: 'bell' // 定义消息图标
				}).show();
				return;
			} else {
				periodData = criminalAffairsMonthCache.period;
			}
			$.each(periodData, function (index, data) {
				//chartx轴,table列名只填充一次
				xData.push(data.DIC_NAME);
				//var tempMap = {};
				//tempMap.name='_'+data.SUB_CATEGORY+'';
				//tempMap.label=data.DIC_NAME;
				tableCol.push(data.DIC_NAME)

				periodSeriesData.push(data.TOTAL);
				//periodTableData = $.extend(periodTableData, JSON.parse('{ "_'+data.SUB_CATEGORY+'": '+data.TOTAL+'}'));
			});

			tableData.push($.merge(['本期'], periodSeriesData));
			legend.push('本期');
			series.push({
				name: '本期',
				type: chartType,
				data: periodSeriesData,
				barWidth: 30,
				color: ['#64aac3'],
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

		//加载[同比]缓存数据
		if (-1 != $.inArray('2', params.searchParams.mode)) {
			var basisSeriesData = [];
			var basisData = null;
			var basisTableData = {};
			basisLable = '同比';
			isBasis = true;
			//console.log(criminalAffairsMonthCache.basis);
			if ($.isEmptyObject(criminalAffairsMonthCache) || 'undefined' == criminalAffairsMonthCache.basis) {
				new $.zui.Messager('提示消息:同比数据没有加载', {
					icon: 'bell' // 定义消息图标
				}).show();
				return;
			} else {

				basisData = criminalAffairsMonthCache.basis;
			}
			//basisPercent
			//同比=[(本期/上年同期)-1]*100%
			$.each(basisData, function (index, data) {
				basisSeriesData.push(data.TOTAL);
				basisPercent.push(chartConfig.getPercent(tableData[0][index + 1], data.TOTAL));
				//basisTableData = $.extend(basisTableData, JSON.parse('{ "_'+data.SUB_CATEGORY+'": '+data.TOTAL+'}'));
			});

			tableData.push($.merge(['同比'], basisSeriesData));
			legend.push('同比');
			series.push({
				name: '同比',
				type: chartType,
				data: basisSeriesData,
				barWidth: 30,
				color: ['#f55d54'],
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

		//加载[环比]缓存数据
		if (-1 != $.inArray('3', params.searchParams.mode)) {
			var relativeSeriesData = [];
			var relativData = null;
			var relativTableData = {};
			relativeLable = '环比';
			isRelative = true;

			if ($.isEmptyObject(criminalAffairsMonthCache) || 'undefined' == criminalAffairsMonthCache.relative) {
				new $.zui.Messager('提示消息:环比数据没有加载', {
					icon: 'bell' // 定义消息图标
				}).show();
			} else {
				relativData = criminalAffairsMonthCache.relative;
			}

			$.each(relativData, function (index, data) {
				relativeSeriesData.push(data.TOTAL);
				relativePercent.push(chartConfig.getPercent(tableData[0][index + 1], data.TOTAL));
				//relativTableData = $.extend(relativTableData, JSON.parse('{ "_'+data.SUB_CATEGORY+'": '+data.TOTAL+'}'));
			});
			//tableData.push(relativeSeriesData);
			tableData.push($.merge(['环比'], relativeSeriesData));
			legend.push('环比');
			series.push({
				name: '环比',
				type: chartType,
				data: relativeSeriesData,
				barWidth: 30,
				color: ['#5f3d3c'],
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

		var tempDom = document.getElementById(chartId);
		if (tempDom) {
			//刷新图数据
			chartConfig.refreshChartData(getChartConfig(xData, series, legend, customerConfig), echarts.init(tempDom), chartId);
		}

		var heads = tableCol;
		if (tableHeads) {
			heads = tableHeads;
		}
		//返回表格数据
		return {
			col: heads,
			tableData: tableData,
			isBasis: isBasis,
			basisLable: basisLable,
			basisPercent: basisPercent,
			isRelative: isRelative,
			relativeLable: relativeLable,
			relativePercent: relativePercent
		};
	}
})