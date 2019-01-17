define(function (require, exports, module) {
    var companyValidation = require('./formValidate');
    companyValidation.initValidation();

    $('#pageClose').on('click', function () {
        window.location.href = './populationList.html';
    });

    $('#save').on('click', function () {
        if ($("#companyForm").valid()) {
            seajs.use('../app/common/ajax', function (ajax) {
                //清空每次查询结果
                // $('#address').val('');
                ajax.post("map/info/resolve", {
                    address: $('#address').val()
                }, function (response) {
                    companyValidation.queryGeometry(response.data, false);
                });
            });
        }
    })

    function initData() {
        id = $.getParam('id');
        if (!$.isEmptyObject(id)) {
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('company/info/findByPrimaryKey/' + id, {}, function (response) {
                    var result = response.data;
                    if (result.code <= 0) {
                        $.showErrorInfo('单位信息不存在');
                    } else {
                        $.setForm(JSON.stringify(result.data));
                        companyValidation.initStructureInfo(result.data.companyHouseFloorInfo,result.data.id);
                        setTimeout(function () {                        
                            $('select.chosen-select').trigger('chosen:updated');
                        }, 1000);

                    }
                });
            });
        } else {
            $.showErrorInfo('请重新选择要编辑的单位信息');
        }
    }
    initData();
})