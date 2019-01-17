(function () {
    var r = new RegExp("(^|(.*?\\/))(include\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript, relativePath;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                relativePath = m[1] ? m[1].replace("js/", "") : "./";
                targetScript = s[i];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + relativePath + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + relativePath + url + '">';
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
        if (!inArray(excludes, "default")) {
            inputScript("libs/jquery/jquery.min.js");
            inputCSS("libs/bootstrap/css/bootstrap.min.css");
            inputScript("libs/bootstrap/js/bootstrap.min.js");
            inputCSS("libs/admin-lte/css/AdminLTE.min.css");
            inputCSS("libs/admin-lte/css/skins/skin-blue.min.css");
            inputCSS("libs/font-awesome/css/font-awesome.min.css");
            inputScript("libs/art-template/template-web.js");
            inputScript("libs/i18next/i18next.min.js");
            inputScript("libs/jquery-i18next/jquery-i18next.min.js");
            inputScript("libs/i18next-xhr-backend/i18nextXHRBackend.min.js");
            inputScript("js/utils.js");
        }
        if (inArray(includes, 'polyfill')) {
            inputScript("libs/es5-shim/es5-shim.min.js");
            inputScript("libs/es5-shim/es5-sham.min.js");
        }

        if (!inArray(excludes, 'common')) {
            inputCSS("css/common.css");
            inputCSS("css/header.css");
        }
        if (inArray(includes, 'g6')) {
            inputScript("libs/g6/index.js");
        }
        if (inArray(includes, 'animate.css')) {
            inputCSS("libs/animate/animate.min.css");
        }
        if (inArray(includes, 'isIntroduction')) {
            inputCSS("css/docs.css");
            inputScript("../build/deps.js");
            inputScript("introduction/NodesConversionTool.js");
            inputScript("js/docs.js");
            inputCSS("libs/highlight/default.css");
            inputScript("libs/highlight/highlight.pack.js");
            document.writeln(" <script>hljs.initHighlightingOnLoad();</script>");
        }
        if (inArray(includes, 'isFAQ')) {
            inputCSS("css/faq.css");
        }
        // for leaflet
        if (inArray(includes, 'leaflet')) {
            inputCSS("libs/leaflet/leaflet.css");
            inputScript("libs/leaflet/leaflet.js");
        }
        if (inArray(includes, 'leaflet-1.0.3')) {
            inputCSS("libs/leaflet/1.0.3/leaflet.css");
            inputScript("libs/leaflet/1.0.3/leaflet.js");
        }
        if (inArray(includes, 'iclient9-leaflet')) {
            inputScript("../dist/iclient9-leaflet.min.js");
        }
        // iClient classsic
        if (inArray(includes, 'iclient8c')) {
            inputScript("libs/iclient8c/libs/SuperMap.Include.js");
        }
        if (inArray(includes, 'mapv')) {
            inputScript("libs/mapv/mapv.min.js");
        }
        if (inArray(includes, 'iclient9-classic')) {
            inputScript("../dist/iclient-classic.min.js");
        }

        if (inArray(includes, '3dwebgl')) {
            inputCSS("libs/iClientfor3D/Widgets/widgets.css");
            inputScript("libs/iClientfor3D/Cesium.js");
        }

        // for mapboxgl
        if (inArray(includes, 'mapboxgl')) {
            inputCSS('libs/mapbox-gl-js/mapbox-gl.css');
            inputScript("libs/mapbox-gl-js/mapbox-gl.js");
        }
        if (inArray(includes, 'iclient9-mapboxgl')) {
            inputScript("../dist/iclient9-mapboxgl.min.js");
        }
        // for openlayers
        if (inArray(includes, 'openlayers')) {
            inputCSS("libs/openlayers/ol.css");
            inputScript("libs/openlayers/ol.js");
        }
        if (inArray(includes, 'iclient9-openlayers')) {
            inputScript("../dist/iclient9-openlayers.min.js");
        }
    }

    load();
    window.isLocal = true;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host;
    window.version = "9.0.1";
})();
