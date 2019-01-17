define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
  
    $('#importCase').uploader({
        url: top.fhzxApolloApi+'/police/info/import',
        headers:top.authorization,
        limitFilesCount: 1,
        filters:{
            // 只允许上传excel文件（.xls,.xlsx）
            mime_types: [
                {title: '文件', extensions: 'xls,xlsx'}
            ],
            // 最大上传文件为 10MB
            max_file_size: '10mb',
            // 不允许上传重复文件
            prevent_duplicates: false
        },
        responseHandler: function(responseObject, file) {
            var response = JSON.parse(responseObject.response);
            // 当服务器返回的文本内容包含 `'error'` 文本时视为上传失败
            if(1==response.code) {
                $('#photo').val(response.data);
            }else{
                return response.message;
            }
        }
    });

    $("#close").on("click",function(){
        parent.layer.closeAll();
    });
})