define(function (require, exports, module) {
    var ajax = require('./ajax');
    var authorization = {};

    /**
     * 获取刑事案件子类
     * 
     * @param {*} param 
     */
    exports.getCriminalItems = function (param,resovle) {
        ajax.post('dic/info/findItemsByKey', param, resovle);
    }

    exports.initAuthorizationStore = function (authorization) {
        authorization = authorization;
    }  

    exports.getMenuTreeByUser = function (func) {
        ajax.post('/user/info/findMenuTreeByUserId/'+top.authorization.userId+'/'+top.authorization.appId, {}, func);
    }

    exports.isLogin = function (func) {
        ajax.get('/user/isLogin', {}, func);
    }
    exports.getUserName = function (func) {
        ajax.post('/user/info/findByPrimaryKey/'+top.authorization.userId, {}, func);
    }
})