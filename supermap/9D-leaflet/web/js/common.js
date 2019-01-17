$(document).ready(function () {
    initI18N();
    bindEvents();

    function initI18N() {
        var path = getCommonScriptPath();
        var lan = utils.getLanguage();
        i18next
            .use(i18nextXHRBackend)
            .init({
                lng: lan,
                whitelist: ["zh-CN", "en-US"],//语言列表，跟locales下的目录名对应
                ns: "resources",//locales下的json文件名称
                defaultNS: "resources",//locales下的json文件名称
                fallbackLng: "zh-CN",//默认语言
                backend: {
                    loadPath: path + './locales/{{lng}}/{{ns}}.json'
                }
            }, function (err, t) {
                localize();
                jqueryI18next.init(i18next, $);
                $(".nav").localize();//翻译nav下所有的文档

                resetCurrentVersionLink();
            });
    }

    //重置当前版本链接,不带版本号
    function resetCurrentVersionLink() {
        if (!window.version) {
            return;
        }
        var version = window.version;
        version = version.toString();
        $(".icl-nav-version").each(function (key, item) {
            if (item.href) {
                var reg = new RegExp("(.*)\/(" + version + ")(\/.*)");
                var match = item.href.match(reg);
                if (match && match[1] && match[3]) {
                    item.href = match[1] + match[3];
                }
            }
        });
    }

    function bindEvents() {
        $('.icl-header').on('click', '.lang-option', function () {
            var value = $(this).data('lang');
            utils && utils.setLanguage(value);

            localize();
        });

    }

    function localize() {
        var lang = utils.getLanguage();
        var pathname = window.location.pathname.replace("/en/", "/");
        var href = window.location.origin + pathname;
        if (lang === "en-US") {

            if (pathname === "/") {
                href = window.location.origin + "/en/web/index.html"
            } else {
                if (getVersion()) {
                    // href = window.location.origin + pathname.replace(/([^\/]*\/){1}([^\/]*)/, '$1$2/en');
                    href = window.location.origin + pathname.replace(/([^\/]*\/){2}([^\/]*)/, '/$1$2/en');
                } else if(window.isLocal) {
                    href = window.location.origin + pathname.replace(/(([^\/]*\/){3})([^\/]*)/,'$1$3/en')
                } else {
                    //href = window.location.origin + pathname.replace(/([^\/]*\/){1}([^\/]*)/, '/en/$2');
                    href = window.location.origin + pathname.replace(/([^\/]*\/){1}([^\/]*)/, '/$2/en');
                }

            }
        }
		console.log(window.location.origin + window.location.pathname);
		console.log("aaaaaa");
		console.log(href);
        if ((window.location.origin + window.location.pathname) === href) {
            return;
        }
        window.location = href;
    }

    function getVersion() {
        var pathname = window.location.pathname.replace("/en/", "/");
        var match = pathname.match(/([^\/]*\/){2}([^\/]*)/);
        if (match && match[2]) {
            var versionReg = match[2].match(/dev|^(.*)\.(.*)$/);//匹配版本:dev/9.0.0
            if (versionReg) {
                return match[2];
            }
        }
        return null;
    }

    function getCommonScriptPath() {
        var r = new RegExp("(^|(.*?\\/))(common\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'), relativePath;
        for (var i = 0; i < s.length; i++) {
            var src = s[i].getAttribute('src');
            if (src) {
                var m = src.match(r);
                if (m) {
                    relativePath = m[1] ? m[1].replace("js/", "") : "./";
                    break;
                }
            }
        }
        return relativePath;
    }

});