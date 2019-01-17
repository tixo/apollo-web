/*
 * 警用符号库
 * @author gzq
 * 2018.4.4
 */
define(function(require, exports, module) {

    var ajax = require("../../../scheduling/app/common/ajax.js");
    var JK = require('../../../config/common/utils.js');
    var Jakie = Jakie || {};
    Jakie = {
        Model: {
            // loading框
            loading: function() {
                $("#JLoading").show();
            },
            // 关闭loading框
            loadingClose: function() {
                $("#JLoading").hide();
            }
        }
    }
    var symbolLibManager;
    var map = parent.window.mapUtil.mapAPI.map;
    var plotting = parent.window.mapUtil.mapAPI.plotting;
    var mapToImg = parent.window.mapUtil.pluginsAPI.mapToImg;
    sitManager = plotting.getSitDataManager();
    sitManager.events.on({
        "getSMLInfosCompleted": getSMLInfosSucess,
        "getSMLInfosFailed": getSMLInfosFail,
        "openSmlFileCompleted": openSuccess,
        "openSmlFileFailed": openFail,
        "saveSmlFileCompleted": saveSuccess,
        "saveSmlFileFailed": saveFail
    });
    //sitManager.deleteSmlFileOnServer('123');
    var plottingLayer = parent.window.mapUtil.mapContent.plottingLayer;
    plottingLayer.style = {
        fillColor: "#66cccc",
        fillOpacity: 0.4,
        strokeColor: "#66cccc",
        strokeOpacity: 1,
        strokeWidth: 3,
        pointRadius: 6
    };

    //态势标绘编辑
    var plottingEdit = new SuperMap.Control.PlottingEdit();
    // 绘制控件
    var drawFeature = new SuperMap.Control.DrawFeature(plottingLayer, SuperMap.Handler.GraphicObject);
    // 绘制结束后的回掉函数
    drawFeature.events.on({ "featureadded": drawCompleted });
    //在地图中添加绘制控件和动态标绘编辑控件
    map.addControls([plottingEdit, drawFeature]);

    $(document).ready(function() {
        loadSymbolLib(); 
        findTemplatePlans("");
        
        $("#get-plantemps-btn").bind("click", function() {
            $("#plans-g-modal").show();
        })

        $(".modal-clear").on('click', function() {
            $(".g-modal").hide();
        });

        $("#clearSymbol").on('click',function(){
            deleteSymbol();
        });
    });

    function findTemplatePlans(category){
    	var param = "";
    	if(category!=""&&category!="全部"){
    		param = "?category="+category;
    	}
    	ajax.get('/api/plan/findTemplatePlans'+param, {}, function(response) {
            var data = response.data.data;
            console.log(data);
            buildPlantempList(data);
        });
    }

    /*重置drawFeature*/
    function updateSize() {
        map.updateSize();
    }

    /**
     * 初始化图标库
     */
    function loadSymbolLib() {
        symbolLibManager = parent.window.mapUtil.mapAPI.plotting.getSymbolLibManager();
        symbolLibManager.events.on({ "initializeCompleted": showSymbolLibInfo });
        symbolLibManager.initializeAsync();
    }

    function showSymbolLibInfo(result) {
        if (0 === result.length) {
            return;
        }
        var symbolLib = symbolLibManager.getSymbolLibByIndex(1);
        var baseico1 = symbolLib.getRootSymbolIconUrl() + symbolLib.getRootSymbolInfo().symbolName + "/" + symbolLib.getRootSymbolInfo().childNodes[9].symbolName + "/";
        var baseico2 = symbolLib.getRootSymbolIconUrl() + symbolLib.getRootSymbolInfo().symbolName + "/" + symbolLib.getRootSymbolInfo().childNodes[10].symbolName + "/";

        var drawData1 = symbolLib.getRootSymbolInfo().childNodes[9].childNodes
        var drawData2 = symbolLib.getRootSymbolInfo().childNodes[10].childNodes
        //获取选中的对象
        var iconNode = document.getElementById("sanwei");
        var table = document.createElement("table");
        table.style.height = "100%";
        table.style.width = "100%";
        buildIcoTable(drawData1, baseico1, table, iconNode);
        buildIcoTable(drawData2, baseico2, table, iconNode);
        $("#sanwei").mCustomScrollbar();
    }

    /**
     * 生成列表
     */
    function buildIcoTable(drawData, baseico, table, iconNode) {
        var i = 0;
        var rowLength = (drawData.length % 2 === 0) ? drawData.length / 2 : drawData.length / 2 + 1;
        for (var j = 0; j < rowLength; j++) {
            var tr = document.createElement("tr");
            for (var k = 0; k < 2; k++) {
                if (drawData[i]) {
                    //存储菜单信息
                    var td = document.createElement("td");
                    var drawNode = document.createElement("div");
                    drawNode.style.textAlign = "center";
                    drawNode.id = drawData[i].libID + "" + drawData[i].symbolCode;
                    drawNode.libID = drawData[i].libID;
                    drawNode.symbolCode = drawData[i].symbolCode;
                    //图片
                    var img = document.createElement("img");
                    //img.width = ""
                    img.src = baseico + drawData[i].symbolCode + ".png";
                    img.style.border = "2px solid rgb(255, 255, 255)";
                    //文本
                    var text = document.createElement("div");
                    text.innerHTML = drawData[i].symbolName;
                    drawNode.appendChild(img);
                    drawNode.appendChild(text);
                    drawNode.onclick = drawNodeClick;
                    td.appendChild(drawNode);
                    tr.appendChild(td);
                }
                i++;
            }
            table.appendChild(tr);
        }
        iconNode.appendChild(table);
    }

    var that = null;

    function drawNodeClick() {
        clearSelected();
        that = $(this).children("img");
        that.css("border", "2px solid rgb(90, 141, 194)");
        //this.css("border-color","#1912C4");
        if (drawFeature !== null) {
            drawFeature.handler.libID = this.libID;
            drawFeature.handler.symbolCode = this.symbolCode;
            //drawFeature.deactivate();
            drawFeature.activate();
        }
    }

    function drawCompleted(result) {
        plottingLayer.drawFeature(result.feature);
        console.log(result);
        //drawFeature.deactivate();
    }
    //
    function createAnimation() {
        var obj = new Object();
        var features = sitManager.getSitDataLayers()[0].features;
        for(var i=0; i<features.length; i++) {
            var feature = features[i];
            if (feature.geometry.symbolName.indexOf("箭头") != -1) {
                obj.selectValue = SuperMap.Plot.GOAnimationType.ANIMATION_GROW;
            } else if (feature.geometry.symbolName.indexOf("车") != -1 || feature.geometry.symbolName.indexOf("船") != -1 || feature.geometry.symbolName.indexOf("艇") != -1 || feature.geometry.symbolName.indexOf("飞行器") != -1) {
                obj.selectValue = SuperMap.Plot.GOAnimationType.ANIMATION_BLINK;
            } else if (feature.geometry.symbolName.indexOf("警") != -1) {
                obj.selectValue = SuperMap.Plot.GOAnimationType.ANIMATION_SHOW;
            } else if (feature.geometry.symbolName.indexOf("目标") != -1) {
                obj.selectValue = SuperMap.Plot.GOAnimationType.ANIMATION_ATTRIBUTE;
            } else {
                obj.selectValue = SuperMap.Plot.GOAnimationType.ANIMATION_ATTRIBUTE;
            }
            var goAnimationNameUUid = SuperMap.Plot.PlottingUtil.generateUuid();//生成唯一的uuid
            var goAnimationName = obj.selectValue + goAnimationNameUUid;
            var goAnimation = parent.window.mapUtil.mapContent.goAnimationManager.createGOAnimation(obj.selectValue, goAnimationName, feature);
            switch (goAnimation.getGOAnimationType()) {
                case SuperMap.Plot.GOAnimationType.ANIMATION_ATTRIBUTE:
                {//属性动画
                    goAnimation.startTime = 0;//开始时间
                    goAnimation.duration = 10;//间隔时间
                    //goAnimation.repeat = true;//重复播放
                    goAnimation.lineColorAnimation = true;//线色动画
                    goAnimation.startLineColor = "#f5700e";//开始线色
                    goAnimation.endLineColor = "#0e49f5";//结束线色

                    goAnimation.lineWidthAnimation = true;//线宽动画
                    goAnimation.startLineWidth = 1;//开始线宽
                    goAnimation.endLineWidth = 5;//结束线宽

                    goAnimation.surroundLineColorAnimation = true;//衬线动画
                    goAnimation.startSurroundLineColor = "#ffff00";//开始衬线色
                    goAnimation.endSurroundLineColor = "#009933";//结束衬线色

                    goAnimation.surroundLineWidthAnimation = true;//衬线宽
                    goAnimation.startSurroundLineWidth = 2;//开始衬线宽
                    goAnimation.endSurroundLineWidth = 4;//结束衬线宽
                    break;
                }
                case SuperMap.Plot.GOAnimationType.ANIMATION_BLINK:
                {//闪烁动画
                    goAnimation.startTime = 2;
                    //goAnimation.duration = 5;
                    //goAnimation.repeat = true;//重复播放
                    //闪烁类型：次数闪烁
                    goAnimation.blinkStyle = SuperMap.Plot.BlinkAnimationBlinkStyle.Blink_Number;
                    goAnimation.blinkNumber = 5;//闪烁次数

                    //闪烁类型：频率闪烁
                    //goAnimation.blinkStyle = SuperMap.Plot.BlinkAnimationBlinkStyle.Blink_Frequency;
                    //goAnimation.blinkInterval = 500;//闪烁频率

                    //闪烁颜色交替类型:无颜色交替
                    //goAnimation.replaceStyle =  SuperMap.Plot.BlinkAnimationReplaceStyle.Replace_NoColor;
                    //闪烁颜色交替类型：有颜色交替
                    goAnimation.replaceStyle = SuperMap.Plot.BlinkAnimationReplaceStyle.Replace_Color;
                    goAnimation.startColor = "#00ff00";
                    goAnimation.endColor = "#ff0000";
                    break;
                }
                case SuperMap.Plot.GOAnimationType.ANIMATION_GROW:
                {//生长动画
                    goAnimation.startTime = 0;
                    goAnimation.duration = 10;
                    //goAnimation.repeat = true;
                    goAnimation.startScale = 0;
                    goAnimation.endScale = 1;
                    break;
                }
                case SuperMap.Plot.GOAnimationType.ANIMATION_SCALE:
                {//比例动画
                    //goAnimation.startTime = 20;
                    //goAnimation.duration = 5;
                    //goAnimation.repeat = true;
                    goAnimation.startScale = 1;
                    goAnimation.endScale = 2;
                    break;
                }
                case SuperMap.Plot.GOAnimationType.ANIMATION_SHOW:
                {//显隐动画
                    goAnimation.startTime = 0;//开始时间
                    goAnimation.duration = 5;//间隔时间
                    //goAnimation.repeat = true;//重复播放
                    goAnimation.finalDisplay = true;
                    goAnimation.showEffect = true;
                    goAnimation.startScale = true;//最终显示状态
                    break;
                }
            }
        }
    }
    function getSMLInfosSucess(result) {
        console.log(result);
    }

    function getSMLInfosFail(result) {
        console.log(result);
    }

    //态势图保存
    function save(id) {
        console.log(id);
        plottingAllDeactivate();
        deleteSelectedFeaturesAnimation();//删除所有动画
        //if (getSMLInfo(id)) {
            deleteSmlFileOnServer(id);
        //}
        //console.log(sitManager);
        sitManager.saveAsSmlFile(id);
        mapToImg.excute(map);
        setTimeout(function() {
            ajax.post('/api/plan/update', { "id": id, "planPicBase64": parent.window.mapToImageUrl }, function(response) {
                console.log("布控预案 编辑预案");
                console.log(response);
            });
        }, 500);
    }
    //删除指定的已发布态势图文件
    function deleteSmlFileOnServer(smlFileName) {
        sitManager.deleteSmlFileOnServer(smlFileName);
    }

    function saveSuccess(result) {
        console.log(result);
        console.log('保存成功')
    }

    function getSMLInfo(id) {
        var aa = sitManager.getSMLInfo(id);
        if (sitManager.getSMLInfo(id) == undefined) {
            return false;
        }
        return true;
    }

    function saveFail(result) {
        console.log(result);
        console.log('保存失败');
    }
    //添加态势图
    function openSmlFileOnServer(id) {
        PlottingClear();
        //if (getSMLInfo(id)) {
        sitManager.openSmlFileOnServer(id);
        plottingEdit.activate();//激活鼠标控件（选中、拖拽、编辑）
        //}
        Jakie.Model.loading();
    }
    //删除动画
    function deleteSelectedFeaturesAnimation() {
        var goAnimationManager = parent.window.mapUtil.mapContent.goAnimationManager;
        if (null === goAnimationManager.goAnimations) {
            return;
        }
        goAnimationManager.reset();//复位
        goAnimationManager.removeAllGOAnimation();//删除所有
    }
    function openSmlTemp(id) {
        $("#plans-g-modal").hide();
        //sitManager.addSmlFileToLayerOnServer(id, "plottingLayer")
        sitManager.openSmlFileOnServer(id);
        Jakie.Model.loading();
    }


    function openSuccess() {
        $("#plans-g-modal").hide();
        var sitDataLayers = sitManager.getSitDataLayers();
        drawFeature = sitDataLayers[0].drawGraphicObject;
        Jakie.Model.loadingClose();
    }

    function openFail() {
        Jakie.Model.loadingClose();
    }

    //取消标绘与编辑
    function plottingAllDeactivate() {
        plottingEdit.deactivate();
        drawFeature.deactivate();
    }

    //删除选中标号
    function deleteSymbol() {
        plottingEdit.deleteSelectFeature();
    }


    function PlottingDrawCancel() {
        plottingAllDeactivate();
        plottingEdit.activate();
    }

    document.onmouseup = function(evt) {
        var evt = evt || window.event;
        if (evt.button === 2) {
            PlottingDrawCancel();
            clearSelected();
            return false;
        }
        evt.stopPropagation();
    }

    function clearSelected() {
        if (that) {
            that.css("border", "2px solid rgb(255, 255, 255)");
        }
    }
    //清空绘制
    function PlottingClear() {
        for (var i = 0; i < map.layers.length; i++) {
            if (map.layers[i].CLASS_NAME === "SuperMap.Layer.PlottingLayer") {
                map.layers[i].removeAllFeatures();
            }
        }
    }

    function buildPlantempList(data) {
    	var html = "";
    	//planPicBase64
    	var planPicBase64Array = [];
    	$.each(data, function(i,item) {
    		if(item.planPicBase64!=null){
    			planPicBase64Array.push(item);
    		}
    	});
    	if(!$.isEmptyObject(data)){
    		html = template('bkplanTemp', planPicBase64Array);
    	}
        $('#plantemp-list').html(html);
    }


    function saveImg(id) {
        mapToImg.excute(map);
        setTimeout(function() {
            $("#planimg-g-modal").data("id",id);
            $("#planimg-g-modal").show();
            $("#planimg-g-modal .planimg img").attr("src", parent.window.mapToImageUrl);
        }, 500);
    }



    var symbol_lib = {
        loadSymplottingEditbolLib: loadSymbolLib,
        plottingEdit: plottingEdit,
        getSMLInfo: getSMLInfo,
        openSmlFileOnServer: openSmlFileOnServer,
        openSmlTemp: openSmlTemp,
        PlottingClear: PlottingClear,
        findTemplatePlans:findTemplatePlans,
        deleteSymbol: deleteSymbol

    };
    var plot = {
        save: save,
        plottingEdit: plottingEdit,
        openSmlFileOnServer: openSmlFileOnServer,
        openSmlTemp: openSmlTemp,
        saveImg: saveImg,
        PlottingClear: PlottingClear,
        updateSize: updateSize,
        deleteSelectedFeaturesAnimation:deleteSelectedFeaturesAnimation,
        createAnimation:createAnimation,
}

    window.plot = plot;

    module.exports = symbol_lib;
});