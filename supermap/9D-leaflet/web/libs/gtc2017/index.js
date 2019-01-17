/*显示正在加载*/
function showLoader(text) {
    var $loader = document.getElementsByClassName('loader')[0];
    if ($loader) {
        $loader.classList.add('is-active');
        text = text || "正在加载数据";
        setLoaderText(text);
    }
}

/*设置正在加载文字*/
function setLoaderText(text) {
    var $loader = document.getElementsByClassName('loader')[0];
    if ($loader && text) {
        $loader.setAttribute("data-curtain-text", text);
    }
}

/*移除正在加载*/
function removeLoader() {
    var $loader = document.getElementsByClassName('loader')[0];
    if ($loader) {
        $loader.classList.remove('is-active');
        setLoaderText("");
    }
}


   