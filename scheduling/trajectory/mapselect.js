define(['utilityForm'],function (require, exports, module) {
    var map, layer, drawPolygon, drawCircle, vecotrLayer;
    var url = top.services.baseMap;

    function addLayer() {
        map.addLayers([layer, vecotrLayer]);
        //显示地图范围
        map.setCenter(new SuperMap.LonLat(108.97, 34.16), 0);
    }
    var pointVectorList = [];

    function addData(mapDrawData) {
        $.each(mapDrawData, function (index, data) {
            var point = new SuperMap.Geometry.Point(data.pointLon, data.pointLat);
            var pointVector = new SuperMap.Feature.Vector(point);
            pointVector.attributes = {
                cameraId: data.otherIndex,
                cameraType: data.cameraLocationType,
                position: data.installationAddress,
                cameraName: data.name,
                x: data.pointLon,
                y: data.pointLat
            };
            pointVector.style = {
                graphic: true,
                externalGraphic: './tantou.gif',
                graphicWidth: 44,
                graphicHeight: 33
            };
            pointVectorList.push(pointVector);

        });
        vecotrLayer.addFeatures(pointVectorList);
    }

    var circleFeature = '';

    function drawCompleted(result) {
        circleFeature = result.feature;
        var cameraList = [];
        var cameraId = '';
        $.each(pointVectorList, function (index, feature) {
            if (result.feature.geometry.intersects(feature.geometry)) {
                cameraId = feature.attributes.cameraId;
                cameraList.push(cameraId);
            }
        });
        console.log('drawCompleted');
        console.log(cameraList);

        $('#count', window.parent.document).text(cameraList.length);
        // $('#cameraId', window.parent.document).val(cameraList.join(','));
        window.parent.cameraIds=cameraList;
    }

    function draw_polygon() {
        deactiveAll();
        drawPolygon.activate();
    }

    window.draw_polygon = draw_polygon;

    function draw_circle() {
        deactiveAll();
        if (circleFeature !== '') {
            vecotrLayer.removeFeatures(circleFeature);
        }
        drawCircle.activate();
    }
    window.draw_circle = draw_circle;

    function deactiveAll() {
        drawPolygon.deactivate();
        drawCircle.deactivate();
    }
    window.clearFeatures = clearFeatures;

    function clearFeatures() {
        deactiveAll();
        if (circleFeature !== '') {
            vecotrLayer.removeFeatures(circleFeature);
        }
    }

    seajs.use('../app/common/ajax', function (ajax) {
        //清空每次查询结果
        // $('#address').val('');
        ajax.post("camera/info/findAll", {}, function (response) {
            var result = response.data;
            $.showErrorInfo('获取摄像头信息失败');
            // alert(34);
            if (result.code >0) {



                //新建面矢量图层
                vecotrLayer = new SuperMap.Layer.Vector("polygonLayer");

                drawPolygon = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.Polygon);
                drawPolygon.events.on({
                    "featureadded": drawCompleted
                });
                drawCircle = new SuperMap.Control.DrawFeature(vecotrLayer, SuperMap.Handler.RegularPolygon, {
                    handlerOptions: {
                        sides: 150
                    }
                });
                drawCircle.events.on({
                    "featureadded": drawCompleted
                });
                map = new SuperMap.Map("map", {
                    controls: [
                        new SuperMap.Control.Zoom(),
                        new SuperMap.Control.Navigation(),
                        new SuperMap.Control.LayerSwitcher(), drawPolygon, drawCircle
                    ]
                });
                layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", url, {
                    transparent: true,
                    cacheEnabled: true
                }, {
                    maxResolution: "auto"
                });
                layer.events.on({
                    "layerInitialized": addLayer
                });

                addData(result.data);
            }else{
                $.showErrorInfo('获取摄像头信息失败');
            }
        });
    });
})