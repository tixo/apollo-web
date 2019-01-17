/**
 * 地图功能入口
 */
define(function(require, exports, module) {
    //加载地图
    var mapInit = require("../../../supermap/map_init.js");

    var map = mapInit.mapAPI.map;
    var layer = mapInit.mapContent.markerLayer;

    var markers = layer.markers;


    /**
     *
     * 添加 事件marker
     */
    function addMarker(marker) {
        layer.addMarker(marker);
    }

    /**
     * 移除 指定marker
     */
    function removeMarker(id) {
        for (var i = 0; i < layer.markers.length; i++) {
            if (layer.markers[i].attr === id) {
                layer.removeMarker(layer.markers[i]);
            }
        }
    }


    /**
     * 判断marker是否存在
     */
    function isExist(id) {
        for (var i = 0; i < layer.markers.length; i++) {
            if (layer.markers[i].attr === id) {
                return true;
            }
        }
        return false;
    }

    /**
     * 根据ID获取marker
     */
    function getMarker(id) {
        for (var i = 0; i < layer.markers.length; i++) {
            if (layer.markers[i].attr === id) {
                return layer.markers[i];
            }
        }
    }

    //对外封装接口
    var syMapEvent = {
        mapInit: mapInit,
        addMarker: addMarker,
        removeMarker: removeMarker,
        getMarker:getMarker,
        isExist: isExist
    }

    module.exports = syMapEvent;
});