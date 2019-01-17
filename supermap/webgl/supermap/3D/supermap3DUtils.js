/**
 * 三维webgl工具类
 */
define(function(require, exports, module){
	var sceneUtil = require("./scene.js");
	var draw3DControlUtil = require("./drawControl.js");
	var measure3DUtil = require("./measure.js");
	var popup3DUtil = require("./popup.js");
	var fly3DUtil = require("./flyManager.js");
	var spatialAnalysis = require("./spatialAnalysis.js");
	var query3DUtil = require("./query.js");
	var viewshed3DUtil = require("./viewshed3D.js");
	
	var supermap3DUtils = {
		sceneUtil: sceneUtil,
		draw3DControlUtil: draw3DControlUtil,
		measure3DUtil: measure3DUtil,
		popup3DUtil: popup3DUtil,
		fly3DUtil: fly3DUtil,
		spatialAnalysis: spatialAnalysis,
		query3DUtil :query3DUtil,
		viewshed3DUtil : viewshed3DUtil
	};
	
	//给外部提供接口
	module.exports = supermap3DUtils;
	parent.window.supermap3DUtils=supermap3DUtils;
});