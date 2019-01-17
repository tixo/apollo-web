define(function (require, exports, module) {
    var id = '';
    var photo = '';
    var policeValidation = require('./formValidate');
    policeValidation.initValidation();
    $('#save').on('click', function () {
        if ($("#groupForm").valid()) {
            var params = $.formToJson($("#groupForm").serialize());
            params.id = id;
            var storeMember = $.zui.store.page;
            if(!$.isEmptyObject(storeMember)){
                var member = [];
                $.each(storeMember,function(key, value) {               // 遍历所有本地存储的条目
                    member.push(value);
                });
                params.member =  member;
            }            
            update(params);
        }
    })

    function update(params) {
        seajs.use('../../app/common/ajax', function (ajax) {
            ajax.post('force/info/update', params, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    $.showSuccessTipAndGo('更新预案信息成功', './index.html');
                }
            });

        });
    }

    function initData() {
        id = $.getParam('id');
        if (!$.isEmptyObject(id)) {
            seajs.use(['../../app/common/ajax', './formValidate'], function (ajax, policeValidation) {
                ajax.post('force/info/findByPrimaryKey/' + id, {}, function (response) {
                    var result = response.data;
                    console.log(result);
                    if (result.code <= 0) {
                        $.showErrorInfo('分组信息不存在');
                    } else {
                        //表单           
                        result.data.captainId=result.data.detail.id;
                        $.setForm(JSON.stringify(result.data));
                        var member = result.data.member;
                        if (!$.isEmptyObject(member)) {
                            $.each(member, function (index, mData) {
                                $.zui.store.pageSet(mData.detail.id, mData);
                            });
                            policeValidation.initMembers(member);
                        }
                    }
                });
            });
        } else {
            $.showErrorInfo('请重新选择要编辑的警员信息');
        }
    }


    //清除本地页面存储
    $.zui.store.pageClear();

    initData();
})