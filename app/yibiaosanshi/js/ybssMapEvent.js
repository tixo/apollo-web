/**
 * 地图功能入口
 */
define(function(require, exports, module) {
	var mapInit = require("../../../supermap/map_init.js");
	var historyTrack = require("../../../supermap/plugins/historyTrack.js");
	//对外封装接口
	var ybssMapEvent = {
		mapInit:mapInit,
		historyTrack:historyTrack
	};
	module.exports = ybssMapEvent;
});
