define(function (require, exports, module) {
	exports.initialization = function (params, ajax, chartConfig) {
        //表格列头
		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig,null, 'criminalCaseTrendYear', 'line', 'criminalCaseTrend');

		var tableTpl = require('../../tpl/table.html');
		var template = Handlebars.compile(tableTpl);

		//表格模板加载
	$('#criminalCaseTrendTable').html(template(tableData));
	}
})
