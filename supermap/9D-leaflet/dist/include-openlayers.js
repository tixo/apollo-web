(function () {
    var r = new RegExp("(^|(.*?\\/))(include-openlayers\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
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
        if (!inArray(excludes, 'ol')) {
            inputCSS("../../web/libs/openlayers/ol.css");
            inputScript("../../web/libs/openlayers/ol.js");
        }
        if (inArray(includes, 'mapv')) {
            inputScript("../../web/libs/mapv/mapv.min.js");
        }
        if (inArray(includes, 'turf')) {
            inputScript("../../web/libs/turf/turf.min.js");
        }
        if (!inArray(excludes, 'iclient9-openlayers')) {
            inputScript("../../dist/iclient9-openlayers.min.js");
        }
        if (!inArray(excludes, 'iclient9-openlayers-css')) {
            inputCSS("../../dist/iclient9-openlayers.min.css");
        }
        if (inArray(includes, 'echarts')) {
            inputScript("../../web/libs/echarts/echarts.min.js");
        }
        if (inArray(includes, 'osmbuildings')) {
            inputScript("../../web/libs/osmbuildings/OSMBuildings-OL3.js");
        }
        if (inArray(includes, 'animatedclusterlayer')) {
            inputScript("../../web/libs/openlayers/plugins/animatedclusterlayer/animatedclusterlayer.js");
        }
        if (inArray(includes, 'layerswitcher')) {
            inputCSS("../../web/libs/openlayers/plugins/ol3-layerswitcher/ol3-layerswitcher.css");
            inputScript("../../web/libs/openlayers/plugins/ol3-layerswitcher/ol3-layerswitcher.js");
        }
    }

    load();
    window.isLocal = true;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host;
})();
