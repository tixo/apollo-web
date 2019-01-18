define(function (require, exports, module) {
    require('utilityForm');
    require('../dist/plugins/base64/jquery.base64');

    var selectedTemplate = '<div class="grid border econtainer" id="{{id}}">' +
        '<div class="closeimg" >' +
        '<i class="icon icon-eye-open" style="color:#3280fc;"></i>' +
        '</div>' +
        '<div class="imgholder">' +
        '<img src="{{src}}" class="img" />' +
        '</div>' +
        '</div>';
    //人脸图片id集合
    var captureList = [];
    // 上图数据
    var mapDrawData = {};


    function initShow() {
        var id = $.getParam('id');
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('trajectory/info/findByPrimaryKey/' + id, {}, function (response) {
                var result = response.data;
                if (result.code == 0) {
                    new $.zui.Messager(result.message, {
                        type: 'danger',
                        icon: 'bell' // 定义消息图标
                    }).show();
                } else {
                    var source = result.data.source;
                    var template = Handlebars.compile(selectedTemplate);
                    var iframeMap = document.getElementById("map_iframe").contentWindow;
                    var images = JSON.parse(result.data.params);

                    //本地上传
                    if (source == 'local') {
                        $.each(images, function (index, data) {
                            $('#targetList').append(template({
                                id: data,
                                src: data.replace('|', '')
                            }));
                            captureList.push(data);
                        });
                    }
                    // 抓拍
                    else {
                        $.each(images, function (index, data) {
                            var tempImg = data.split('|');
                            $('#targetList').append(template({
                                id: tempImg[0],
                                src: tempImg[2]
                            }));
                            captureList.push(tempImg[0]);
                        });
                    }
                    $('#targetList').children('div').each(function (index) {
                        $(this).on('click', function () {
                            var indent = $(this).attr('id');
                            if ($(this).children('div:eq(0)').find('i').hasClass('icon-eye-open')) {
                                $(this).children('div:eq(0)').find('i').removeClass('icon-eye-open');
                                $(this).children('div:eq(0)').find('i').addClass('icon-eye-close');
                                iframeMap.removeCapture(indent)
                            } else {
                                $(this).children('div:eq(0)').find('i').removeClass('icon-eye-close');
                                $(this).children('div:eq(0)').find('i').addClass('icon-eye-open');

                                iframeMap.addCapture(indent)
                            }
                        });
                    });

                    // 上图数据初始化
                    mapDrawData = JSON.parse(result.data.result);
                    showMap();
                }
            });
        });

    }

    function showMap() {
        window.captureList = captureList;
        window.mapDrawData = mapDrawData;
        $('#map_iframe').attr('src', './show_map.html');
    }
    initShow();
})