define(function (require, exports, module) {
    /**
     * 更新仪表盘
     * @param {*} dashboard 
     */
    function updateDashboard(dashboard, params) {
        var allData = [];
        if (dashboard.caseAffairsCategory) {
            $.each(dashboard.caseAffairsCategory, function (index, obj) {
                //非专项查询
                if ($.isEmptyObject(params.searchParams.category)) {
                    //刑事
                    if ('1' == obj.DIC_IDENT) {
                        $('#criminal').html(obj.TOTAL)
                        $('#criminal_lable').html('刑事案件')
                    }
                    //治安
                    if ('2' == obj.DIC_IDENT) {
                        $('#security').html(obj.TOTAL)
                        $('#security_lable').html('治安案件')
                    }
                    //调节纠纷与救助
                    if ('3' == obj.DIC_IDENT) {
                        $('#others').html(obj.TOTAL)
                        $('#others_lable').html('调节纠纷与救助')
                    }
                    $('#total_lable').html('接警总量')
                }else{
                    //刑事
                    if ('1' == obj.DIC_IDENT) {
                        $('#criminal').html('0')
                        $('#criminal_lable').html('案发高峰时段')
                    }
                    //治安
                    if ('2' == obj.DIC_IDENT) {
                        $('#security').html('0')
                        $('#security_lable').html('')
                    }
                    //调节纠纷与救助
                    if ('3' == obj.DIC_IDENT) {
                        $('#others').html('0')
                        $('#others_lable').html('')
                    }            
                    $('#total_lable').html('案发总数')      
                }

                allData.push(obj.TOTAL);
            });

            ////接警总量
            $('#total').html(eval(allData.join('+')));

            //专项查询,案发高峰时段
            if (!$.isEmptyObject(params.searchParams.category)) {
                var sidOrder = dashboard.criminalCaseTowHour.sort(  
                    function(a, b)  
                    {  
                        if(a.TOTAL > b.TOTAL) return -1;  
                        if(a.TOTAL < b.TOTAL) return 1;  
                        return 0;  
                    }  
                );
                var time = sidOrder[0].DIC_NAME.split('-');
                $('#criminal').html(time[0]+':00-'+time[1]+':00');
            }
        }
    }


    /**
     * 顺序加载各个模块
     * 
     * @param {*} params 
     * @param {*} ajax 
     * @param {*} storeKeys 
     */
    function loadChart(params, ajax, storeKeys, jsPath) {
        var instancePath = jsPath;
        seajs.use('../app/common/chartConfig', function (chartConfig) {
            $.each(storeKeys, function (index, ins) {
                var instance = instancePath + ins;
                //console.log('instance='+instance);
                seajs.use(instance, function (instance) {
                    instance.initialization(params, ajax, chartConfig);
                });
            });
        });
    }

    //存储各类刑事警情查询结果
    function storeData(storeKey, indexKey, params, data) {
        var localData = $.zui.store.get(storeKey);
        //不存在
        if (!localData) {
            localData = {};
        }

        var intMode = parseInt($.trim(params.searchParams.mode));
        //本期
        if (1 == intMode) {
            //.log('本期 store='+intMode)
            localData.period = data[indexKey];
            //console.log(localData.period)
        }

        //同比
        if (2 == intMode) {
            //console.log('同比 store='+intMode)
            localData.basis = data[indexKey];
            //console.log(localData.basis)
        }
        //环比
        if (3 == intMode) {
            localData.relative = data[indexKey];
        }

        $.zui.store.set(storeKey, localData);
    }

    //获取同比
    function storeBasis(params, backParams, ajax, storeKeys, prefix, url, jsPath) {
        //params->mode:['1','2','3']
        var copyParams = $.extend(true, {}, params);
        //数据预处理:判断[同比]缓存数据
        if (-1 != $.inArray('2', params.searchParams.mode)) {
            copyParams.searchParams.mode = '2';
            ajax.post(url, copyParams, function (response) {
                exports.triggerStore(storeKeys, copyParams, response.data, prefix, url);

                storeRelative(params, backParams, ajax, storeKeys, prefix, url, jsPath);
            });
        } else {
            storeRelative(params, backParams, ajax, storeKeys, prefix, url, jsPath);
        }
    }

    //获取环比
    function storeRelative(params, backParams, ajax, storeKeys, prefix, url, jsPath) {
        //params->mode:['1','2','3']
        var copyParams = $.extend(true, {}, params);
        //数据预处理:判断[本期]缓存数据
        if (-1 != $.inArray('3', params.searchParams.mode)) {
            copyParams.searchParams.mode = '3';
            ajax.post(url, copyParams, function (response) {
                exports.triggerStore(storeKeys, copyParams, response.data, prefix, url);

                if(undefined == params.searchParams.isLoadChart){
                    loadChart(backParams, ajax, storeKeys, jsPath);
                }              
            });
        } else {
            if(undefined == params.searchParams.isLoadChart){
                loadChart(backParams, ajax, storeKeys, jsPath);
            }
        }
    }

    function storePeriod(params, backParams, ajax, storeKeys, prefix, url, jsPath) {
        var copyParams = $.extend(true, {}, params);
        var backParams = $.extend(true, {}, params);
        //默认数据预处理:判断[本期]缓存数据
        var monthIndex = $.inArray('1', params.searchParams.mode);
        if (-1 != monthIndex) {
            copyParams.searchParams.mode = '1';
            ajax.post(url, copyParams, function (response) {
                //storeCriminalAffairsMonth(keyCriminalAffairsMonth,storeKys[0],copyParams,response.data); 
                //storeCriminalAffairsMonth(keyCriminalCaseTowHourMonth,storeKys[1],copyParams,response.data); 
                exports.triggerStore(storeKeys, copyParams, response.data, prefix, url);
                params.searchParams.mode.splice(monthIndex, 1);

                console.log(params.searchParams.isUpdateDashBord);
                if(undefined == params.searchParams.isUpdateDashBord){
                    updateDashboard(response.data, params);
                }

                storeBasis(params, backParams, ajax, storeKeys, prefix, url, jsPath);
                //loadBasis(params,backParams,ajax,keyCriminalAffairsMonth,'criminalCaseTowHour');    
            });
        }
    }

    exports.triggerStore = function(storeKeys, params, data, prefix, url) {
        $.each(storeKeys, function (index, key) {
            storeData(key + prefix, key, params, data, url);
        });
    }

    /**  
     * 图存储公用对外暴露方法
     * 
     * @param {存储键值} storeKeys 
     * @param {透传参数} params 
     * @param {存储键值后缀} prefix 
     * @param {请求url} url 
     */
    exports.loadContent = function (storeKeys, params, ajax, prefix, url, jsPath) {
        //console.log(storeKeys);
        storePeriod(params, params, ajax, storeKeys, prefix, url, jsPath);
    }
})