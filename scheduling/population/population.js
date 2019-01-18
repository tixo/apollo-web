define(function (require, exports, module) {
    function initPolitical(politicalData) {
        var lable = [];

        $.each(politicalData,function(index,data){
            lable.push(data['name']);
        });
        //政治面貌
        var political = echarts.init(document.getElementById('political'));
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: lable
            },
            series: [{
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: politicalData
            }]
        };
        political.setOption(option);
    }

    function createRandomItemStyle() {
        return {
            normal: {
                color: 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                ].join(',') + ')'
            }
        };
    }

    function initNation(nationData){
        var tempNation = [];
        $.each(nationData,function(index,data){
            data.textStyle= createRandomItemStyle();
            tempNation.push(data);
        });

        var populationNation = echarts.init(document.getElementById('populationNation'));
        var option = {

            tooltip: {
                show: true
            },
            series: [{
                type: 'wordCloud',
                shape: 'circle', //平滑  
                gridSize: 20, //网格尺寸  
                size: ['60%', '100%'],
                //sizeRange : [ 50, 100 ],    
                rotationRange: [0, 10], //旋转范围 
                data: tempNation
            }]
        };
        populationNation.setOption(option);
    }

    function initEducation(educationData){
        var lable = [];

        $.each(educationData,function(index,data){
            lable.push(data['name']);
        });
        //学历情况
        var education = echarts.init(document.getElementById('education'));

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data: lable
            },
            series: [{
                name: '',
                type: 'pie',
                radius: ['30%', '80%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: educationData
            }]
        };

        education.setOption(option);
    }

    function initAgeRange(ageData){
        var lable = [];
        var lableData = [];

        $.each(ageData,function(index,data){
            lable.push(data['name']);
            lableData.push(data['value']);
        });
        // 年龄分布
        var ageDistribution = echarts.init(document.getElementById('ageDistribution'));

        var option1 = {

            tooltip: {},
            legend: {
                data: ['年龄']
            },
            xAxis: {
                data: lable,
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            yAxis: {},
            series: [{
                name: '',
                type: 'bar',
                data: lableData,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top'
                        }

                    }
                }
            }]
        };

        ageDistribution.setOption(option1);
    }

    function getGender(genderData) {
        var female = 0;
        var male = 0;

        $.each(genderData,function(index,data){
            if('男'==data.name){
                male=data.value;
            }
            if('女'==data.name){
                female=data.value;
            }
        });

        var all = eval(female+male);

        if(0==all){
            return {
                male:'0%',
                female:'0%',
                all:all
            }
        }else if(0==male){
            return {
                male:'0%',
                female:'100%',
                all:all
            }
        }else if(0==female){
            return {
                male:'100%',
                female:'0%',
                all:all
            }
        }else{
            return {
                male:eval((male / all) * 100).toFixed(0) + '%',
                female:eval((female / all) * 100).toFixed(0) + '%',
                all:all
            }
        }
    }
    
    function getRate(rateData) {
        var current = {};
        var last = {};

        $.each(rateData,function(index,data){
            if(data['this']=='this') {
                current=data;
            }
            if(data['this']=='last'){
                last=data;
            }
        });

        var add = current.total - last.total;

        var pData = {};
        // 减少
        if(add < 0){
            pData.plus=Math.abs(add);
            if(last.total!=0){
                pData.rate=eval((pData.plus / last.total) * 100).toFixed(0) + '%';
            }else{
                pData.rate='100%';
            }
            
        }else{
            pData.add=add;
            if(last.total!=0){
                pData.rate=eval((pData.add / last.total) * 100).toFixed(0) + '%';
            }else{
                pData.rate='100%';
            }
            
            
        }

        return pData;
    }

    //模块默认导出方法
    exports.initialization = function () {
        // initAdd();
        seajs.use(['../app/common/ajax'], function (ajax) {
            ajax.get('population/info/statistics', {}, function (response) {
                var result = response.data;
                if (result.code <= 0) {
                    $.showErrorInfo(result.message);
                } else {
                    var template = Handlebars.compile(require('./template.html'));
                    
                    
                    $('#content').html(template($.extend(getRate(result['rate']), getGender(result['gender']))));

                    initNation(result['nation']);
                    initEducation(result['education']);
                    initAgeRange(result['age']);
                    initPolitical(result['politication']);
                }
            });
        });
    }

    //显示人口列表事件绑定
    function initAdd() {
        $('#populationList').on('click', function () {
            window.location.href = './populationList.html';
        });
    }
})