/**
 * 案件走势图
 */
define(function (require, exports, module) {
	exports.initialization = function (params, ajax, chartConfig) {

		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig,null, 'caseAffairsTrendMonth', 'line', 'caseAffairsTrend');

		var tableTpl = require('../../tpl/table.html');
		var template = Handlebars.compile(tableTpl);

		//表格模板加载
		$('#caseAffairsTrendTable').html(template(tableData));
	}
})
