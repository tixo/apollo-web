(function() {
    var r = new RegExp("(^|(.*?\\/))(include-mapboxgl\.js)(\\?|$)"),
    s = document.getElementsByTagName('script'), targetScript;
    for(var i=0;i<s.length; i++) {
        var src = s[i].getAttribute('src');
        if(src) {
            var m = src.match(r);
            if(m) {
                targetScript =s[i];
                break;
            }
        }
    }
    function inputScript(url){
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }
    function inputCSS(url){
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }
    function inArray(arr,item){
        for (i in arr) {
            if (arr[i] == item){
                return true;
            }
        }
        return false;
    }
    //加载类库资源文件
    function load() {
        var includes=(targetScript.getAttribute('include')||"").split(",");
        var excludes=(targetScript.getAttribute('exclude')||"").split(",");
        if(!inArray(excludes,'mapbox-gl')) {
            inputCSS("../../web/libs/mapbox-gl-js/mapbox-gl.css");
            inputScript("../../web/libs/mapbox-gl-js/mapbox-gl.js");
        }
        if(inArray(includes,'draw')){
            inputCSS("../../web/libs/mapbox-gl-js/plugins/mapbox-gl-draw/mapbox-gl-draw.css");
            inputScript("../../web/libs/mapbox-gl-js/plugins/mapbox-gl-draw/mapbox-gl-draw.js");
        }
        if (inArray(includes, 'compare')) {
            inputCSS("../../web/libs/mapbox-gl-js/plugins/mapbox-gl-compare/mapbox-gl-compare.css");
            inputScript("../../web/libs/mapbox-gl-js/plugins/mapbox-gl-compare/mapbox-gl-compare.js");
        }
        if(inArray(includes,'mapv')){
            inputScript("../../web/libs/mapv/mapv.min.js");
        }
        if(inArray(includes,'echarts')){
            inputScript("../../web/libs/echarts/echarts.min.js");
            inputScript("../../web/libs/echartsLayer/EchartsLayer.js");
        }
        if (!inArray(excludes, 'iclient9-mapboxgl')) {
            inputScript("../../dist/iclient9-mapboxgl.min.js");
        }
        if(inArray(includes,'proj4')){
            inputScript("../../web/libs/proj4js/proj4.js");
        }
        if(inArray(includes,'echarts-gl')){
            inputScript("../../web/libs/echarts-gl/echarts-gl.min.js");
        }
        if(inArray(includes,'shapefile')){
            inputScript("../../web/libs/shapefile/shapefile.js");
        }
    }
    load();
    window.isLocal = true;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : 'http://' + document.location.host;
})();
