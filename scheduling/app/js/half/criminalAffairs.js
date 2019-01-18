/**
 * 各类刑事警情
 */
define(function (require, exports, module) {
	exports.initialization = function (params, ajax, chartConfig) {

		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig,null, 'criminalAffairsHalf', 'bar', 'criminalAffairs');

		var tableTpl = require('../../tpl/table.html');
		var template = Handlebars.compile(tableTpl);

		//表格模板加载
		$('#criminalAffairsTable').html(template(tableData));
	}
})
