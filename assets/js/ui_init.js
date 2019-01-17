/*
 * 框架ui初始化组
 * @author zjc,appea
 */
define(function(require, exports, module) {
	(function(){
        //加载工具栏
        toolInit();
		//指定dom元素按钮提示功能,ie7及以下版本不兼容
//		if($.browser.msie){ 
//			if(Number($.browser.version)>7){
//				iqtip('.tool[alt],#operateInfoTab[alt],.mapSwitch_btn[alt]');
//			}
//		}else{
//			iqtip('.tool[alt],#operateInfoTab[alt],.mapSwitch_btn[alt]');
//		}
		//加载模态对话框
//		custombox=custombox();
//		dialog=dialog();
		//加载收起左侧面板按钮
//		operateInfoTab=operateInfoTab();
	})();
	//收放左侧导航栏按钮功能
	function operateInfoTab(){
		$("#operateInfoTab").bind({
			click:function(){
				if($(".main_middle_right").offset().left>0){
					$(".main_middle_right").animate({left:"0px"},function(){
						$("#operateInfoTab").css("background-image",$("#operateInfoTab").css("background-image").replace("left","right"));
					});
				}else{
					$(".main_middle_right").animate({left:$(".main_middle_left").width()},function(){
						$("#operateInfoTab").css("background-image",$("#operateInfoTab").css("background-image").replace("right","left"));
					});
				}
			}
		});
		return{
			open:function(){
				if($(".main_middle_right").offset().left==0){
					$("#operateInfoTab").trigger("click");
				}
			},
			close:function(){
				if($(".main_middle_right").offset().left>0){
					$("#operateInfoTab").trigger("click");
				}
			},
			lock:function(){
				$("#operateInfoTab").unbind("click");
			},
			unlock:function(){
				$("#operateInfoTab").bind("click");
			}
		}
	}
	//开启加载动画
	function openLoading (){
		$("#loadingbar_bg").css("display","block");
	}
	//关闭加载动画
	function closeLoading(){
		$("#loadingbar_bg").css("display","none");
	}
	//加载工具栏
	function toolInit(){
		$(".tool").bind({
			//工具栏动画
			mouseover:function(){
				var that=this;
				$(".hover_bar").show();
				$(".hover_bar").stop();
				$(".hover_bar").find("div").eq(1).stop();
				$(".hover_bar").animate({
					left:$(this).offset().left-$(".main_middle_right").offset().left-5
				},200);
				$(".hover_bar").find("div").eq(1).animate({
					width:$(that).width()+3
				},200);
			},
			mouseleave:function(){
				$(".hover_bar").hide();
			},
			//工具栏功能
			click:function(){
				if($(this).context.id=="tool_full"){
				}else if($(this).context.id=="tool_edis"){
					measure2D.meatureDistenceStart();
				}else if($(this).context.id=="tool_earea"){
					measure2D.meatureAreaStart();
				}else if($(this).context.id=="tool_sdis"){
					scene3DAPI.supermap3DUtils.measure3DUtil.activateMeasure3DControl("DIS");
				}else if($(this).context.id=="tool_sarea"){
					scene3DAPI.supermap3DUtils.measure3DUtil.activateMeasure3DControl("AREA");
				}else if($(this).context.id=="tool_sheight"){
					scene3DAPI.supermap3DUtils.measure3DUtil.activateMeasure3DControl("HEIGHT");
				}else if($(this).context.id=="tool_clear"){
					scene3DAPI.supermap3DUtils.measure3DUtil.deactiveAllMeasure3DControl();
				}else if($(this).html().indexOf("全屏")>=0){
					if($(".main_middle").offset().top!=0){
						$(".main_top").css("display","none");
						$(".main_middle").css("top","0px");
						operateInfoTab.close();
					}else{
						$(".main_top").css("display","block");
						$(".main_middle").css("top",$(".main_top").height()+"px");
					}
				}else if($(this).html().indexOf("欢迎")>=0){
					var config={
						title:"系统注销",
						content:"注销当前用户？",
						button:[
							 {
					            name: '是',
						            callback: function () {
						            	var domain=window.location.host.substr(0,window.location.host.indexOf(":"));
						            	$.cookie('userName',"",{expires:-1,path:'/',domain:domain});
										$.cookie('dataAction',"",{expires:-1,path:'/',domain:domain});
										$.cookie('sysAction',"",{expires:-1,path:'/',domain:domain});
										$.cookie('userDeptname',"",{expires:-1,path:'/',domain:domain});
										$.cookie('userChiname',"",{expires:-1,path:'/',domain:domain});
						                window.location="mymap/app/login/login.html";
						                return false;
						            },
						            focus: true
						        },
						        {
						            name: '否',
						            callback: function () {

						            }
						        }
						]
					}
					dialog.showButton(config);
				}
			}
		});
		//读取当前登录用户
		(function(){
			var userinfo;
			if(typeof(window.userChiname)!="undefined" && window.userChiname!=""){
				userinfo="欢迎您，"+window.userChiname;
			}else{
				if(typeof(window.userName)!="undefined" && window.userName!=""){
					userinfo="欢迎您，"+window.userName;
				}else{
					userinfo="欢迎您";
				}
			}
			$("#userinfo").append(userinfo);
		})();
		//双击取消加载动画
		$("#loadingbar_bg").dblclick(function(){
			$("#loadingbar_bg").css("display","none");
		});
	}

	//提示框效果
	function iqtip(domstr){
		$("<link>").attr({ 
			rel: "stylesheet",
	        type: "text/css",
	        href: "../../../module/plugins/qtip/jquery.qtip.min.css"
	    }).appendTo("head");
		$.getScript("../module/plugins/qtip/jquery.qtip.min.js",function(){
			$(domstr).qtip({
			    content: {
			        attr: 'alt'
			    },
			    style: {
		          	classes: 'qtip-bootstrap'
		        },
		        position: {
		        	adjust: {
		        		x: -20,
		        		y: 0
		        	}
		        },
		        delay:500
			});
		});
	}
	//模态对话框效果1
	function custombox(){
		$("<link>").attr({ 
			rel: "stylesheet",
	        type: "text/css",
	        href: "mymap/module/plugins/custombox/src/jquery.custombox.css"
	    }).appendTo("head");
		$.getScript("mymap/module/plugins/custombox/src/jquery.custombox.js");
		return{
			showContent:function(content){
				$("#custombox_content").remove();
				var $div = $("<div id='custombox_content'>" + content + "<div id='custombox_close' onclick='$.fn.custombox(&quot;close&quot;);'>×</div></div>");
             	$("body").append($div);
				$.fn.custombox({
				                url: '#custombox_content',
				                effect: 'fadein',
				                overlay:true,
				                overlayClose:true
				            });
        		return false;
			}
		}
	}
	//模态对话框效果2
	function dialog(){
		return {
			isInit:false,
			object:null,
			cache:"",
			initDialog:function(callback,a){
				var that=this;
				$("<link>").attr({ 
					rel: "stylesheet",
			        type: "text/css",
			        href: "mymap/module/plugins/artdialog/skins/blue.css"
			    }).appendTo("head");
		    	$.getScript("mymap/module/plugins/artdialog/artDialog.source.js",function(){
		    		callback.apply(that,[a]);
		    	});
			    
			    this.isInit=true;
			},
			close:function(){
				if(this.object!=undefined&&this.object!=null)
					this.object.close();
			},
			showLoading:function(){
				if(this.isInit==false){
					this.initDialog(this.showLoading);
					return;
				}
				this.object=art.dialog({//请求前弹出加载窗口
					 content:"<div style='margin:8px;font-family:微软雅黑;font-size:14px;z-index:100000;'><img style='vertical-align: middle;' src='module/plugins/artdialog/skins/icons/loading.gif'/>&nbsp;&nbsp;正在加载，请稍后!</div>",
					 title: false,//无标题，无关闭按钮
					 top: '49%',//高度为一半
					 opacity:0.2,//透明度
					 padding:0,//边框
			         cancel: false,//不可关闭
			         fixed: true,//不可拖拽
			         lock: true//锁屏
				});
			},
			showContent:function(a){//第一个参数为内容，第二个参数为时间
				if(this.isInit==false){
					this.initDialog(this.showContent,a);
					return;
				}
				this.object=art.dialog({
				    title: "提示——3秒钟后关闭",//无标题，无关闭按钮
					top: '49%',
					padding:"35px 35px" ,
					time:2,
				    content: "<div style='font-size:14px;min-width:100px;font-family:微软雅黑'>"+a+"</div>"
				});
			},
			showIframe:function(a){
				if(this.isInit==false){
					this.initDialog(this.showContent,a);
					return;
				}
				this.object=art.dialog({
					
				});
			},
			showButton:function(config){
				if(this.isInit==false){
					this.initDialog(this.showButton,config);
					return;
				}
				this.object=art.dialog({
				    title: config.title,
					top: '49%',
					padding:"20px 20px" ,
				    content: "<div style='font-size:14px;min-width:150px;font-family:微软雅黑'>"+config.content+"</div>",
				    button:config.button
				});
			}
		};
	}
	/*
	 * author:zjc
	 * 以下是ui组公共方法接口
	*/
	//切换左侧功能面板
	function changeLeftIframe(url,config){
		$(".loading").css("display","block");
		$("#left_iframe").attr("src",url);
		//结束等待
		$("#left_iframe").load(function(){
			if($("#left_iframe").attr("src").indexOf("sjsy.html")<0){
				$(".loading").css("display","none");
			}
		});
	}
	//展开左侧二级菜单
	function showLeftModule(url){
		$("#left_iframe_module").attr("src",url);
		$("#left_iframe_module").animate({width:"100%"},850);
		//$("#left_iframe").contents().find(".top_banner_back").eq(0).css("display","block");
		$("#left_iframe").contents().find(".top_content").eq(0).css("display","none");
	}
	//关闭左侧二级菜单
	function closeLeftModule(){
		$("#left_iframe_module").animate({width:"0%"},850);
		$("#left_iframe").contents().find(".top_banner_back").eq(0).css("display","none");
		$("#left_iframe").contents().find(".top_content").eq(0).css("display","block");
	}
	//打开右侧非gis模板
	function showCenterModule(url,config){
		if(typeof(config)!="undefined"){
			//按指定参数打开右侧面板
			$("#main_middle_iframe").css("width",typeof(config.width)=="undefined"?"100%":config.width);
			$("#main_middle_iframe").css("height",typeof(config.height)=="undefined"?"100%":config.height);
			$("#main_middle_iframe").css("top",typeof(config.top)=="undefined"?0:config.top);
			$("#main_middle_iframe").addClass("main_right_iframe");
		}else{
			//全屏打开右侧面板
			$("#main_middle_iframe").css("width","100%");
			$("#main_middle_iframe").css("height","100%");
			$("#main_middle_iframe").css("top","0px");
			$("#main_middle_iframe").removeClass("main_right_iframe");
		}
		$("#main_middle_iframe").attr("src",url);
		$("#main_middle_iframe").css("display","block");
	}
	//关闭右侧非gis模板
	function closeCenterModule(){
		$("#main_middle_iframe").attr("src","");
		$("#main_middle_iframe").css("display","none");
	}
	var ui={
		openLoading:openLoading,
		closeLoading:closeLoading,
		changeLeftIframe:changeLeftIframe,
		showLeftModule:showLeftModule,
		closeLeftModule:closeLeftModule,
		showCenterModule:showCenterModule,
		closeCenterModule:closeCenterModule,
		operateInfoTab:operateInfoTab,
		dialog:dialog
	}
	module.exports = ui;
	window.ui=ui;
});