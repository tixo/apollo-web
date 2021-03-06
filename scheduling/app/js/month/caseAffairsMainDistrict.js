/**
 * 主要案发小区
 */
define(function (require, exports, module) {
	function by(name) {
		return function (o, p) {
			var a, b;
			if (typeof o === "object" && typeof p === "object" && o && p) {
				a = o[name];
				b = p[name];
				if (a === b) {
					return 0;
				}
				if (typeof a === typeof b) {
					return a > b ? -1 : 1;
				}
				return typeof a > typeof b ? -1 : 1;
			} else {
				throw ("error");
			}
		}
	}

	function getLocalData() {
		var tempSeriesData = [];
		var yAxis = [];
		var series = [];
		//饼图没有[同比、环比]
		var locaData = $.zui.store.get('caseAffairsDistrictMonth').period;
		if (!$.isEmptyObject(locaData)) {
			$.each(locaData, function (index, data) {
				tempSeriesData.push({
					name: data.DIC_NAME,
					value: data.TOTAL
				});
			});

			var allData = tempSeriesData.sort(by("value")).slice(0, 5).reverse();

			$.each(allData, function (index, data) {
				if (index < 5) {
					yAxis.push(data.name);
					series.push(data.value);
				}
			});
		}

		console.log(yAxis);
		console.log(series);
		return {
			yAxis: yAxis,
			series: series
		}
	}

	function getConfig(data) {

		return {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['案发区域TOP5']
			},
			toolbox: {
				show: false,
				feature : {
					mark : {show: true},
					dataView : {show: true, readOnly: false},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable: true,
			xAxis: [{
				type: 'category',
				axisLabel: {
					interval: 0,
					rotate: 30,//倾斜度 -90 至 90 默认为0  
					margin: 2,
					textStyle: {
						fontWeight: "bolder",
						color: "#000000"
					}
				},
				data: data.yAxis
			}],
			// ,data: data.series
			yAxis: [{
				type: 'value'
			}],
			series: [{
				name: '案发小区TOP5',
				type: 'bar',
				data: data.series
			}]
		};

	}

	exports.initialization = function (params, ajax, chartConfig) {
		var data = getLocalData();

		var config = getConfig(data);

		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig, config, 'caseAffairsDistrictMonth', 'bar', 'caseAffairsMainDistrict');
	}
})