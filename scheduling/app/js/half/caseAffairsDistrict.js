/**
 * 小区案发分布
 */
define(function (require, exports, module) {
	exports.initialization = function (params, ajax, chartConfig) {

		//数据拼接
		var tableData = chartConfig.loadChartAndTbale(params, chartConfig,null, 'caseAffairsDistrictHalf', 'bar', 'caseAffairsDistrict');
	}
})