(function () {
    var r = new RegExp("(^|(.*?\\/))(include-leaflet\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript,baseurl;
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
        if (!inArray(excludes, 'leaflet')) {
            inputCSS(baseurl+"../web/libs/leaflet/leaflet.css");
            inputScript(baseurl+"../web/libs/leaflet/leaflet.js");
        }
        if (inArray(includes, 'mapv')) {
            inputScript(baseurl+"../web/libs/mapv/mapv.min.js");
        }
        if (inArray(includes, 'turf')) {
            inputScript(baseurl+"../web/libs/turf/turf.min.js");
        }
        if (inArray(includes, 'echarts')) {
            inputScript(baseurl+"../web/libs/echarts/echarts.min.js");
        }
        if (inArray(includes, 'd3')) {
            inputScript(baseurl+"../web/libs/d3/d3.min.js");
        }
        if (inArray(includes, 'd3-hexbin')) {
            inputScript(baseurl+"../web/libs/d3/d3-hexbin.v0.2.min.js");
        }
        if (inArray(includes, 'd3Layer')) {
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet.d3Layer/leaflet-d3Layer.min.js");
        }
        if (inArray(includes, 'elasticsearch')) {
            inputScript(baseurl+"../web/libs/elasticsearch/elasticsearch.min.js");
        }
        if (!inArray(excludes, 'iclient9-leaflet')) {
            inputScript(baseurl+"../dist/iclient9-leaflet.min.js");
        }
        if (inArray(includes, 'iclient9-leaflet-css')) {
            inputCSS(baseurl+"../dist/iclient9-leaflet.min.css");
        }
        if (inArray(includes, 'leaflet.heat')) {
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet.heat/leaflet-heat.js");
        }
        if (inArray(includes, 'osmbuildings')) {
            inputScript(baseurl+"../web/libs/osmbuildings/OSMBuildings-Leaflet.js");
        }
        if (inArray(includes, 'leaflet.markercluster')) {
            inputCSS(baseurl+"../web/libs/leaflet/plugins/leaflet.markercluster/MarkerCluster.Default.css");
            inputCSS(baseurl+"../web/libs/leaflet/plugins/leaflet.markercluster/MarkerCluster.css");
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet.markercluster/leaflet.markercluster.js");
        }
        if (inArray(includes, 'leaflet-icon-pulse')) {
            inputCSS(baseurl+"../web/libs/leaflet/plugins/leaflet-icon-pulse/L.Icon.Pulse.css");
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet-icon-pulse/L.Icon.Pulse.js");
        }
        if (inArray(includes, 'leaflet.draw')) {
            inputCSS(baseurl+"../web/libs/leaflet/plugins/leaflet.draw/leaflet.draw.css");
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet.draw/leaflet.draw.js");
        }
        if (inArray(includes, 'leaflet.pm')) {
            inputCSS(baseurl+"../web/libs/leaflet/plugins/leaflet.pm/leaflet.pm.min.css");
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet.pm/leaflet.pm.min.js");
        }
        if (inArray(includes, 'leaflet.miniMap')) {
            inputCSS(baseurl+"../web/libs/leaflet/plugins/leaflet-miniMap/dist/Control.MiniMap.min.css");
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet-miniMap/dist/Control.MiniMap.min.js");
        }
        if (inArray(includes, 'leaflet.sidebyside')) {
            inputScript(baseurl+"../web/libs/leaflet/plugins/leaflet-side-by-side/leaflet-side-by-side.min.js");
        }
    }

    load();
    window.isLocal = true;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host;
})();
