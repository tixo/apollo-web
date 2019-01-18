define(["utilityForm"],function (require, exports, module) {
    exports.routes = function () {
        if($.isEmpty($.getParam('id'))){
            seajs.use('./add.js',function(add){
                add.initialization($.getParam('type'));
            });
        }else{
            seajs.use('./edit.js',function(edit){
                edit.initialization($.getParam('type'));
            });
        }
    }
})