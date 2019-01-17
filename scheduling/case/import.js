define(['validate', 'validation', 'localization', 'utilityForm'], function (require, exports, module) {
  
    $('#importCase').uploader({
        url: top.fhzxApolloApi+'/case/info/import',
        headers:top.authorization,
        limitFilesCount: 1,
        filters:{
            // 只允许上传excel文件（.xls）
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
                new $.zui.Messager('提示消息:导入成功', {
                    icon: 'bell' // 定义消息图标
                }).show();
            }else{
                new $.zui.Messager('提示消息:'+response.message, {
                    type: 'danger',
                    icon: 'bell' // 定义消息图标
                }).show();
                return 'error';
            }
        }
    });

    $("#close").on("click",function(){
        parent.layer.closeAll();
    });
})