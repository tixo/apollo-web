define(['utilityForm'],function (require, exports, module) {
    var id = '';
    //表单验证
    seajs.use('./formValidate', function (carValidation) {
        carValidation.initValidation();
    });

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#caseForm").valid()){
            var params = $.formToJson($("#caseForm").serialize());
            params.id=id;
            params.categoryName=$("#category").find("option:selected").text();
            params.subCategoryName=$("#subCategory").find("option:selected").text();
            params.disposeName=$("#disposeUnit").find("option:selected").text();
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('case/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存车辆信息成功','./index.html');
                }
            });
                        
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use('../app/common/ajax', function (ajax) {
                ajax.post('case/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('案件信息不存在');
                    }else{  
                        if(result.data.category !== "1"){
                            $("#subCategoryDiv").css("display","none");
                        }
                        if(result.data.isLoss == "0"){
                            $("#damageMoneyDiv").css("display","block");
                            $("#lostThingsDiv").css("display","block");
                        }                   
                        $.setForm(JSON.stringify(result.data));
                        $("#category").attr("value",result.data.category);
                        $("#subCategory").attr("value",result.data.subCategory);
                        $("#disposeUnit").attr("value",result.data.disposeUnit);
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的案件信息');
        }
    }
    initData();

     //警员选择
     $('#policeOfficer').on('click', function () {
        //弹出一个iframe层
        layer.open({
            type: 2,
            title: '警员信息查询',
            maxmin: false,
            shadeClose: true, //点击遮罩关闭层
            area: ['800px', '550px'],
            content: './choice.html'
        });
    });
})