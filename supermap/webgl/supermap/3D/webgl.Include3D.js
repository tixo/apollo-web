(function() {
    var r = new RegExp("(^|(.*?\\/))(webgl.Include3D\.js)(\\?|$)"),
    s = document.getElementsByTagName('script'), baseUrl="",scriptUrls = {}, cssUrls = {};
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                baseUrl = m[1];
                break;
            }
        }
    }
    loadSM3DAPI();
    //加载类库资源文件
    function loadSM3DAPI() {
    	loadCSS(baseUrl+'Build/Cesium/Widgets/widgets.css');
    	loadCSS(baseUrl+'css/pretty.css');
    	loadCSS(baseUrl+'css/popup.css');
        loadScript(baseUrl+'Build/Cesium/Cesium.js');
        loadScript(baseUrl+'Build/Cesium/Workers/zlib.min.js');
        loadScript(baseUrl+'../../module/template.js');
        loadScript(baseUrl+'js/slider.js');
        loadScript(baseUrl+'js/tooltip.js');
    }
    function loadScript(inc){
        document.writeln('<script type="text/javascript" src="' + inc +'"><' + '/script>');
    }
    function loadCSS(inc){
        document.writeln('<link rel="stylesheet" href="' + inc +'">');
    }
})();
