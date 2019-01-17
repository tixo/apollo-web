(function () {
    var r = new RegExp("(^|(.*?\\/))(mbgl-include\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript, baseUrl;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                baseUrl = m[1];
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

    Array.prototype.contains = function (needle) {
        for (i in this) {
            if (this[i] == needle) {
                return true;
            }
        }
        return false;
    };

    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        var excludes = (targetScript.getAttribute('exclude') || "").split(",");
        inputCSS(baseUrl + "../lib/css-loader.css");
        inputCSS(baseUrl + "../style.css");
        inputScript(baseUrl + "../buildings.js");
        inputScript(baseUrl + "../traffic.js");

        if (!excludes.contains('mapbox-gl')) {
            inputCSS(baseUrl + "../lib/mapbox-gl.css");
            inputScript(baseUrl + "../lib/mapbox-gl.js");
        }
        if (includes.contains('mapv')) {
            inputScript(baseUrl + "../lib/mapv.min.js");
        }
        if (!excludes.contains('iclient9-mapboxgl')) {
            inputScript(baseUrl + "iclient9-mapboxgl.min.js");
        }
    }

    load();
})();
