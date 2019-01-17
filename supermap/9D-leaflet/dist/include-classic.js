(function () {
    var r = new RegExp("(^|(.*?\\/))(include-classic\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'),baseurl, targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                baseurl = m[1];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        var excludes = (targetScript.getAttribute('exclude') || "").split(",");
        if (!inArray(excludes, 'iclient8c')) {
            inputScript(baseurl+"../web/libs/iclient8c/libs/SuperMap.Include.js");
        }
        if (inArray(includes, 'mapv')) {
            inputScript(baseurl+"../web/libs/mapv/mapv.min.js");
        }
        if (inArray(includes, 'echarts')) {
            inputScript(baseurl+"../web/libs/echarts/echarts.min.js");
        }
        if (!inArray(excludes, 'iclient-classic')) {
            inputScript(baseurl+"../dist/iclient-classic.min.js");
        }
        if (inArray(includes, 'tianditu')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/layer/Tianditu.js");
        }
        if (inArray(includes, 'echarts-all')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/echarts-all.js");
        }
        if (inArray(includes, 'baidu')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/layer/Baidu.js");
        }
        if (inArray(includes, 'OSMBuildings-SuperMap')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/OSMBuildings-SuperMap.js");
        }
        if (inArray(includes, 'D3WindMap')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/D3WindMap.js");
        }
        if (inArray(includes, 'd3')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/d3.v3.min.js");
        }
        if (inArray(includes, 'three')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/third-party/Three/ThreeWebGL.js");
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/third-party/Three/ThreeExtras.js");
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/third-party/Three/RequestAnimationFrame.js");
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/third-party/Three/Detector.js");
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/third-party/globe.js");
        }
        if (inArray(includes, 'MapToImg')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/MapToImg.js");
        }
        if (inArray(includes, 'Bar')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/graph/Bar.js");
        }
        if (inArray(includes, 'Bar3D')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/graph/Bar3D.js");
        }
        if (inArray(includes, 'Circle')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/graph/Circle.js");
        }
        if (inArray(includes, 'Line')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/graph/Line.js");
        }
        if (inArray(includes, 'Pie')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/graph/Pie.js");
        }
        if (inArray(includes, 'Point')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/graph/Point.js");
        }
        if (inArray(includes, 'Ring')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/graph/Ring.js");
        }
        if (inArray(includes, 'style')) {
            inputCSS(baseurl+"../web/libs/iclient8c/theme/default/style.css");
        }
        if (inArray(includes, 'sm-doc')) {
            inputCSS(baseurl+"../web/libs/iclient8c/examples/css/sm-doc.css");
        }
        if (inArray(includes, 'LargeFormatPrints')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/LargeFormatPrints.js");
        }
        if (inArray(includes, 'nanoscroller')) {
            inputCSS(baseurl+"../web/libs/iclient8c/examples/css/nanoscroller.css");
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/jquery.nanoscroller.min.js");
        }
        if (inArray(includes, 'infoWindow')) {
            inputCSS(baseurl+"../web/libs/iclient8c/examples/js/infoWindow/infoWindow.css");
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/infoWindow/InfoWindow.js");
        }
        if (inArray(includes, 'heatmapColorCSS')) {
            inputCSS(baseurl+"../web/libs/iclient8c/examples/css/bootstrap-responsive.min.css");
            inputCSS(baseurl+"../web/libs/iclient8c/examples/css/heatmap.css");
        }
        if (inArray(includes, 'LargeFormatPrints')) {
            inputScript(baseurl+"../libs/iclient8c/examples/js/LargeFormatPrints.js");
        }
        if (inArray(includes, 'PlottingPanel')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/plottingPanel/PlottingPanel.Include.js");
        }
        if (inArray(includes, 'bevInclude')) {
            inputScript(baseurl+"../web/libs/iclient8c/examples/js/bevInclude.js");
        }
        if (inArray(includes, 'DefaultStyleConfiguration')) {
            inputScript(baseurl+"../web/libs/iclient8c/resource/Plugins/Plotting/DefaultStyleConfiguration.js");
        }
    }

    load();
    window.isLocal = true;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host;
})();
