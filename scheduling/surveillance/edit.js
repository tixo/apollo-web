define(function (require, exports, module) {
    require('utilityForm');
    var id = '';
    //表单验证
    var surveillance = require('./formValidate');
    surveillance.initValidation();

    $('#pageClose').on('click',function () {
        window.location.href = './index.html';
    });

    $('#save').on('click',function(){
        if($("#surveillanceForm").valid()){
            var params = $.formToJson($("#surveillanceForm").serialize());
            params.id=id;
            surveillance.getParams(params);
            update(params);
        }
    })

    function update(params) {
        seajs.use('../app/common/ajax', function (ajax) {
            ajax.post('surveillance/info/update', params, function (response) {
                var result = response.data;
                if(result.code <=0){
                    $.showErrorInfo(result.message);
                }else{
                    $.showSuccessTipAndGo('保存布控任务信息成功','./index.html');
                }
            });         
        });
    }

    function initData() {
        id = $.getParam('id');
        if(!$.isEmptyObject(id)){
            seajs.use(['../app/common/ajax','./formValidate'], function (ajax,surveillanceValidation) {
                ajax.post('surveillance/info/findByPrimaryKey/'+id, {}, function (response) {
                    var result = response.data;
                    if(result.code <=0){
                        $.showErrorInfo('布控信息不存在');
                    }else{                      
                        //表单    
                        result.data.beginTime = dateFormat(result.data.beginTime);
                        result.data.endTime = dateFormat(result.data.endTime);      
                        $.setForm(JSON.stringify(result.data));
                        //回显target图片
                        getBack(result.data.httpUrl,result.data.target);
                    }
                });                           
            });
        }else{
            $.showErrorInfo('请重新选择要编辑的警员信息');
        }
    }

    initData();

    //回显target图片（人脸和车牌）
    function getBack(httpUrl,target){
        for(var k = 0 ; k < target.length ; k++){
            if("face"==target[k].targetType){
                surveillance.getBackFaceImg(target[k].id,httpUrl,target[k].targetFilePath);
            }
            if("car"==target[k].targetType){
                surveillance.createCarImg(target[k].id,target[k].targetFilePath);
            }
        }
    }

     //时间格式化
    function dateFormat(longTypeDate){  
        var dateType = "";  
        var date = new Date();  
        date.setTime(longTypeDate);  
        dateType += date.getFullYear();   //年  
        dateType += "-" + getMonth(date); //月   
        dateType += "-" + getDay(date);   //日  
        dateType += " " + getHours(date);   //时
        dateType += ":" + getMinutes(date);   //分
        dateType += ":" + getSeconds(date);   //秒
        return dateType;
    } 
    //返回 01-12 的月份值   
    function getMonth(date){  
        var month = "";  
        month = date.getMonth() + 1; //getMonth()得到的月份是0-11  
        if(month<10){  
            month = "0" + month;  
        }  
        return month;  
    }  
    //返回01-30的日期  
    function getDay(date){  
        var day = "";  
        day = date.getDate();  
        if(day<10){  
            day = "0" + day;  
        }  
        return day;  
    }
    
    function getHours(date){  
        var hour = "";  
        hour = date.getHours();  
        if(hour<10){  
            hour = "0" + hour;  
        }  
        return hour;  
    }
    
    function getMinutes(date){  
        var minute = "";  
        minute = date.getMinutes();  
        if(minute<10){  
            minute = "0" + minute;  
        }  
        return minute;  
    }
    
    function getSeconds(date){  
        var second = "";  
        second = date.getSeconds();  
        if(second<10){  
            second = "0" + second;  
        }  
        return second;  
    }
})

