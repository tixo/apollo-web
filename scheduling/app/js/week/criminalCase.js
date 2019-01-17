/**
 * 各类刑事警情
 */
define(function (require, exports, module) {
	exports.initialization = function (params, ajax, chartConfig) {

		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig,null, 'criminalCaseWeek', 'line', 'criminalCase');

		var tableTpl = require('../../tpl/table.html');
		var template = Handlebars.compile(tableTpl);

		//表格模板加载
		$('#criminalCaseTable').html(template(tableData));
	}
})
