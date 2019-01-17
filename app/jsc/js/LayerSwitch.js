/**
 * 专题图层切换
 */

//调用柱状图
function toBar() {
    //清除专题图
    clearLayer();
    setTopLayer("ThemeLayer3D");
    getData();
    //注册鼠标移动事件
    BarLayer.on("mousemove", evn1);
}
//柱状图数据
function getData() {
    var result = resultDatas;
    var points = [];
    if (result && result.features) {
        for(var i=0; i<result.features.length; i++){
            var center = result.features[i].geometry.getCentroid();
            var pointG = new SuperMap.Geometry.Point(center.x, center.y);
            var pointF = new SuperMap.Feature.Vector(pointG);
            pointF.attributes = result.features[i].attributes;
            points.push(pointF);
        }
        BarLayer.addFeatures(points);
    }
}
 
//调用热力图
function toHeat(year) {
	if(year==undefined){
		year = _year;
	}
    clearLayer();
    setTopLayer("ThemeLayer3D");
    $("#mapLegend").css("background","url(./img/tuli.png) no-repeat");
    var heatPoints = [];
    heatLayer.useGeoUnit = false;
    heatLayer.radius = 40;
    heatLayer.maxWeight = 10;
    var paramObject= {};
    paramObject.page = 1;
	paramObject.pageSize = 100000;
	paramObject.year = year+"";
    ajax.post('/api/case/findHistoryCase',paramObject, function(response) {
        var data = response.data.data.rows;
	   $.each(data,function(i,obj){
	       if(utils.Object.notNull(obj.x) &&utils.Object.notNull(obj.y)) {
	           obj.X = utils.lonlat(obj.x);
	           obj.Y = utils.lonlat(obj.y);
	           var vecter = new SuperMap.Feature.Vector(
	               new SuperMap.Geometry.Point(
	                    obj.X, obj.Y
	               ),
	               {
	                   "value": 1
	               }
	           );
	           heatPoints.push(vecter);
	       }
	       });
	
	    heatLayer.addFeatures(heatPoints);
    });
}
function evn(e) {
    if (e.target && e.target.refDataID) {
        document.getElementById("infoBox").style.display = "block";
        var fid = e.target.refDataID;
        var fea = themeLayer.getFeatureById(fid);
        if (fea) {
            document.getElementById("infoContent").innerHTML = "";
            document.getElementById("infoContent").innerHTML += "片区名:" + fea.attributes.LAYER + "<br/>";
            document.getElementById("infoContent").innerHTML += "责任人:" + fea.attributes.REFNAME + "<br/>";
            $("#infoContentTotal").html("");
           $.each(fea.data,function(i,item){
            	$("#infoContentTotal").append("<tr><td style='width: 80%;'>"+item.name+"</td><td style='text-align: left;'>"+item.value+"   </td></tr>") ;
            })
        }
    }
    else {
        document.getElementById("infoContent").innerHTML = "";
        document.getElementById("infoBox").style.display = "none";
    }
   // $('.ctn-con').mousemove(function(e){
        var top = e.event.pageY;
        if(top<150){
        	top=100;
        }else{
        	top-=150;
        }
        var left = e.event.pageX+5;
        $('#infoBox').css({
            'top' : top + 'px',
            'left': left + 'px'
        });
   // });
}
//柱状专题图鼠标移动事件处理，控制信息框数据显示
function evn1(e) {
    if (e.target && e.target.refDataID) {
        document.getElementById("infoBox").style.display = "block";
        var fid = e.target.refDataID;
        var fea = BarLayer.getFeatureById(fid);
        if (fea) {
            document.getElementById("infoContent").innerHTML = "";
            document.getElementById("infoContent").innerHTML += "片区名: " + fea.attributes.LAYER + "<br/>";
            document.getElementById("infoContent").innerHTML += "责任人:" + fea.attributes.REFNAME + "<br/>";
            document.getElementById("infoContent").innerHTML += "案件数:" + fea.attributes.案件数 + "<br/>";
        }
    }
    else {
        document.getElementById("infoContent").innerHTML = "";
        document.getElementById("infoBox").style.display = "none";
    }
    $('.ctn-con').mousemove(function(e){
        var top = e.pageY+5;
        var left = e.pageX+5;
        $('#infoBox').css({
            'top' : top + 'px',
            'left': left+ 'px'
        });
    });
}


//清除现有图层
function clearLayer() {
    //清除分段区块显示结果
    if (themeLayer != undefined && themeLayer !=null) {
       /* document.getElementById("mapLegend").style.display = "none";*/
        themeLayer.clear();
    }
    //清除柱状显示结果
    if (BarLayer != undefined) {
        BarLayer.clear();
    }
    //清除热力图
    if(heatLayer != undefined && heatLayer !=null){
        heatLayer.removeAllFeatures();
    }
}

//将指定图层置顶
function setTopLayer(name){
    if(map.getLayersByName(name).length==0) return;
    var layer=map.getLayersByName(name)[0];
    var index=map.getLayerIndex(layer);
    map.raiseLayer(layer,map.layers.length-index);
}


