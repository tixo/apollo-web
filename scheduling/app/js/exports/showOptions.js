define(function (require, exports, module) {

    /**
     * 导出路由跳转
     * 
     * @param {*} period 
     * @param {*} params 
     */
    exports.getExportOptionsPath = function (period) {
        var path = './js/exports/monthOption';
        switch (parseInt(period)) {
            case 1:
                //周统计
                path = './js/exports/weekOption';
                break;
            case 2:
                //月统计
                path = './js/exports/monthOption';
                break;
            case 3:
                //季度统计
                path = './js/exports/quarterOption';
                break;
            case 4:
                //半年统计
                path = './js/exports/halfOption';
                break;
            case 5:
                //年统计
                path = './js/exports/yearOption';
                break;
            default:
                path = './js/exports/monthOption';
        }
        return path;
    }

    /**
     * 获取预览选项
     * @param {*} params 
     */
    exports.getOptions = function (params) {
        var period = $.trim(params.searchParams.period);
        var periodArray = ['1', '2', '3', '4', '5'];
        if ($.isEmptyObject(period) || 'undefined' == period || 0 == period.length || -1 == $.inArray(period, periodArray)) {
            new $.zui.Messager('请选择正确的统计周期', {
                icon: 'bell'
            }).show();
            return;
        }

        var tpl =
            '<div class="checkbox">'
            + '<label>'
            + '<input type="checkbox" name="options" value="{{option}}">{{title}}}'
            + '</label>'
            + '</div>';
        var optionPath = this.getExportOptionsPath(period);

        seajs.use(['./js/exports/config', optionPath], function (config, optionPath) {
            var all = [];
            var tempConfig = config.getConfig();
            var template = null;
            var optionsData = optionPath.getPreviewOptions(params);
            $.each(optionsData, function (index, data) {
                template = Handlebars.compile(tpl);
                all.push(template({
                    option: data,
                    title: tempConfig[data].title
                }));
            });
            $('#export_options').html(all.join(''));
        });
    }

    /**
     * 打开预览界面
     * @param {*} params 
     * @param {*} previewOptions 
     */
    exports.loadPreview = function (params,previewOptions) {
        var period = $.trim(params.searchParams.period);
        var periodArray = ['1', '2', '3', '4', '5'];
        if ($.isEmptyObject(period) || 'undefined' == period || 0 == period.length || -1 == $.inArray(period, periodArray)) {
            new $.zui.Messager('请选择正确的统计周期', {
                icon: 'bell'
            }).show();
            return;
        }

        var optionPath = this.getExportOptionsPath(period);
        seajs.use(['./js/exports/config', optionPath], function (config, optionPath) {
            var showOptions = [];
            var tempConfig = config.getConfig();

            $.each(previewOptions, function (index, data) {
                showOptions.push({
                    value: data,
                    text: tempConfig[data].title
                });
            });

            //导出选项
            window.exports = {
                options: previewOptions,
                params: params
            };

            //弹出即全屏
            var index = layer.open({
                id: 'export_preview',
                title: '报告预览',
                type: 2,
                shade: 0.8,
                //skin: 'layui-layer-lan',
                content: top.frontHttpUrl+'/scheduling/app/preview.html',
                area: ['320px', '195px'],
                maxmin: true,
                btnAlign: 'c',
                btn: ['导出', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    //得到iframe页的窗口对象
                    var iframeWin = window[layero.find('iframe')[0]['name']];

                    //获取预览修改的文字
                    $.each(window.templateData, function (index, data) {
                        data.tpl = body.find('#' + data.key + '_tpl').text();
                    });

                    console.log(window.templateData);
                    var template = Handlebars.compile(require('../../tpl/year/year_report.tpl'));

                    var linkElement = document.createElement('a');
                    var blob = new Blob([template(window.templateData)], { type: 'application/octet-stream' });
                    var url = parent.window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", 'filename.doc');
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                    layer.closeAll();
                },
                btn2: function () {
                    console.log('取消了');
                    layer.closeAll();
                }
            });
            layer.full(index);
        });
    };
})