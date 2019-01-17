/*
 * 主要参数配置
 */
//var ip = "http://localhost:8090";
//var ip = "http://192.168.1.24:8090";
//var ip = "http://118.190.145.178:8070";
var ip = "http://10.100.4.8:8090";
var Iserver = ip + "/iserver/services/";
var webNameHttpUrl = window.location.pathname.substring(1) == '' ? '' : window.location.pathname.substring(1).substring(0, window.location.pathname.substring(1).indexOf('/'));
var frontHttpUrl = window.location.protocol + '//' + window.location.host + '/'+ webNameHttpUrl+ '/';
//var frontHttpUrl = "./";
var scope = [];
var new_menus=[];
var userName = "";
var alias1="",alias2="",alias3="",ipCamera="";
var services={
    jscMap:Iserver+"map-ErWeiDiTu/rest/maps/mapsy",
    //影像
    //baseMap:Iserver+"map-YingXiangDiTu/rest/maps/yingxiang",
     //影像
    baseMap:Iserver+"map-ugcv5-yingxiang/rest/maps/yingxiang",
     //二维地图
    map2D:Iserver+"map-ErWeiDiTu/rest/maps/map2D",
    /*//三维场景
    sceneUrl:Iserver+"3D-SanWeiChangJing2/rest/realspace",
    //数据服务
    queryUrl:Iserver+"data-SanWeiChangJing2/rest/data",*/
     //三维场景
    sceneUrl:Iserver+"3D-SanWeiChangJing/rest/realspace",
    //数据服务
    queryUrl:Iserver+"data-SanWeiChangJing/rest/data",
    //动态标会服务
    plotUrl: Iserver+"plot-jingyong/rest/plot/",
    mapconfig:{x:108.9682056044,y:34.158376961785,zoom:2,minZoom:2},
    sceneconfig:{
        x: 108.97295484175521,
        y: 34.145989770731975,
        height: 900.1160413874313,
       /* heading: 359.78213768619474,*/
        pitch: -6.7000953113269526,
       /*heading: 359.78213768619474,
       pitch:-3.385206970590221,*/
        roll:0,
        type:"setView"
    },
    menus:[],
    frontHttpUrl:frontHttpUrl
}


function initMenus(menus) {
	
	var old_menus=[
        {
            id:'p_jsc',
            name:'驾驶舱',
            href:frontHttpUrl+'app/jsc/jsc.html',
            show:true
        },
        {
            id:'p_sy',
            name:'首页',
            href:frontHttpUrl+'app/sjtj/sjtj.html',
            show:false
        },
        {
            id:'p_ybss',
            name:'一标三实',
            href:frontHttpUrl+'app/yibiaosanshi/ybss.html',
            show:false
        },
        {
            id:'p_ajjq',
            name:'案件警情',
            href:frontHttpUrl+'app/anjianjingqing/ajjq.html',
            show:false,
            secondarymenu:[
                {
                    id:'s_jraj',
                    name:'今日案件',
                    href:frontHttpUrl+'app/anjianjingqing/ajjq_today.html',
                    show:false
                },
                {
                    id:'s_lsaj',
                    name:'历史案件',
                    href:frontHttpUrl+'app/anjianjingqing/ajjq_history.html',
                    show:false
                },
                {
                    id:'s_ajgl',
                    name:'案件管理',
                    href:frontHttpUrl+'app/anjianjingqing/ajjq_manage.html',
                    show:false
                }
            ]
        },
        {
            id:'p_bkgl',
            name:'布控管理',
            href:frontHttpUrl+'app/bk/bk.html',
            show:false,
            secondarymenu:[
                {
                    id:'s_bkya',
                    name:'布控预案',
                    href:frontHttpUrl+'app/bk/bk_fight.html',
                    show:false
                },
                {
                    id:'s_bkzz',
                    name:'布控作战',
                    href:frontHttpUrl+'app/bk/bk_MonitorPlan.html',
                    show:false
                },
                {
                    id:'s_bkgl',
                    name:'布控管理',
                    href:frontHttpUrl+'app/bk/bk_regulate.html',
                    show:false
                }
            ]
        },
        {
            id:'p_tjfx',
            name:'统计分析',
            href:frontHttpUrl+'app/gxyjfx/gxyjfx.html',
            show:false
        }
    ];
    var globalConstant = {
        singleDataLayerNames: ["layere@HTC02"],
        singleDataBuildingNames: [{"data":"Building1","hx":"Building_1@HTC02"},{"data":"Building2","hx":"Building_2@HTC02"},{"data":"Building3","hx":"Building_3@HTC02"},{"data":"Building4","hx":"Building_4@HTC02"},{"data":"Building_dp","hx":"Building_dp@HTC02"}]
    };
    window.services = services;
    window.globalConstant = globalConstant;
    window.services.menus = menus;
}


//全局常量
    var globalConstant = {
        singleDataLayerNames: ["layere@HTC02"],
        singleDataBuildingNames: [{"data":"Building1","hx":"Building_1@HTC02"},{"data":"Building2","hx":"Building_2@HTC02"},{"data":"Building3","hx":"Building_3@HTC02"},{"data":"Building4","hx":"Building_4@HTC02"},{"data":"Building_dp","hx":"Building_dp@HTC02"}]
    };
    window.services = services;
    window.globalConstant = globalConstant;

