/**
 * 飞行管理
 * Created by ljb 2017/12/25.
 */
define(function(require, exports, module) {

    var scene = parent.window.scene;
    //console.log(scene);
    function init(){

    }

    //var flyManager;
    //function onload() {
    //    //var toolbar = document.getElementById('toolbar');
    //    //var viewer = new Cesium.Viewer('cesiumContainer',{
    //    //    imageryProvider: new Cesium.BingMapsImageryProvider({
    //    //        url : 'https://dev.virtualearth.net',
    //    //        mapStyle : Cesium.BingMapsStyle.AERIAL
    //    //    })
    //    //});
    //    var scene = viewer.scene;
    //    scene.globe.depthTestAgainstTerrain = false;
    //    var camera = scene.camera;
    //    //添加S3M图层服务
    //    var promise =  scene.addS3MTilesLayerByScp(URL_CONFIG.SCP_NIAOCHAO,{name : 'niaochao'});
    //    Cesium.when(promise).then(function(){
    //        camera.setView({
    //            destination : Cesium.Cartesian3.fromDegrees(116.3801,39.9874,12.0),
    //            orientation : {
    //                heading:6.260995919619558,
    //                pitch : 0,
    //                roll : 0
    //            }
    //        });
    //        var routes = new Cesium.RouteCollection();
    //        //添加fpf飞行文件，fpf由SuperMap iDesktop生成
    //        var fpfUrl = './SampleData/fpf/niaocao.fpf';
    //        routes.fromFile(fpfUrl);
    //        //初始化飞行管理
    //        flyManager = new Cesium.FlyManager({
    //            scene : scene,
    //            routes : routes
    //        });
    //        //注册站点到达事件
    //        flyManager.stopArrived.addEventListener(function(routeStop){
    //            var stopName = routeStop.stopName;
    //            var entity = new Cesium.Entity({
    //                description : '到达站点 : ' + stopName,
    //                name : stopName
    //            });
    //            viewer.selectedEntity = entity;
    //            setTimeout(function(){
    //                viewer.selectedEntity = undefined;
    //            },1000);
    //            routeStop.waitTime = 1;
    //        });
    //        if(flyManager.readyPromise){
    //            //生成飞行文件中的所有站点列表
    //            Cesium.when(flyManager.readyPromise,function(){
    //                var allStops = flyManager.getAllRouteStops();
    //                var menu = document.getElementById('stopList');
    //                for(var i = 0,j = allStops.length;i < j;i++){
    //                    var option = document.createElement('option');
    //                    //option.textContent = allStops[i].stopName;
    //                    option.textContent = "站点 "+(i+1);
    //                    option.value = allStops[i].index;
    //                    menu.appendChild(option);
    //                }
    //                $('#stopList').selectpicker('refresh');
    //                //注册站点切换事件
    //                $('#stopList').change(function(){
    //                    flyManager && flyManager.pause();
    //                    var index = parseInt($(this).val());
    //                    var route = flyManager.currentRoute;
    //                    var stop = route.get(index);
    //                    flyManager.currentStopIndex = index;
    //                    flyManager.viewToStop(stop);
    //                    flyManager && flyManager.pause();
    //                });
    //            });
    //        }
    //    });





    //对外封装接口
    var flymanger = {


    }
    module.exports = flymanger;
});