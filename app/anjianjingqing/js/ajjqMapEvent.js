/**
 * 地图功能入口
 */
define(function(require, exports, module) {
  //加载地图
  var mapInit = require("../../../supermap/map_init.js");
  var historyTrack = require("../../../supermap/plugins/historyTrack.js");

  var map = mapInit.mapAPI.map;
  var layer = mapInit.mapContent.markerLayer;
  var popup = mapInit.pluginsAPI.popup;
  var markers = layer.markers;
  var drawPolygon1 = mapInit.mapAPI.drawPolygon1;
  /**
   * 添加 事件marker
   *
   */
  function addCaseMarker(obj) {
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var lonLat = new SuperMap.LonLat(obj.X, obj.Y);
    var marker = new SuperMap.Marker(lonLat, new SuperMap.Icon(obj.img, size, offset));
    marker.attr = obj.id;
    layer.addMarker(marker);
    //例如点击marker弹出popup
    marker.events.on({
      "click": function() {
        openCaseWin(obj);
      },
      "scope": marker
    });
    var id = marker.attr;
  }

  function openCaseWin(obj) {
    $("#myFrameId").contents().find("#case" + obj.id).addClass('list-selected').siblings().removeClass('list-selected');
    var lonLat = new SuperMap.LonLat(obj.X, obj.Y);
    map.setCenter(lonLat);
    var contentHTML = template(obj.popupId, {
      content: obj
    });
    var config = {
      x: obj.X,
      y: obj.Y,
      contentHTML: contentHTML,
      width: 302,
      height: 210,
      offsetX: 0,
      offsetY: -40,
      center: false
    };
    popup.showPopup(config);
  }
  /**
   * 移除marker
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
  //对外封装接口
  var ajjqMapEvent = {
    mapInit: mapInit,
    addCaseMarker: addCaseMarker,
    removeMarker: removeMarker,
    historyTrack: historyTrack,
    isExist: isExist,
    openCaseWin: openCaseWin
  }

  module.exports = ajjqMapEvent;
});
