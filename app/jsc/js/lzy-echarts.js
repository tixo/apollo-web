var _ajax;
$(document).ready(function(){
      seajs.use(["../../scheduling/app/common/ajax.js"],function(ajax){
          _ajax=ajax;
          findGeneralInfo();
    });
});
//一标三实统计
function findGeneralInfo(){
    _ajax.get('/api/dashboard/findGeneralInfo?year='+2018, {}, function(response) {
        console.log(response);
        successDate(response.data.data);
    });
}
//一标三实请求成功回调函数
function successDate(data) {
	//实有人口、房屋、单位总数
	$("#generalPopulationTotal").html(data.generalPopulationTotal);
	$("#generalHouseTotal").html(data.generalHouseTotal);
	$("#generalCompanyTotal").html(data.generalCompanyTotal);
	var newHouseArry=[];
	var houseVal=[];
	$.each(data.generalHouse,function(i,item){
		var newHouse={}
		newHouse.text=item.name;
		newHouse.max = (item.value)+200;
		newHouseArry.push(newHouse);
		houseVal.push(item.value);
	});
	var option1 = {
		tooltip: {
		 	  trigger: 'item',
		 	  textStyle:{
		 	  	fontSize:10
		 	  },
		 	  position: [0, 0]
		},
    radar: {
   	 
    name: {
        textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 1,
            padding: [0, 0]
      		}
    },
    indicator: newHouseArry
    },
    series : [ 
        {
        	  areaStyle: {normal: {}},
        	  roseType: 'radius',
            name: '',
            type: 'radar',
            data : [
                {
                    value : houseVal,
                    name : '实有房屋统计'
                }
            ],
             itemStyle: {
	            	 normal: {
	            	 label:{
                        textStyle:{fontSize:"10"}
                    },
			            labelLine: {
					            length:0
					        }
		            }
		          }
        }
    ]
};
		//实有人口
	var population = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)",
	        position: [0, 0]
	    },
	    series: [
	        {
	            name:'访问来源',
	            type:'pie',
	            selectedMode: 'single',
	            radius: [0, '30%'],
	
	            label: {
	                normal: {
	                    position: 'inner'
	                }
	            }
	        },
	        {
	            name:'访问来源',
	            type:'pie',
	            radius: ['32%', '70%'],
	            itemStyle: {
	            	 normal: {
	            	 label:{
                        textStyle:{fontSize:"10"}
                    },
			            labelLine: {
					            length:0
					        }
		            }
		          },
	            data:data.generalPopulation
	        } 
	    ],
	   /*color:['#C8E49C','#E7DAC9','#2EC7C9','#46B2FF']    */
	    color:['#8DC1A9','#73A373','#C4CCD3','#F7DD86','#7289AB']   
};
	//实有房屋
	var house = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{b}{d}%"
	    },
	    series: [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius: ['32%', '70%'],
	            itemStyle: {
	            	 normal: {
	            	 	label:{
                            textStyle:{fontSize:"10"}
                        },
			            labelLine: {
					            length:0
					        }
		            }
		          },
	            data:data.generalHouse
	        } 
	    ],
	    color:['#C8E49C','#2EC7C9','#d197ff','#2EBC12','#A9CBA2','#E7DAC9']  
	};
	//实有单位
	var company = {
	    tooltip: {
	        trigger: 'axis',
	        formatter: "{b}{d}%"
	    },
	    series: [
	        {
	            name:'访问来源',
	            type:'pie',
	            selectedMode: 'single',
	            radius: [0, '30%'],
	
	            label: {
	                normal: {
	                    position: 'inner'
	                }
	            }
	        },
	        {
	            name:'访问来源',
	            type:'pie',
	            radius: ['32%', '70%'],
	            itemStyle: {
	            	 normal: {
	            	 	label:{
                            textStyle:{fontSize:"10"}
                        },
			            labelLine: {
					            length:0
					        }
		            }
		          },
	            data:data.generalCompany
	        } 
	    ],
	   color:['#C8E49C','#2EC7C9','#d197ff','#2EBC12','#46B2FF','#E7DAC9']  
	};
	var company1 = {	
	   tooltip : {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)",
        position: [0, 0]
    },
    series : [
        {
            name: '访问来源',
            type: 'pie',
            radius : '70%',
            center: ['50%', '50%'],
            data:data.generalCompany,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }, normal: {
	            	 	label:{
                            textStyle:{fontSize:"10"}
                        },
			            labelLine: {
					            length:0
					        }
		            }
            }
        }
    ],
    color:['#8DC1A9','#73A373','#C4CCD3','#E7BCF3','#7289AB']   
};

 	//初始化echarts实例
	var myChart = echarts.init(document.getElementById('generalPopulation'));
  	var myChart1 = echarts.init(document.getElementById('generalHouse'));
  	var myChart2 = echarts.init(document.getElementById('generalCompany'));

    window.onresize=function(){//图表自适应
       myChart.resize();
       myChart1.resize();
       myChart2.resize();
     }

	//使用制定的配置项和数据显示图表
	myChart.setOption(population);
	myChart1.setOption(option1);
	myChart2.setOption(company1);
}
//图形展示选择样式
jQuery.divselect = function(divselectid, inputselectid) {
	var inputselect = $(inputselectid);
	$(divselectid + " cite").click(function() {
		var ul = $(divselectid + " ul");
		if(ul.css("display") == "none") {
			ul.slideDown("fast");
		} else {
			ul.slideUp("fast");
		}
	});
	$(divselectid + " ul li a").click(function() {
		var txt = $(this).text();
		$(divselectid + " cite").html(txt);
		var value = $(this).attr("selectid");
		inputselect.val(value);
		$(divselectid + " ul").hide();

	});
};