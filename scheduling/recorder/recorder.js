define(function (require, exports, module) {
    require('utilityForm');
    var ajax = require('../app/common/ajax');
    var table = require('../dist/lib/table/index');

    function search() {
        table.query({
            no: $.trim($('#no').val()),
            isBind: $.trim($('#isBind').val())
        });
        // console.log($('#isBind').val());
    }

    function initSearch() {
        //查询事件绑定
        $('#policeQuery').on('click', function () {
            search();
        });
    }

    //添加警员和执法记录仪绑定关系
    function initBind() {
        $('#bind').on('click', function () {
            var tempData = [];
            var selects = table.getCurrentRow();

            if (!$.isEmptyObject(selects)) {
                if (selects.isBind == 1) {
                    $.showErrorInfo('该设备已经被绑定,请先解除与警员绑定关系');
                } else {
                    $.goTo('./form.html?id=' + selects.id);
                }
            } else {
                $.showErrorInfo('请选择要绑定的执法记录仪');
            }
        });
    }

    //解除警员和执法记录仪绑定关系
    function initUnBind() {
        $('#unBind').on('click', function () {

            var tempData = {};
            var selects = table.getCurrentRow();

            if (!$.isEmptyObject(selects)) {
                if (selects.isBind == 0) {
                    $.showErrorInfo('该设备没有被绑定,请与警员绑定');
                } else {
                    console.log(selects);
                    tempData.deviceId = selects.id;
                    tempData.deviceNo = selects.no;
                    tempData.deviceImei = selects.imei;
                    tempData.policeId = selects.police.id;
                    tempData.policeName = selects.police.name;
                    tempData.policeNo = selects.police.no;
                    $.showConfirmInfo('解除绑定', '确定要解除与警员绑定关系?', function () {
                        ajax.post('recorder/bind/retrieve', tempData, function (response) {
                            var result = response.data;
                            if (result.code <= 0) {
                                $.showErrorInfo(result.message);
                            } else {
                                search();
                            }
                        });
                        return false;
                    }, 'unlock-alt');
                }
            } else {
                $.showErrorInfo('请选择要解除绑定的执法记录仪');
            }
        });
    }

    //恢复默认查询
    function initRefresh() {
        $('#refresh').click(function () {
            console.log('ww');
            $('#queryForm')[0].reset();
            search();
        });
    }

    function initActions() {
        initSearch();
        initBind();
        initUnBind();
        initRefresh();
    }

    var tableColumns = [{
        title: '设备编号',
        key: 'no',
        sortable: 'custom',
        filterFill: 'auto',
        filters: []
    }, {
        title: '品牌',
        key: 'vender',
        sortable: 'custom',
        filterFill: 'custom',
        filters: [{
                label: 'New York',
                value: '1'
            },
            {
                label: 'London',
                value: '2'
            },
            {
                label: 'Sydney',
                value: '3'
            }
        ]
    }, {
        title: '型号',
        key: 'model',
        sortable: 'custom'
    }, {
        title: '主要参数',
        key: 'params',
        sortable: 'custom'
    }, {
        title: '绑定状态',
        key: 'isbind',
        sortable: 'custom',
        render: (h, params) => {
            var target = params.row.isBind;
            if (0 == target) {
                return '未绑定';
            }
            return h('a', {
                props: {
                    type: 'primary'
                },
                on: {
                    // mouseenter: () => {
                    //     var tt =
                    //         '<div class="checkbox">' +
                    //         ' <label>' +
                    //         '姓名：' + params.row.police.name +
                    //         '</label>' +
                    //         '</div>' +
                    //         '<div class="checkbox">' +
                    //         ' <label>' +
                    //         '警号：' + params.row.police.no +
                    //         '</label>' +
                    //         '</div>' +
                    //         '<div class="checkbox">' +
                    //         ' <label>' +
                    //         '联系电话：' + params.row.police.telephone +
                    //         '</label>' +
                    //         '</div>';
                    //     layer.closeAll();
                    //     layer.open({
                    //         id: 'export_preview',
                    //         title: false,
                    //         type: 1,
                    //         shadeClose: true,
                    //         shade: [0.1, '#fff'], //0.1透明度的白色背景
                    //         scrollbar: false,
                    //         mode: 0,
                    //         content: html_encode(tt),
                    //         area: ['200px', '160px'],
                    //         btnAlign: 'c',
                    //         btn: ['解除', '关闭'],
                    //         yes: function (index, layero) {
                    //             initUnBind();
                    //             layer.closeAll();
                    //         }
                    //     });
                    // }
                }
            }, params.row.police.name);
        }
    }];

    function unBind(str) {

    }

    function html_encode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, ">");
        s = s.replace(/</g, "<");
        s = s.replace(/>/g, ">");
        s = s.replace(/ /g, " ");
        s = s.replace(/\'/g, "'");
        s = s.replace(/\"/g, "\"");
        s = s.replace(/\n/g, "<br>");
        return s;
    }

    //模块默认初始化方法
    function initialization() {
        table.initialization('tableView', 'recorder/bind/findPage', tableColumns, ajax, {
            showCheckbox: false,
            highlightRow: true
        });
        initActions();
    }
    initialization();
})