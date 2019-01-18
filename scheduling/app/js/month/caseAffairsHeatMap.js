/**
 * 热力图
 */
define(function (require, exports, module) {
	function getLocalData() {
		return $.zui.store.get('caseAffairsHeatMapMonth').period;
	}

	exports.initialization = function (params, ajax, chartConfig) {
		window.heatPoints = getLocalData();
		$('#heatMap').attr('src', top.frontHttpUrl + 'scheduling/app/heatmap.html');
	}
})