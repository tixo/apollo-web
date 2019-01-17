define(function (require, exports, module) {
    seajs.use('./formValidate', function (carValidation) {
        carValidation.initValidation();
    });

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#caseForm").valid()){
           
            var params = $.formToJson($("#caseForm").serialize());
            params.categoryName=$("#category").find("option:selected").text();
            params.subCategoryName=$("#subCategory").find("option:selected").text();
            params.disposeName=$("#disposeUnit").find("option:selected").text();
            save(params);
        }
    });

    function save(params) {
       
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('case/info/save', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存信息成功','./index.html');
                }
            });
                        
        });
    }

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