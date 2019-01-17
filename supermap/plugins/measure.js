/*
 * 测距测面积功能
 * @author qhj
 */
define(function(require, exports, module) {
	var util=require("../../supermap/plugins/util.js");
	//全局变量
	var m_map,m_vectorLayer,mapDomID;
	//局部变量
	var baseUrl = "../../supermap/plugins/images/";
    var _fun;
    var isInitMeature=false,
        measureControl, //测距控件
        measureControl1,//测面积控件
        AllFeatures={}, //存储的绘制变量
        preGeoLen,      //长度
        measureFeature, 
        measureIndex=0; //当前进行量算次数
    var styleLine = {
        strokeWidth: 3,
        strokeLinecap: "round",
        strokeOpacity: 1,
       // strokeColor: "#569cf1",
        strokeColor: "#5cf1ff",
        strokeDashstyle: "solid"
    };
    var stylePoint = {
        pointRadius: 4,
        graphicName: "square",
        fillColor: "white",
        fillOpacity: 1,
        strokeWidth: 1,
        strokeOpacity: 1,
      //  strokeColor: "#569cf1"
        strokeColor: "#5cf1ff",
    };
    var sketchSymbolizers = {
        "Point": {
            pointRadius: 0,
            graphicName: "square",
            fillColor: "#5cf1ff",
            fillOpacity: 1,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "#333333"
        },
        "Line": {
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeOpacity: 1,
            //strokeColor: "#569cf1",
            strokeColor: "#5cf1ff",
            strokeDashstyle: "dash"
        },
        "Polygon": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "#5cf1ff",
            fillColor: "#5cf1ff",
            fillOpacity: 0.3
        }
    };
    var style = new SuperMap.Style();
    style.addRules([
        new SuperMap.Rule({symbolizer: sketchSymbolizers})
    ]);
    var styleMap = new SuperMap.StyleMap({"default": style});
    
    var meatureTipDiv=
	    "<div id='meatureTipDiv' style='font-size:13px;background-color:#fff;border:1px solid rgb(86,156,241);padding:2px;white-space:nowrap;font-family:Arial;position:absolute;z-index:2000;left:&LEFT;top:&TOP;'>"
	    +"&CONTENT"
	    +"</div>"
    
    var startDiv = 
		"<div style='position: absolute;font-size: 12px; font-family: Arial; white-space: nowrap; height: 17px; background-image: url("+baseUrl+"measureDis_box_bg.gif);'>"
		+   "<div style='position: relative; display: inline; height: 17px; line-height: 140%; padding: 0px 2px; white-space: nowrap;'>起点</div>"
		+   "<div style='position: absolute; top: 0px; left: -2px; background-image: url("+baseUrl+"measureDis_box_l.gif); width: 2px; height: 17px;'></div>"
		+   "<div style='position: absolute; top: 0px; right: -2px; background-image: url("+baseUrl+"measureDis_box_r.gif); width: 2px; height: 17px;'></div>"
		+"</div>";
    
    var resultDiv = 
		"<div style='position: absolute; z-index: 300; font-size: 12px; font-family: Arial; white-space: nowrap; height: 17px; background-image: url("+baseUrl+"measureDis_box_bg.gif);'>"
		+   "<div style='position: relative; display: inline; height: 17px; line-height: 140%; padding: 0px 2px; white-space: nowrap;'><strong>"
		+       "&DISTANCE</strong>" + " &UNIT" 
		+   "</div>"
		+   "<div style='position: absolute; top: 0px; left: -2px; background-image: url("+baseUrl+"measureDis_box_l.gif); width: 2px; height: 17px;'></div>"
		+   "<div style='position: absolute; top: 0px; right: -2px; background-image: url("+baseUrl+"measureDis_box_r.gif); width: 2px; height: 17px;'></div>"
		+"</div>";
    
     var endDiv = 
		 "<div style='position: absolute; z-index: 2100; border: 1px solid rgb(86, 156, 241); background-color: rgb(255, 255, 255); white-space: nowrap; font-size: 13px; padding: 2px; font-family: Arial;'>"
		+   "<span style='margin: 0px 4px; float: left;'>"
		+    "总长：<strong>" + "&DISTANCE" + "</strong>" + " " + "&UNIT" + "</span>"
		+   "<img id=measureResultClose_" + "&MEATUREINDEX" +" hspace='0' src='"+baseUrl+"measureDis_p_close.png' style='width: 14px; height: 14px; cursor: pointer; position: relative; margin: 2px 2px -2px; display: inline-block;'>"
		+ "</div>";
	
	//初始化量算类控件,传入地图容器和绘制图层
	function measureInit(map,vectorLayer,domId){
		m_map = map;
		m_vectorLayer = vectorLayer;
		mapDomID = domId;
		//测距离
		measureControl= new SuperMap.Control.Measure(
            SuperMap.Handler.Path, {
                persist:false,
                immediate:true,
                geodesic: false,
                handlerOptions: {
                    layerOptions: {
                        styleMap: styleMap
                    }
                }
            }
        );
        //监听 measure 和 measurepartial 两个事件，量算完成时触发时
        //量算完成时触发 measure 事件，当点被添加到量算过程中时触发 measurepartial
        measureControl.events.on({
            "measure": function(event){_handleMeasure(event)},
            "measurepartial": function(event){_handleMeasurepartial(event);}
        });
        
        //测面积
        measureControl1= new SuperMap.Control.Measure(
            SuperMap.Handler.Polygon, {
                persist:false,
                immediate:true,
                geodesic: false,
                handlerOptions: {
                    layerOptions: {
                        styleMap: styleMap
                    }
                }
            }
        );
        //监听 measure 和 measurepartial 两个事件，量算完成时触发时
        //量算完成时触发 measure 事件，当点被添加到量算过程中时触发 measurepartial
        measureControl1.events.on({
            "measure": function(event){_handleMeasure1(event)},
            "measurepartial": function(event){_handleMeasurepartial1(event);}
        });
		map.addControls([measureControl,measureControl1]);
	};
	
	/**
	 * 绘制线结束时触发事件
	 */
	function _handleMeasure(event){
        var mapVar=m_map;
        //获取传入参数 event 的 geometry 信息
        var geometry = event.geometry;
        var endMeasurePoint = new SuperMap.Geometry.Point(geometry.components[geometry.components.length-1].x, geometry.components[geometry.components.length-1].y);
        var endPointGeo = geometry.components[geometry.components.length-1];
        //添加终点
        var endPointFeature = new SuperMap.Feature.Vector(endMeasurePoint, null, stylePoint);
        //将添加的点要素的id保存起来，用于后面的清除
        AllFeatures[measureIndex].features.push(endPointFeature);
        m_vectorLayer.addFeatures(endPointFeature);
        //添加量算的线
        var lineFeature = new SuperMap.Feature.Vector(geometry, null, styleLine);
        //将添加的线要素的id保存起来，用于后面的清除
        AllFeatures[measureIndex].features.push(lineFeature);
        m_vectorLayer.addFeatures(lineFeature);
        var popup = new SuperMap.Popup(
            'measureResultPopup',
            new SuperMap.LonLat(endPointGeo.x, endPointGeo.y),
            new SuperMap.Size(150,30),
            endDiv.replace("&DISTANCE",event.measure.toFixed(2)).replace("&UNIT",event.units).replace("&MEATUREINDEX", measureIndex),
            false
        );
        popup.backgroundColor = 'none';
        mapVar.addPopup(popup);
        AllFeatures[measureIndex].popup.push(popup);
        parent.window.measureIndex = measureIndex;
        var meatureDom=document.getElementById("meatureTipDiv");
        if(meatureDom!=null&&meatureDom.nodeType===1)
            util.remove(document.getElementById("meatureTipDiv"));
        util.addEvent(document.getElementById("measureResultClose_"+measureIndex),"click",function(){
            _clearMeasureResult(measureIndex);
        });
        _deactiveMeature();
	}
	/**
	 * 绘制线绘制过程中触发事件
	 */
	function _handleMeasurepartial(event){
        var mapVar=m_map;
        //mapVar.events.registerPriority("mousemove",null,function(){});
        util.removeEvent(document.getElementById(mapDomID),"mousemove",_fun);
        //获取传入参数 event 的 geometry 信息
        var geometry = event.geometry;
        var measurePoint = new SuperMap.Geometry.Point(geometry.components[geometry.components.length-1].x, geometry.components[geometry.components.length-1].y);
        //获取实时量算结果
        var mousePositionGeo = geometry.components[geometry.components.length-1];
        var mousePositionPix = mapVar.getPixelFromLonLat(new SuperMap.LonLat(mousePositionGeo.x,mousePositionGeo.y));
        var meatureDom=document.getElementById("meatureTipDiv");
        if(meatureDom!==null&&meatureDom.nodeType===1){
            meatureDom.innerHTML='总长: <strong>' + event.measure.toFixed(2) + '</strong>' + ' ' + event.units + '<br>左键单击增加点，双击结束';
            meatureDom.style.left=mousePositionPix.x+6-util.getOffset(document.getElementById(mapDomID)).x+"px";
            meatureDom.style.top=mousePositionPix.y+10-util.getOffset(document.getElementById(mapDomID)).y+"px";
        }else{   
            util.appendChild(Dom,meatureTipDiv.replace("&LEFT",event.xy.x+6+"px").replace("&TOP",event.xy.y+10+"px").replace("&CONTENT",'总长: <strong>' + event.measure.toFixed(2) + '</strong>' + ' ' + event.units + '<br>左键单击增加点，双击结束'));
        }
         //获取一段量算结果
        if(geometry.components[0].x == geometry.components[1].x && geometry.components[0].y == geometry.components[1].y){
            //添加起点
            measureFeature = new SuperMap.Feature.Vector(measurePoint, null, stylePoint);
            //将添加的点要素的id保存起来，用于后面的清除
            AllFeatures[measureIndex].features.push(measureFeature);
            m_vectorLayer.addFeatures(measureFeature);
            // var popupPosition = mapVar.getLonLatFromPixel(new SuperMap.Pixel(mousePositionPix.x + 10, mousePositionPix.y -15));
            var popup = new SuperMap.Popup(
                'measureResultPopup',
                new SuperMap.LonLat(geometry.components[0].x, geometry.components[0].y),
                new SuperMap.Size(80,42),
                startDiv,
                false
            );
            popup.backgroundColor = 'none';
            mapVar.addPopup(popup);
            AllFeatures[measureIndex].popup.push(popup);
        }
         if(preGeoLen>1 && preGeoLen<geometry.components.length){
            //添加量算过程中的点
            measureFeature = new SuperMap.Feature.Vector(measurePoint, null, stylePoint);
            //将添加的点要素的id保存起来，用于后面的清除
            AllFeatures[measureIndex].features.push(measureFeature);
            m_vectorLayer.addFeatures(measureFeature);
            //使用Popup显示量算结果
            //var popupPosition = mapVar.getLonLatFromPixel(new SuperMap.Pixel(mousePositionPix.x + 10, mousePositionPix.y -15));
            var popup = new SuperMap.Popup(
                'measureResultPopup',
                new SuperMap.LonLat(mousePositionGeo.x, mousePositionGeo.y),
                new SuperMap.Size(130,22),
                resultDiv.replace("&DISTANCE",event.measure.toFixed(2)).replace("&UNIT",event.units),
                false
            );
            popup.backgroundColor = 'none';
            mapVar.addPopup(popup);
            //将popup保存起来，用于后面清除popup
            AllFeatures[measureIndex].popup.push(popup);
        }
        preGeoLen = geometry.components.length;
	}
	
	/**
	 * 面积测量结束时触发事件
	 */
	function _handleMeasure1(event){   //面积测量结束
        var mapVar=m_map;
        //获取传入参数 event 的 geometry 信息
        var geometry = event.geometry;
        var components = geometry.components[0].components;
        var endMeasurePoint = new SuperMap.Geometry.Point(components[components.length-2].x,components[components.length-2].y);
        //var endPointGeo = geometry.components[geometry.components.length-1];
        //添加终点
        var endPointFeature = new SuperMap.Feature.Vector(endMeasurePoint, null, stylePoint);
        //将添加的点要素的id保存起来，用于后面的清除
        AllFeatures[measureIndex].features.push(endPointFeature);
        m_vectorLayer.addFeatures(endPointFeature);
        //添加量算的线
        var lineFeature = new SuperMap.Feature.Vector(geometry, null, sketchSymbolizers.Polygon);
        //将添加的线要素的id保存起来，用于后面的清除
        AllFeatures[measureIndex].features.push(lineFeature);
        m_vectorLayer.addFeatures(lineFeature);
        //this.map.vectorLayer.setOpacity(0.4);
        if(event.units == 'm'){
        	event.units = '平方米';
        }else if(event.units == 'km'){
        	event.units = '平方公里';
        }else{
        	event.units = '平方米';
        }
        var popup = new SuperMap.Popup(
            'measureResultPopup',
            new SuperMap.LonLat(endMeasurePoint.x, endMeasurePoint.y),
            new SuperMap.Size(220,54),
            endDiv.replace("总长","总面积").replace("&DISTANCE",event.measure.toFixed(2)).replace("&UNIT",event.units).replace("&MEATUREINDEX", measureIndex),
            false
        );
        popup.backgroundColor = 'none';
        mapVar.addPopup(popup);
        AllFeatures[measureIndex].popup.push(popup);
        parent.window.measureIndex = measureIndex;
        var meatureDom=document.getElementById("meatureTipDiv");
        if(meatureDom!=null&&meatureDom.nodeType===1)
            util.remove(document.getElementById("meatureTipDiv"));
        util.addEvent(document.getElementById("measureResultClose_"+measureIndex),"click",function(){
            _clearMeasureResult(measureIndex);
        });
        _deactiveMeature();
    }
	
	/**
	 * 面积测量绘制过程中触发事件
	 */
    function _handleMeasurepartial1(event){
        var mapVar=m_map;
        util.removeEvent(document.getElementById(mapDomID),"mousemove",_fun);
        //获取传入参数 event 的 geometry 信息
        var geometry = event.geometry;
        var components=geometry.components[0];
        var mousePositionGeo=components.components[components.components.length-1];
        var mousePositionPix = mapVar.getPixelFromLonLat(new SuperMap.LonLat(mousePositionGeo.x,mousePositionGeo.y));
        var meatureDom=document.getElementById("meatureTipDiv");
        if(event.units == 'm'){
        	event.units = '平方米';
        }else if(event.units == 'km'){
        	event.units = '平方公里';
        }else{
        	event.units = '平方米';
        }
        if(meatureDom!==null&&meatureDom.nodeType===1){
            meatureDom.innerHTML='总面积: <strong>' + event.measure.toFixed(2) + '</strong>' + ' ' + event.units + '<br>左键单击增加点，双击结束';
            meatureDom.style.left=mousePositionPix.x+6+"px";
            meatureDom.style.top=mousePositionPix.y+10+"px";
        }else{
            util.appendChild(Dom,meatureTipDiv.replace("&LEFT",event.xy.x+6+"px").replace("&TOP",event.xy.y+10+"px").replace("&CONTENT",'总面积: <strong>' + event.measure.toFixed(2) + '</strong>' + ' ' + event.units + '<br>左键单击增加点，双击结束'));
        }
    }
    
    function _tipMeasure(event){
        var Dom=document.getElementById(mapDomID);
        var meatureDom=document.getElementById("meatureTipDiv");
        if(event.xy==undefined||event.xy==null)
        	return;
        if(meatureDom!=null&&meatureDom!=undefined&&meatureDom.nodeType===1){
            meatureDom.style.left=event.xy.x-util.getOffset(document.getElementById(mapDomID)).x+6+"px";
            meatureDom.style.top=event.xy.y-util.getOffset(document.getElementById(mapDomID)).y+10+"px";
        }else{
            util.appendChild(Dom,meatureTipDiv.replace("&LEFT",event.xy.x+6+"px").replace("&TOP",event.xy.y+10+"px").replace("&CONTENT","单击确认起点"));
        }
    }
	
	/**
	 * 注销测量控件
	 */
	function _deactiveMeature(){
        //注销控件
        measureControl.deactivate();
        measureControl1.deactivate();
        //移除鼠标样式
        util.removeClass(document.getElementById(mapDomID),'sm_measure');
    }
	
	/**
	 * 清除测量结果
	 */
	function _clearMeasureResult(index){
        if(Object.prototype.toString.call(index)!="[object Number]"&&index<1){
            return;
        }
    	m_vectorLayer.removeFeatures(AllFeatures[index].features);
        for(var i=0;i<AllFeatures[index].popup.length;i++){
            m_map.removePopup(AllFeatures[index].popup[i]);
        }
        measureIndex--;
    }
	
	function _meatureStart(ctl){
        util.addClass(document.getElementById(mapDomID),'sm_measure');
        if(measureIndex==1){
        	_clearMeasureResult(measureIndex);
        }
        if(m_map){
    		//激活控件
            ctl.activate();
            if(_fun != undefined){
            	util.removeEvent(document.getElementById(mapDomID),"mousemove",_fun);
            }
            //添加鼠标移动监听事件
            _fun=function(event){_tipMeasure(event)};
            util.addEvent(document.getElementById(mapDomID),"mousemove",_fun);
            measureIndex++;
            AllFeatures[measureIndex]={features:[],popup:[]};
        }
   }
	
	/**
	 * 开始测量距离
	 */
    function meatureDistenceStart(){
        _deactiveMeature();
        _meatureStart(measureControl);
    }
    
    /**
     * 开始测量面积
     */
    function meatureAreaStart(){
        _deactiveMeature();
        _meatureStart(measureControl1);
    }
    
    /**
     * 停止测量
     */
    function stop(){
        measureControl.deactivate();
        measureControl1.deactivate();
        while(measureIndex!=0){
            _clearMeasureResult(measureIndex);
        }
        util.removeEvent(document.getElementById(mapDomID),"mousemove",_fun);
        var meatureDom=document.getElementById("meatureTipDiv");
        if(meatureDom!=null&&meatureDom.nodeType===1)
            util.remove(document.getElementById("meatureTipDiv"));
        util.removeClass(document.getElementById(mapDomID),'sm_measure');
    }
    
    /**
     * 得到所有的添加的点
     */
    function getAllFeatures(){
        return AllFeatures[measureIndex];
    }
    
    /**
     * 移除最后一个元素
     */
    function removeLastFeature(){
        var k=2;
    	while(measureIndex!=0){
    		if(!k)
    			break;
    		else
    			--k;
            _clearMeasureResult(measureIndex);console.log(measureIndex);
        }
    	measureIndex+=2;
    }
	
	var measure={
		measureInit:measureInit,
		meatureDistenceStart:meatureDistenceStart,
		meatureAreaStart:meatureAreaStart,
		_clearMeasureResult:_clearMeasureResult
	}
	module.exports = measure;
});