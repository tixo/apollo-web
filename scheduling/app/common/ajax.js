define(['../../dist/plugins/axios/axios.min.js','../../dist/js/zui.min.js'],function (require, exports, module) {
    var headers = top.authorization;
    // axios.defaults.retry = 4;
    // axios.defaults.retryDelay = 1000;
    axios.defaults.timeout =  60000000;
    function createAxios(config) {
        var localConfig = {
            baseURL: top.fhzxApolloApi,
            headers: top.authorization,         
            withCredentials: true
        };
        if (config) {
            localConfig = $.extend(localConfig, config);
        }
        var instance = axios.create(localConfig);

        //请求发送之前
        instance.interceptors.request.use(
            function (config) {
                // console.log(JSON.stringify(config)+'---');
                // if($.isEmptyObject(config.headers.userId) || $.isEmptyObject(config.headers.userToken)){
                //     top.window.location.href = baseURL+'login?redirectUrl='+ window.location.href;
                // }                
                return config
            },
            function (error) {
                console.log(error);
                // Do something with request error
                return Promise.reject(error)
            }
        )

        /*
        axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
            var config = err.config;
            // If config does not exist or the retry option is not set, reject
            if(!config || !config.retry) return Promise.reject(err);
            
            // Set the variable for keeping track of the retry count
            config.__retryCount = config.__retryCount || 0;
            
            // Check if we've maxed out the total number of retries
            if(config.__retryCount >= config.retry) {
                // Reject with the error
                return Promise.reject(err);
            }
            
            // Increase the retry count
            config.__retryCount += 1;
            
            // Create new promise to handle exponential backoff
            var backoff = new Promise(function(resolve) {
                setTimeout(function() {
                    resolve();
                }, config.retryDelay || 1);
            });
            
            // Return the promise in which recalls axios to retry the request
            return backoff.then(function() {
                return axios(config);
            });
        });*/

        //返回响应之前
        instance.interceptors.response.use(
            function (res) {
                if (!$.isEmptyObject(res.headers.userId) && !$.isEmptyObject(res.headers.userId)) {
                    headers.userId = res.headers.userId;
                    headers.userToken = res.headers.userToken;
                }
                return res
            },
            function (res) {
                // console.log(res);
                // vm.$Spiner.finish()
                // if (res.response.data.code === '0') {
                //     if (res.response.data.message.indexOf('重新登录') > 0) {
                //         // window.location.href = global.loginHost + '/login'
                //     }
                //     vm.$Message.warning(res.response.data.message, 5)
                // }
                return Promise.reject(res)
            }
        )
        return instance;
    }


    exports.post = function (url, params, funcOkReponse, funcErrorReponse) {
        if (!funcOkReponse) {
            funcOkReponse = function (response) {
                console.log(response);
            }
        }

        if (!funcErrorReponse) {
            funcErrorReponse = function (error) {
                console.log(error);
                new $.zui.Messager('提示消息:系统异常', {
                    type: 'danger',
                    icon: 'bell' // 定义消息图标
                }).show();
            }
        }

        createAxios().post(url, params).then(funcOkReponse).catch(funcErrorReponse);
    }

    exports.get = function (url, params, funcOkReponse, funcErrorReponse) {
        if (!funcOkReponse) {
            funcOkReponse = function (response) {
                console.log(response);
            }
        }

        if (!funcErrorReponse) {
            funcErrorReponse = function (error) {
                console.log(error);
                new $.zui.Messager('提示消息:系统异常', {
                    icon: 'bell' // 定义消息图标
                }).show();
            }
        }

        createAxios().get(url, params).then(funcOkReponse).catch(funcErrorReponse);
    }

    exports.download = function (url, params, funcOkReponse, funcErrorReponse) {
        if (!funcOkReponse) {
            funcOkReponse = function (response) {
                console.log(response);
            }
        }

        if (!funcErrorReponse) {
            funcErrorReponse = function (error) {
                console.log(error);
                new $.zui.Messager('提示消息:系统异常', {
                    icon: 'bell' // 定义消息图标
                }).show();
            }
        }

        createAxios({
            responseType: 'arraybuffer'
        }).get(url, params).then(funcOkReponse).catch(funcErrorReponse);
    }

    exports.downloadPost = function (url, params, funcOkReponse, funcErrorReponse) {
        if (!funcOkReponse) {
            funcOkReponse = function (response) {
                console.log(response);
            }
        }

        if (!funcErrorReponse) {
            funcErrorReponse = function (error) {
                console.log(error);
                new $.zui.Messager('提示消息:系统异常', {
                    icon: 'bell' // 定义消息图标
                }).show();
            }
        }

        createAxios({
            responseType: 'arraybuffer'
        }).post(url, params).then(funcOkReponse).catch(funcErrorReponse);
    }

    exports.getUrl = function () {
        return top.fhzxApolloApi;
    }
})