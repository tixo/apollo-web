define(function(require, exports, module){
    var Query={
        /***############################## 地图服务  ############################*/
        /* 图层列表查询
         * 需要传2个参数：
         * param.callback //查询的回掉函数
         * param.url  //查询url
         * */
        getLayersInfo:function(param){
            var getLayersInfoService = new SuperMap.REST.GetLayersInfoService(param.url, {
                    eventListeners: {
                        "processCompleted": function(queryEventArgs){
                              if(typeof(param.callback)==="function"){
                                  param.callback(queryEventArgs);
                              }
                        },"processFailed": this._functionFailed
                    }
                });
                getLayersInfoService.processAsync();
        },
        /* sql查询 查询多个图层
         * 需要传6个参数：
         * param.queryParams=[{name:"",sql:""},{name:"",sql:""}];
         * param.sql  //查询条件
         * param.url//服务地址
           param={url:"",layerName:"",sql:"",callback:callback}
         * */
        queryBySql_fields:function(param){
            var that=this,queryParams=[];
            var queryBySQLParams, queryBySQLService;
            for(var i=0;i<param.queryParams.length;i++){
               var queryParam = new SuperMap.REST.FilterParameter({
                    name: param.queryParams[i].name,
                    attributeFilter:param.queryParams[i].sql,
                    fields:typeof(param.queryParams[i].fields)==="undefined" ? "":param.queryParams[i].fields
               });
               queryParams.push(queryParam);
            }
            
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams:queryParams
            });
            queryBySQLService = new SuperMap.REST.QueryBySQLService(param.url, {
                eventListeners: {
                  "processCompleted":function(queryEventArgs){
                      if(typeof(param.successCallback)==="function"){
                        param.successCallback(queryEventArgs);
                      }
                    }, 
                   "processFailed": function(e){
	                    if(typeof(param.failCallback)==="function"){
	                    	param.failCallback(e);
	                    }
	               }
                  }});
            queryBySQLService.processAsync(queryBySQLParams);
        },  
        /*
         *    当前视野范围查询-图层服务
         *    url     服务地址
         *    sql     过滤条件
         *    layerName  图层名称
         *    callback  回调函数
         *    json={url:"",layerName:"",sql:"",start:0,expectCount:100,callback:""}
         */
        queryByMapExtent:function(json){
            var that=this;
            var queryParam,queryByGeometryParameters, queryService;
            if(typeof(json.fields)==="undefined"){
            	queryParam = new SuperMap.REST.FilterParameter({
                    name: json.layerName,
                    attributeFilter:json.sql 
                });
            }else{
            	queryParam = new SuperMap.REST.FilterParameter({
            		name: json.layerName,
            		attributeFilter:json.sql,
            		fields:typeof(json.fields)==="undefined" ? "":json.fields 
            	});            	
            }
            var viewBounds = that.map.map.getExtent();
            var points =[new SuperMap.Geometry.Point(viewBounds.left,viewBounds.top),
                       new SuperMap.Geometry.Point(viewBounds.right,viewBounds.top),
                       new SuperMap.Geometry.Point(viewBounds.right,viewBounds.bottom), 
                       new SuperMap.Geometry.Point(viewBounds.left,viewBounds.bottom)
                      ];
             var linearRings = new SuperMap.Geometry.LinearRing(points);
             //var lv = new SuperMap.Feature.Vector(linearRings);
             //that.map.vectorLayer.addFeatures(lv);
             var region = new SuperMap.Geometry.Polygon([linearRings]);
            queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters({
                queryParams: [queryParam],
                geometry: region,
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
                startRecord:json.start,
                expectCount:json.expectCount
            });
            queryService = new SuperMap.REST.QueryByGeometryService(json.url);
            queryService.events.on({
                  "processCompleted": function(queryEventArgs){
                      if(typeof(json.callback)==="function"){
                          json.callback(queryEventArgs);
                      }
                  },
                  "processFailed":that._functionFailed
                });
            queryService.processAsync(queryByGeometryParameters);
        },
        /* sql查询 查询一个图层
         * 需要传6个参数：
         * param.layerName //查询的图层
         * param.sql  //查询条件
         * param.url//服务地址
           param={url:"",layerName:"",sql:"",callback:callback}
         * */
        queryBySql:function(param){
            var that=this;
            var queryParam, queryBySQLParams, queryBySQLService;
            queryParam = new SuperMap.REST.FilterParameter({
                name: param.layerName,
                attributeFilter:param.sql
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam]
            });
            queryBySQLService = new SuperMap.REST.QueryBySQLService(param.url, {
                eventListeners: {
                  "processCompleted":function(queryEventArgs){
                      if(typeof(param.successCallback)==="function"){
                        param.successCallback(queryEventArgs);
                      }
                    }, 
                   "processFailed": function(e){
	                    if(typeof(param.failCallback)==="function"){
	                    	param.failCallback(e);
	                    }
	               }
                  }});
            queryBySQLService.processAsync(queryBySQLParams);
        },        
        /* sql查询 查询多个图层
         * 需要传6个参数：
         * param.queryParams=[{name:"",sql:""},{name:"",sql:""}];
         * param.sql  //查询条件
         * param.url//服务地址
           param={url:"",layerName:"",sql:"",callback:callback}
         * */
        queryManyLayerBySql:function(param){
            var that=this,queryParams=[];
            var queryBySQLParams, queryBySQLService;
            for(var i=0;i<param.queryParams.length;i++){
               var queryParam = new SuperMap.REST.FilterParameter({
                    name: param.queryParams[i].name,
                    attributeFilter:param.queryParams[i].sql
               });
               queryParams.push(queryParam);
            }
            
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams:queryParams
            });
            queryBySQLService = new SuperMap.REST.QueryBySQLService(param.url, {
                eventListeners: {
                  "processCompleted":function(queryEventArgs){
                      if(typeof(param.successCallback)==="function"){
                        param.successCallback(queryEventArgs);
                      }
                    }, 
                   "processFailed": function(e){
	                    if(typeof(param.failCallback)==="function"){
	                    	param.failCallback(e);
	                    }
	               }
                  }});
            queryBySQLService.processAsync(queryBySQLParams);
        },  
        /* sql查询字段值
         * 需要传7个参数：
         * param.layerName //查询的图层
         * param.sql   查询条件
         * param.url    服务地址
         * param.fields   返回的查询字段名称
         * param.groupBy 按那个字段统计
         * param.successCallback 成功回调
         * param.failedCallback 失败回调
         * param={url:"",layerName:"",sql:"",groupByField:"",fields:[],successCallback:callback,failedCallback:fun}
         * */
        queryFieldBySql:function(param){ 
            var that=this;
            var queryParam, queryBySQLParams, queryBySQLService;
            queryParam = new SuperMap.REST.FilterParameter({
                name: param.layerName,
                attributeFilter:param.sql,
                groupBy:typeof(param.groupByField)==="undefined" ? "":param.groupByField,
                fields:typeof(param.fields)==="undefined" ? "":param.fields
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam]               
            });
            queryBySQLService = new SuperMap.REST.QueryBySQLService(param.url, {
                eventListeners: {
            		"processCompleted":function(queryEventArgs){
		                if(typeof(param.successCallback)==="function"){
		                	param.successCallback(queryEventArgs);
		                }
			         }, 
			         "processFailed":function(e){
		                if(typeof(param.failedCallback)==="function"){
		                    param.failedCallback(e.error.errorMsg);
		                }else{
		              	  that._functionFailed(e);
		                }
		             }
                  }});
            queryBySQLService.processAsync(queryBySQLParams);
        },
        
        
        
        /*
         * sql查询地图服务
         * sql查询
         * 需要传6个参数：
         * json.layerName //查询的图层
         * json.sql  //查询条件
         * json.url//服务地址
         * json.callback
         * json.startRecord
         * json.expectCount
         * */
        queryMapService:function(json){
            var that=this;
            var queryParam, queryBySQLParams, queryBySQLService;
            queryParam = new SuperMap.REST.FilterParameter({
                name: json.layerName,
                attributeFilter:json.sql
            });
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams: [queryParam],
                startRecord:json.startRecord,
                expectCount:json.expectCount
            });
            queryBySQLService = new SuperMap.REST.QueryBySQLService(json.url, {
                eventListeners: {"processCompleted":function(queryEventArgs){
                    if(typeof(json.callback)==="function"){
                        json.callback(queryEventArgs);
                    }
                }, "processFailed": this._functionFailed}});
            queryBySQLService.processAsync(queryBySQLParams);
        },
        /*
         * sql查询地图服务
         * sql查询
         * 需要传7个参数
         * json.queryParams 查询参数
         * json.url//服务地址
         * json.callback 
           json.startRecord 开始记录
           json.expectCount 返回记录
         * json.queryParams=[{name:"",sql:""},{name:"",sql:""}];
         *
         * */
        queryMapLayersService:function(json){
            var that=this,queryParams=[];
            var queryBySQLParams, queryBySQLService;
            for(var i=0;i<json.queryParams.length;i++){
               var queryParam = new SuperMap.REST.FilterParameter({
                    name: json.queryParams[i].name,
                    attributeFilter:json.queryParams[i].sql
               });
               queryParams.push(queryParam);
            }
            
            queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
                queryParams:queryParams,
                startRecord:json.startRecord,
                expectCount:json.expectCount
            });
            queryBySQLService = new SuperMap.REST.QueryBySQLService(json.url, {
                eventListeners: {"processCompleted":function(queryEventArgs){
                    if(typeof(json.callback)==="function"){
                        json.callback(queryEventArgs);
                    }
                }, "processFailed": this._functionFailed}});
            queryBySQLService.processAsync(queryBySQLParams);
        },
        /*
         * 地图服务——范围查询
         * 需要传6个参数
         * json.queryParams 查询参数 json.queryParams=[{name:"",sql:""},{name:"",sql:""}];
         * json.url   服务地址
         * json.callback 
         * json.queryBounds  地图查询范围
         * json.startRecord   
         * json.expectCount
         * */
        queryBoundsService:function(json){
            var that=this,queryParams=[];
            var queryBySQLParams,queryBySQLService;
            for(var i=0;i<json.queryParams.length;i++){
               var queryParam = new SuperMap.REST.FilterParameter({
                    name: json.queryParams[i].name,
                    attributeFilter:json.queryParams[i].sql
               });
               queryParams.push(queryParam);
            }
            
            queryBySQLParams = new SuperMap.REST.QueryByBoundsParameters({
                queryParams:queryParams,
                bounds:json.bounds,
                startRecord:json.startRecord,
                expectCount:json.expectCount
            });
            queryBySQLService = new SuperMap.REST.QueryByBoundsService(json.url, {
                eventListeners: {
                  "processCompleted":function(queryEventArgs){
                    if(typeof(json.callback)==="function"){
                        json.callback(queryEventArgs);
                    }
                },"processFailed": this._functionFailed}});
            queryBySQLService.processAsync(queryBySQLParams);
        },
        /*
         * 地图服务——几何查询
         * 需要传5个参数
         * json.queryParams 查询参数 json.queryParams=[{name:"",sql:""},{name:"",sql:""}];
         * json.url   服务地址
         * json.callback 
         * json.geometry  地图查询范围
         * json.queryMode CONTAIN
         * */
        queryGeometrysService:function(json){
            var that=this,queryParams=[];
            var queryBySQLParams, queryBySQLService;
            for(var i=0;i<json.queryParams.length;i++){
               var queryParam = new SuperMap.REST.FilterParameter({
                    name: json.queryParams[i].name,
                    attributeFilter:json.queryParams[i].sql
               });
               queryParams.push(queryParam);
            }            
            queryBySQLParams = new SuperMap.REST.QueryByGeometryParameters({
                queryParams:queryParams,
                geometry:json.geometry,
                isNearest:json.isNearest==undefined?false:json.isNearest,
                spatialQueryMode:json.queryMode,
                startRecord:json.startRecord=json.startRecord==undefined?0:json.startRecord,
                expectCount:json.expectCount=json.expectCount==undefined?1000000:json.expectCount
            });
            queryBySQLService = new SuperMap.REST.QueryByGeometryService(json.url, {
                eventListeners: {
                  "processCompleted":function(queryEventArgs){
                    if(typeof(json.successCallback)==="function"){
                        json.successCallback(queryEventArgs);
                    }
                },"processFailed": function(){
                	if(typeof(json.faileCallback)==="function"){
                        json.faileCallback(queryEventArgs);
                    }else{
                    	that._functionFailed;
                    }
                }}});
            queryBySQLService.processAsync(queryBySQLParams);
        },     
        /*
         * 地图服务——距离查询查询
         * 需要传8个参数
         * json.url   服务地址
         * json.queryParams 查询参数 json.queryParams=[{name:"",sql:""},{name:"",sql:""}];
         * json.geometry  地图查询范围
         * isNearest  true  选择最近查询
         * json.distance  查询距离
         * json.expectCount  期望返回
         * json.successCallback 成功回调
         * json.failCallback 失败回调
         * */
        queryByDistanceService:function(json){
            var that=this,queryParams=[];
            var queryBySQLParams, queryBySQLService;
            for(var i=0;i<json.queryParams.length;i++){
               var queryParam = new SuperMap.REST.FilterParameter({
                    name: json.queryParams[i].name,
                    attributeFilter:json.queryParams[i].sql
               });
               queryParams.push(queryParam);
            }            
            queryBySQLParams = new SuperMap.REST.QueryByGeometryParameters({
                queryParams:queryParams,
                isNearest:json.isNearest==undefined?false:json.isNearest,
        		expectCount:json.expectCount==undefined?10000000:json.expectCount,		
                geometry: json.geometry,
        		returnContent:true
            });
            queryBySQLService = new SuperMap.REST.QueryByGeometryService(json.url,{
                eventListeners: {
                  "processCompleted":function(queryEventArgs){
	                    if(typeof(json.successCallback)==="function"){
	                        json.successCallback(queryEventArgs);
	                    }
	               },
	               "processFailed":function(queryEventArgs){
	                    if(typeof(json.failCallback)==="function"){
	                        json.failCallback(queryEventArgs);
	                    }
	               }
	             }
            });
            queryBySQLService.processAsync(queryBySQLParams);
        }, 
        /*
         *    查询图层服务
         *    r     半径
         *    url     服务地址
         *    sql     过滤条件
         *    layerName  图层名称
         *    geometry  point对象
         *    callback  回调函数
         */
        getBufferByLayers:function(json){
            var that=this;
            if(Object.prototype.toString.call(json.r)==="[object Number]"){
                //json.r=(1/this.mitersTodegree(json.geometry.getCentroid().y))*json.r;
            }else{
                //json.r=(1/this.mitersTodegree(json.geometry.getCentroid().y))*10;
            }
            var queryParam = new SuperMap.REST.FilterParameter({
                      name:json.layerName,
                      attributeFilter:json.sql
                });

            var queryByDistanceParams = new SuperMap.REST.QueryByDistanceParameters({
                    queryParams: [queryParam],
                    returnContent: true,
                    isNearest:true,
                    distance: json.r,
                    geometry: json.geometry
                }); 

            var queryByDistanceService = new SuperMap.REST.QueryByDistanceService(json.url);
            queryByDistanceService.events.on({
                  "processCompleted": function(getFeaturesEventArgs){
                      if(typeof(json.callback)==="function"){
                        json.callback(getFeaturesEventArgs);
                      }
                  },
                  "processFailed": that._functionFailed
            });
            queryByDistanceService.processAsync(queryByDistanceParams);
        },
        

        /***############################## 数据服务  ############################*/
         /*
         * args r     半径
         *    url     数据服务地址
         *    sql     过滤条件
         *    dataSets  数据集集合
         *    geometry  point对象
         *    callback  回调函数
         */
        getBufferBydata:function(json){
              var that=this;
              if(Object.prototype.toString.call(json.r)==="[object Number]"){
                json.r=(1/this.mitersTodegree(json.geometry.getCentroid().y))*json.r;
              }else{
                json.r=(1/this.mitersTodegree(json.geometry.getCentroid().y))*10;
              }
              var getFeatureParameter = new SuperMap.REST.GetFeaturesByBufferParameters({
                  bufferDistance: json.r,
                  attributeFilter: json.sql==undefined?"":json.sql,
                  datasetNames: json.dataSets,
                  returnContent:true,
                  geometry: json.geometry
              });
              getFeatureService = new SuperMap.REST.GetFeaturesByBufferService(json.url, {
                eventListeners: {
                  "processCompleted": function(getFeaturesEventArgs){
                    if(typeof(json.callback)==="function"){
                        json.callback(getFeaturesEventArgs);
                    }
                  },
                  "processFailed": this._functionFailed
                }
              });
              getFeatureService.processAsync(getFeatureParameter);
        },
         /*
         * args *url    数据服务地址
         *    *sql    过滤条件
         *    *dataName 数据集名称
         *    *dataSets 数据集集合
         *    *callback 回调函数
         *    formindex 从第几条记录开始  
         *    toindex   到第几条记录结束
         */
        getSqlBydataOrder:function(json){
              var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;

              getFeatureParam = new SuperMap.REST.FilterParameter({
                name:json.dataName,
                orderBy:json.orderBy,
                attributeFilter: json.sql
              });
              if(json.fromindex==''||json.fromindex==undefined||json.toindex==""||json.toindex==undefined){
                getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
                  queryParameter: getFeatureParam,
                  datasetNames:json.dataSets
                });
              }else{
                getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
                    queryParameter: getFeatureParam,
                    datasetNames:json.dataSets,
                    fromIndex:json.fromindex,
                    toIndex:json.toindex
                });
              }
              getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(json.url, {
                eventListeners: {"processCompleted": function(getFeaturesEventArgs){
                    if(typeof(json.callback)==="function"){
                      json.callback(getFeaturesEventArgs);
                    }
                  }, "processFailed": this._functionFailed
                }
              });
              getFeatureBySQLService.processAsync(getFeatureBySQLParams);
        },
        /*数据服务查询，没有记录以及排序等功能
         * args *url    数据服务地址
         *    *sql    过滤条件
         *    *dataName 数据源+数据集名称
         *    *callback 回调函数
         */
        getSqlBydata:function(json){
            var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
            getFeatureParam = new SuperMap.REST.FilterParameter({
                attributeFilter: json.sql
            });
            getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
                queryParameter: getFeatureParam,
                toIndex : -1,
                datasetNames: [json.dataName]
            });
            getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(json.url, {
                eventListeners: {
                    "processCompleted":function(queryEventArgs){
	                    if(typeof(json.successCallback)==="function"){
	                        json.successCallback(queryEventArgs);
	                    }
	               },
	               "processFailed":function(queryEventArgs){
	                    if(typeof(json.failCallback)==="function"){
	                        json.failCallback(queryEventArgs);
	                    }
	               }
                }
            });
            getFeatureBySQLService.processAsync(getFeatureBySQLParams);
        },
        //按照几何查询
        _queryByGeometry:function(param){
            
        },
        
        //查询回调函数
        _functionCompleted:function(that,queryEventArgs){
            
        },
         //查询失败函数
        _functionFailed:function(e){
            console.log("查询失败:"+e.error.errorMsg);
        },
        queryDataCommonService:function(json){
            $.ajax({  
                url:json.url, 
                type:'get',  
                dataType:'json',  
                success:function(data) {  
                    if(typeof(json.callback)==="function"){
                        json.callback(data);
                    }
                 },  
                 error : function() {   
                      console.log("查询失败:");
                 }  
            });
        },
        /***############################## 公共方法  ############################*/
        
       
        //米转换为度
        mitersTodegree:function(lat){
            return 2*Math.PI*Math.cos(2*Math.PI/360*lat)*6378140/360;       
        },
       
        //度换为米转 返回公里
        //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
        degreeTomiters:function(lat1,lng1,lat2,lng2){
            var radLat1 = getDegree(lat1);
            var radLat2 = getDegree(lat2);
            var a = radLat1 - radLat2;
            var b = getDegree(lng1) - getDegree(lng2);
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
            Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
            s = s *6378.137 ;// EARTH_RADIUS;
            s = Math.round(s * 10000) / 10000; //输出为公里
            s=s.toFixed(4);
            return s;
        },
        //经纬度转换成三角函数中度分表形式。
        getDegree:function(d){
           return d * Math.PI / 180.0;
        },
        //将对象转换成json
        argstojson:function(queryEventArgs){
          var json=[];
          var i, j, result = queryEventArgs.result,marker;//queryEventArgs服务端返回的对象
            if (result && result.recordsets) {
                for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
                    if (recordsets[i].features) {
                        for (j=0; j<recordsets[i].features.length; j++) {
                          if(recordsets[i].features[j].attributes!=null&&recordsets[i].features[j].attributes!=undefined){
                            json.push(recordsets[i].features[j].attributes);
                            if(json[j].SMX==undefined){
                                  // var components=recordsets[i].features[j].geometry.components;
                                  // json[j].SMX=components[parseInt(components.length/2)].x;
                                  // json[j].SMY=components[parseInt(components.length/2)].y;
                                  var geometry=recordsets[i].features[j].geometry;
                                  json[j].SMX=geometry.getCentroid().x;
                                  json[j].SMY=geometry.getCentroid().y;
                            }
                          }
                        }
                    }
                }
            }
            return json;
        }
    };
    
    //给外部提供接口
	module.exports = Query;
});