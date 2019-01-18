define(function (require, exports, module) {
    var populationValidation = require('./formValidate');
    populationValidation.initValidation();

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
                    populationValidation.queryGeometry(response.data,true);
                });
            });
        }
    });
})