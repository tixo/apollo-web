/**
 * 飞行控件api
 */
define(function(require, exports, module){
	//parent.window.supermap3DUtils.sceneUtil.mScene;
	//var sceneUt = require("./scene.js"); 
	var baseUrl = "mymap/supermap/webgl/supermap/3D/";
	var uploadPath="mymap/assets/upload/SceneRoutes/"
	var flyManagerControl = {
		sceneId:"",//飞行DIV的ID
		viewer: {},
		flyManager: {},
		/**
		 * 加载飞行控件
		 * @param {Object} type
		 */
		initFlyManagerControl: function(type){
			var mScene = parent.window.scene3DAPI.supermap3DUtils.sceneUtil
			var viewerObj= parent.window.scene3DAPI.supermap3DUtils.sceneUtil.viewer;
			var domid=mScene.domId;
			if(type==undefined || domid==undefined || viewerObj==undefined){
				console.log("初始化飞行控件必须参数不完整！");
				return;
			}else{
				flyManagerControl.sceneId = domid;
				flyManagerControl.viewer = viewerObj;
			}
			if(type==true){
				$("#flyManagerControl").remove();
				$("#"+domid).append(
					"<div id='flyManagerControl' style='position: absolute;left: 30px;top: 80px;z-index:9999'>"
						+"<div id='uploadRoad' style='position: absolute;margin-left: 8px;margin-top: 36px;width:19px; height:30px; line-height:33px; padding-left:4px; padding-right:18px; background:#676767 no-repeat right 4px; border-radius:5px; font-size: 14px; color:#ffffff; cursor:pointer'>"
						+"<img src='"+baseUrl+"images/fly/上传.png' />"
						+"</div>"
						+"<div id='downList' style='position: absolute;margin-left: 64px;margin-top: 34px'>"
		    			+"<p style='width:90px; height:30px; line-height:33px; padding-left:12px; padding-right:12px; background:#828282 no-repeat right 4px; border-radius:5px; font-size: 14px; color:#ffffff; cursor:pointer;box-shadow: 0 0 6px 2px rgba(255, 255, 255, .6)'>请选择路线</p>"
					    +"<ul style='width:160px; background:#e6e6e6; margin-top:2px; border-radius: 2px; position:absolute; display:none;padding-left: 0'>"    
					    +"</ul>" 
		    			+"</div>"
						+"<img src='"+baseUrl+"images/fly/FXMB.png' />"
			    		+"<div id='' class='FX' style='position: absolute;margin-left: 176px;margin-top: -44px;'>"
			    			+"<div id='play' style='float: left;margin-left: 17px;cursor:pointer'>"
			    				+"<img src='"+baseUrl+"images/fly/fx_1.png' />"
				    		+"</div>"
				    		+"<div id='pause' style='float: left;margin-left: 17px;cursor:pointer'>"
				    			+"<img src='"+baseUrl+"images/fly/fx_2.png' />"
				    		+"</div>"
				    		+"<div id='stop' style='float: left;margin-left: 17px;cursor:pointer'>"
				    			+"<img src='"+baseUrl+"images/fly/fx_3.png' />"
				    		+"</div>"
				    		+"<div id='slowDown' style='float: left;margin-left: 17px;cursor:pointer'>"
				    			+"<img src='"+baseUrl+"images/fly/fx_4.png' />"
				    		+"</div>"
				    		+"<div id='speedUp' style='float: left;margin-left: 17px;cursor:pointer'>"
				    			+"<img src='"+baseUrl+"images/fly/fx_5.png' />"
				    		+"</div>"
			    		+"</div>"
			    		+"<div id='close' style='position: absolute;margin-left: 420px;margin-top: -79px;width:23px; height:23px; cursor:pointer'>"
			    			+"<img src='"+baseUrl+"images/fly/close.png' />"
			    		+"</div>"
					+"</div>"
				);
				flyManagerControl.uploadFile();
				flyManagerControl.getUploadFiles();
				flyManagerControl.downListChoose();
				flyManagerControl.flyManagerClick();
				flyManagerControl.flyManagerControlMove();
			}else{
				$("#flyManagerControl").remove();
			}
		},
		/**
		 * 飞行路线下拉列表选择事件 
		 */
		downListChoose:function(){
			
			$("#downList p").click(function(){ 

				 var ul = $("#downList ul"); 
			    if(ul.css("display")=="none"){ 
			        ul.slideDown("fast"); 
			    }else{ 
			        ul.slideUp("fast"); 
			    } 
			}); 
			$("#downList ul li a").click(function(){ 
				//getStrLength=function(s){return s.replace(/[^\x00-\xff]/g,"aa").length;}
				var txt = $(this).text(); 
				var maxwidth=10;
				var subtxt=flyManagerControl.cutString(txt,maxwidth)
			    $("#downList p").html(subtxt); 
			    $("#downList ul").hide();
			    //选择飞行文件
			    var routes = new Cesium.RouteCollection();
			    var scene = flyManagerControl.viewer.scene;
			    var fpfUrl =uploadPath+txt;
			    routes.fromFile(fpfUrl);
			    flyManagerControl.flyManager = new Cesium.FlyManager({
	                scene : scene,
	                routes : routes
            	});
			}); 
			$("#downList ul li a").mouseenter(function(){
				$(this).css({"background":"#eeeef1", "color":"black"});
			});
			$("#downList ul li a").mouseout(function(){
				$(this).css("background","#e6e6e6").css("color","#525252");
			});
		},
		cutString:function(str, len) {
			   //length属性读出来的汉字长度为1
			   if(str.length*2 <= len) {
			     return str;
			   } 
			   var strlen = 0;
			   var s = ""; 		 
			   for(var i = 0;i < str.length; i++) { 	 
			     s = s + str.charAt(i); 
			     if (str.charCodeAt(i) > 128) {
			       strlen = strlen + 2;
			       if(strlen >= len){
			         return s.substring(0,s.length) + "...";
			       }
			     } else {
			       strlen = strlen + 1;
			       if(strlen >= len){
			         return s.substring(0,s.length) + "...";
			       }
			     }
			   }
			   return s;
			 } ,
		/**
		 * 飞行控制按钮点击事件
		 */
		flyManagerClick:function(){
//			$('#test9').click(function(){
//				flyManagerControl.uploadFile();
//
//			});
			$('#play').click(function(){
            	flyManagerControl.flyManager.play();
	        });
	        $('#pause').click(function(){
	            flyManagerControl.flyManager.pause();
	        });
	        $('#stop').click(function(){
	            flyManagerControl.flyManager.stop();
	        });
	        $('#slowDown').click(function(){
	        	flyManagerControl.flyManager.playRate=flyManagerControl.flyManager.playRate-1;
	        });
	         $('#speedUp').click(function(){
	        	flyManagerControl.flyManager.playRate=flyManagerControl.flyManager.playRate+1;
	        });
	        $('#close').click(function(){
	        	$("#flyManagerControl").remove();
	        });
		},
		/**
		 * ajax获取服务器端飞行路线文件夹下所有飞行路线文件.
		 */
		getUploadFiles:function(){
			$.ajax({
				url:"getUploadFiles",
				async:false,
				type: "POST",
				//dataType: "jsonp",
				success: function (data) {
				console.log(data);
					var filelist=data.filelist;
					filelist=filelist.slice(1,filelist.length-1).split(",")
					 var ul = $("#downList ul"); 
					$("#downList ul li").remove();
					for(i=0;i<filelist.length;i++)
					{
						var li="<li class='downli' style='height:24px; with:50px;line-height:24px; text-indent:10px;list-style:none'><a href='#' rel='1' style='display:block; height:24px; color:#525252; text-decoration:none;font-size: 14px'>"
						+$.trim(filelist[i])
						+"</a></li>" 	
						ul.append(li);
					}

				},
				error: function (XMLHttpRequest, textStatus, error) {
					console.log(error);
				}
				})
		},
		/**
		 * 上传文件
		 */
		uploadFile:function(){

		layui.use('upload', function(){
			var upload = layui.upload;
			//执行实例
			upload.render({
//				elem: '#test9' //绑定元素
				elem: '#uploadRoad' //绑定元素
				,url: 'upload' //上传接口
				,accept: 'file'
				,exts:'fpf'
				,size: 1024//单位:kb
				//,auto: false
				,done: function(res){
					parent.window.ui.dialog.showButton({title:"提示",content:res.message});
					flyManagerControl.initFlyManagerControl(true);//由于flyManagerControl.getUploadFiles();方法执行后无法选择li，采取重新初始化飞行控件进行初始化。
					//上传完毕回调
				}
				,error: function(res){
					//请求异常回调
					parent.window.ui.dialog.showButton({title:"提示",content:res.message});

				}
			});
			
		});
	},
		/**
		 * 飞行控件移动事件
		 */
		flyManagerControlMove: function(sceneID){
			var moveObj = $("#flyManagerControl");
            moveObj.bind("mousedown",start);  
            function start(event){  
                if(event.button==0){
                    gapX=event.clientX-moveObj.position().left;  
                    gapY=event.clientY-moveObj.position().top;  
                    moveObj.bind("mousemove",move);  
                    moveObj.bind("mouseup",stop);  
                }  
                return false;
            }  
            function move(event){  
            	le=event.clientX-gapX;
            	to=event.clientY-gapY;
            	if(le<0){
            		le=0;
            	}
            	if(le>($(window).width()-$("#left_iframe").css("width").replace("px","")*1-600)){
            		le=$(window).width()-$("#left_iframe").css("width").replace("px","")*1-600;
            	}
            	if(to<60){
            		to=60;
            	}
            	if(to>($("#main_middle_iframe").css("height").replace("px","")*1-90)){
            		to=$("#main_middle_iframe").css("height").replace("px","")*1-90;
            	}
                moveObj.css({  
                    "left":(le)+"px",  
                    "top":(to)+"px"  
                });  
                return false;
            }  
            function stop(){  
                moveObj.unbind("mousemove",move);  
                moveObj.unbind("mouseup",stop);  
                  
            } 
		}
	};
	//给外部提供接口
	module.exports = flyManagerControl;
});