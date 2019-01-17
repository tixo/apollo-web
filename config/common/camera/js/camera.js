/**
 * 视频播放
 * NPASDK 平台接入
 * v0.0.2
 * 请求连接url：http://{ip_addr}[:{port}]/{api_res}?ts={current_unix_timestamp}
 * [&{param_name1}={param_value1}][&{param_name2}={param_value2}]
 * [&...]&sc={url_encode_264_rsa_sha
 *1}
 *请求返回：Res:{
 *			res_code:{res_code},
 *			[data:”{data}”,]
 *			[msg:”{msg}”,]
 *		}
 */
//视频平台url 112
var cameraUrl1="http://10.100.4.7:9900";
var cameraUrl2="http://10.100.4.7:8800";
var cameraUrl3="http://10.100.4.7:6600";
var cameraUrl4="http://10.100.4.15:9600";
var cameraUrlLogin1="/login?ip=10.100.0.112&port=2100&user=admin&pwd=admin";
var cameraUrlLogin2="/login?ip=10.100.0.31&port=2100&user=admin&pwd=admin";
var version = "v0.0.2";
var user = "admin";
var authorizationCamera = 1;
var cameraLists = [];
var cameraId="";
function getAlias(){
	var time = new Date().getSeconds();
	window.alias1 = time;
	var time2 = new Date().getSeconds();
	window.alias2 = time2;
	var time3 = new Date().getSeconds();
	window.alias3 = time3;
}
//一期摄像头初始化登录
function cameraLogin1(){
	/*$.ajax({
	    url: cameraUrl1+"/init",
	    data: {},
	    type: "GET",
	    beforeSend: function(xhr){
			xhr.setRequestHeader('Npa-Sdk-Version',version);
			xhr.setRequestHeader('Npa-Sdk-User', user);
		},//这里设置header
	    success: function(data) {
	    	console.log("1连接摄像头init1成功...........");*/
	    	$.ajax({
			    url: cameraUrl1+cameraUrlLogin1,
			    type: "GET",
			    beforeSend: function(xhr){
					/*xhr.setRequestHeader('Npa-Sdk-Version',version);
					xhr.setRequestHeader('Npa-Sdk-User', user);*/
				},//这里设置header
			    success: function(data) {
			    	console.log("1连接摄像头登录成功...........");
			    	var time = new Date().getTime();
			    	alias1 = window.authorization.userId + time;
			    },
			    error(xhr,status,error){
			    	
			    }
			});
	    /*}
	});*/
}
//二期摄像头初始化登录
function cameraLogin2(){
	/*$.ajax({
	    url: cameraUrl2+"/init",
	    type: "GET",
	    beforeSend: function(xhr){
			xhr.setRequestHeader('Npa-Sdk-Version',version);
			xhr.setRequestHeader('Npa-Sdk-User', user);
		},//这里设置header
	    success: function(data) {
    		console.log("2连接摄像头init成功...........");*/
    		$.ajax({
			    url: cameraUrl2+cameraUrlLogin2,
			    type: "GET",
			    beforeSend: function(xhr){
					/*xhr.setRequestHeader('Npa-Sdk-Version',version);
					xhr.setRequestHeader('Npa-Sdk-User', user);*/
				},//这里设置header
			    success: function(data) {
			    	console.log("2连接摄像头登录成功...........");
			    	var time = new Date().getTime();
			    	alias2 = window.authorization.userId + time;
			    }
			});
	  /*  }
	});*/
}
var clearIntervalCamera={};
    //开启视频流
function openStream(name,cameraUrl,type,id){
	console.log("开启视频流...........");
	$.ajax({
	    url: cameraUrl[0]+"/stream?av_path="+name,
	    type: "GET",
	    dataType:"json",
	    beforeSend: function(xhr){
			/*xhr.setRequestHeader('Npa-Sdk-Version',version);
			xhr.setRequestHeader('Npa-Sdk-User', user);*/
		},//这里设置header
	    success: function(response) {
	    	if(response.res_code==0 && response.data!=""){
	    		//url  播放地址
		    	if(type==undefined){
		        	$("#sURL").attr("value",response.data);
		        }else{
		        	$("#sURL"+id).attr("value",response.data);
		        }
		    	setTimeout(function(){
		    		var names = [name];
		    		//加载
					start_stream(name, cameraUrl[0], response.data);
					load(cameraUrl,names);
		    		clearIntervalCamera[id] = setInterval(function(){ load(cameraUrl,names) }, 10000);
		    	},3000);
			}else{
				if(type!=undefined && type==2 && type!=1){
					$.showErrorInfo("获取视频流失败！");
				}else{
					$(window.parent.document).find(".messageInfo").html("获取视频流失败！");
				}
			}
	    },
	    error(xhr,status,error){
	    	if(type!=undefined && type==2 && type!=1){
	    		alert();
				$.showErrorInfo("视频服务出错！");
			}else{
				$(window.parent.document).find(".messageInfo").html("视频服务出错！");   	
			}
		}
	});
}
//关闭视频播放窗 取消10s加载
function clearIntervalCameraFun() {
	$.each(clearIntervalCamera, function(i,item) {
		 clearInterval(item[i]);
	});
   
}
//替换播放视频关闭10s加载
function clearIntervalCameraFunOne(id) {
	clearInterval(clearIntervalCamera[id]);
}
//授权获取摄像头
function authorizationCameraList(cameraUrl){
	console.log("开始授权摄像头...........");
	$.ajax({
	    url: cameraUrl+"/camera",
	    data: {},
	    type: "GET",
	    dataType:"json",
	    beforeSend: function(xhr){
			/*xhr.setRequestHeader('Npa-Sdk-Version',version);
			xhr.setRequestHeader('Npa-Sdk-User', user);*/
		},//这里设置header
	    success: function(data) {
	    	console.log("授权摄像头成功...........");
	    	/*authorizationCamera = data.res_code;*/
	    	setTimeout(function(){
	    		getCameraList(cameraUrl);
	    	},500);
	    }
	});
}
var authorizationCamera = 1;
//获取摄像头列表
function getCameraList(cameraUrl){
	console.log("获取摄像头列表...........");
	$.ajax({
	    url: cameraUrl+"/camera/list",
	    data: {},
	    type: "GET",
	    dataType:"json",
	    beforeSend: function(xhr){
			/*xhr.setRequestHeader('Npa-Sdk-Version', '{current_version});
			xhr.setRequestHeader('Npa-Sdk-User', '{current_user}');*/
		},//这里设置header
	    success: function(data) {
	    	console.log("获取摄像头成功...........");
	    	var code = data.res_code;
	    	if(0==code){
	    		var  list = data.data.cameras;
	    		//解析
	    		analysisCamera(list);
	    	}else{
	    		
	    	}
	    }
	});
}

function load(cameraUrl,names){
		//http://10.100.4.7:8800/stream/live?av_path=av/129&alias=mark_spaul&ip=10.100.4.123
	$.each(names, function(i,name) {
		$.ajax({
		    url: cameraUrl[0]+"/stream/live?av_path="+name+"&alias="+cameraUrl[1]+"&ip="+cameraUrl[2],
		    /*data: {"av_path":},*/
		    type: "GET",
		    beforeSend: function(xhr){
				/*xhr.setRequestHeader('Npa-Sdk-Version',version);
				xhr.setRequestHeader('Npa-Sdk-User', user);*/
			},//这里设置header
		    success: function(data) {
		    	console.log("10ｓ加载");
		    }
		});
	});
}




var  cameraNames=[{"name":"129"},{"name":"112"},{"name":"171"},{"name":"174"}];
//关闭视频流
function closeStream(names){
	console.log("关闭视频流...........");
	$.each(names, function(i,name) {
		$.ajax({
		    url: cameraUrl+"/stream/close?av_path="+name,
		    /*data: {"av_path":},*/
		    type: "GET",
		    beforeSend: function(xhr){
				/*xhr.setRequestHeader('Npa-Sdk-Version',version);
				xhr.setRequestHeader('Npa-Sdk-User', user);*/
			},//这里设置header
		    success: function(data) {
		    	console.log("关闭视频流。。。。。"+data);
		    }
		});
	});
	
}
//云台控制
function panRight(cameraUrl,name,cmd_p,speed){
	if(cmd_p==11 || cmd_p==12 || cmd_p==12){
		if (speed <-16 || speed > 16) {
	        return;
	    }
	}else{
		if (speed <0 || speed > 16) {
	        return;
	    }
	}
	$.ajax({
	    url: cameraUrl+"/ptz?av_path="+name+"&speed="+speed+"&cmd_p="+cmd_p,
	    /*data: {"av_path":},*/
	    type: "GET",
	    beforeSend: function(xhr){
			/*xhr.setRequestHeader('Npa-Sdk-Version',version);
			xhr.setRequestHeader('Npa-Sdk-User', user);*/
		},//这里设置header
	    success: function(data) {
	    	console.log(data);
	    }
	});
	
}
var isBroken = 0,sxt_total=0;
//解析摄像头数据
function analysisCamera(data){
	$.each(data,function(i,item){
		var info = JSON.parse(item.info);
		if(info.isBroken==0){
			isBroken++;
		}
	});
	$("#left_iframe").contents().find('#sxt_zx').html(isBroken);
	$("#left_iframe").contents().find("#zx3").css("width",((isBroken/sxt_total)*100)+"%");
}
var checkBoxFields = ['isLive', 'withCredentials', 'hasAudio', 'hasVideo'];
var streamURL, mediaSourceURL;

function flv_load(id,type) {
    console.log('isSupported: ' + flvjs.isSupported());
   /* if (mediaSourceURL.className === '') {
        var url = document.getElementById('msURL').value;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function(e) {
            var mediaDataSource = JSON.parse(xhr.response);
            flv_load_mds(mediaDataSource);
        }
        xhr.send();
    } else {*/
        var i;
        var mediaDataSource = {
            type: 'flv'
        };
        for (i = 0; i < checkBoxFields.length; i++) {
            var field = checkBoxFields[i];
            /** @type {HTMLInputElement} */
            var checkbox = document.getElementById(field);
            mediaDataSource[field] = checkbox.checked;
        }
        if(type==undefined){
        	id = "";
        }
        mediaDataSource['url'] = document.getElementById('sURL'+id).value;
        console.log('MediaDataSource', mediaDataSource);
        flv_load_mds(mediaDataSource,id,type);
   /* }*/
}

function flv_load_mds(mediaDataSource,id,type) {
    var element = document.getElementsByName('videoElement'+id)[0];
    /*if (typeof player !== "undefined") {
        if (player != null) {
            player.unload();
            player.detachMediaElement();
            player.destroy();
            player = null;
        }
    }*/
    var player1 = flvjs.createPlayer(mediaDataSource, {
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range',
    });
    player1.attachMediaElement(element);
    player1.load();
    if(type!=undefined && type==2 && type!=1){
		$.showSuccessTipAndGo("视频加载成功！");
	}else{
		$(".messageInfo").html("");
	}
}

function flv_start() {
    player.play();
}

function flv_pause() {
    player.pause();
}

function flv_destroy() {
    player.pause();
    player.unload();
    player.detachMediaElement();
    player.destroy();
    player = null;
}

function flv_seekto() {
    var input = document.getElementsByName('seekpoint')[0];
    player.currentTime = parseFloat(input.value);
}

function switch_url() {
    streamURL.className = '';
    mediaSourceURL.className = 'hidden';
    saveSettings();
}

function switch_mds() {
    streamURL.className = 'hidden';
    mediaSourceURL.className = '';
    saveSettings();
}

function ls_get(key, def) {
    try {
        var ret = localStorage.getItem('flvjs_demo.' + key);
        if (ret === null) {
            ret = def;
        }
        return ret;
    } catch (e) {}
    return def;
}

function ls_set(key, value) {
    try {
        localStorage.setItem('flvjs_demo.' + key, value);
    } catch (e) {}
}

function saveSettings() {
    if (mediaSourceURL.className === '') {
        ls_set('inputMode', 'MediaDataSource');
    } else {
        ls_set('inputMode', 'StreamURL');
    }
    var i;
    for (i = 0; i < checkBoxFields.length; i++) {
        var field = checkBoxFields[i];
        /** @type {HTMLInputElement} */
        var checkbox = document.getElementById(field);
        ls_set(field, checkbox.checked ? '1' : '0');
    }
    var msURL = document.getElementById('msURL');
    var sURL = document.getElementById('sURL');
    ls_set('msURL', msURL.value);
    ls_set('sURL', sURL.value);
    console.log('save');
}

function loadSettings() {
    var i;
    for (i = 0; i < checkBoxFields.length; i++) {
        var field = checkBoxFields[i];
        /** @type {HTMLInputElement} */
        var checkbox = document.getElementById(field);
        var c = ls_get(field, checkbox.checked ? '1' : '0');
        checkbox.checked = c === '1' ? true : false;
    }
    var msURL = document.getElementById('msURL');
    var sURL = document.getElementById('sURL');
    msURL.value = ls_get('msURL', msURL.value);
    sURL.value = ls_get('sURL', sURL.value);
    if (ls_get('inputMode', 'StreamURL') === 'StreamURL') {
        switch_url();
    } else {
        switch_mds();
    }
}

function showVersion() {
    var version = flvjs.version;
    document.title = document.title + " (v" + version + ")";
    }
   /* var logcatbox = document.getElementsByName('logcatbox')[0];
flvjs.LoggingControl.addLogListener(function(type, str) {
    logcatbox.value = logcatbox.value + str + '\n';
    logcatbox.scrollTop = logcatbox.scrollHeight;
});*/
/*document.addEventListener('DOMContentLoaded', function() {
    streamURL = document.getElementById('streamURL');
    mediaSourceURL = document.getElementById('mediaSourceURL');
    loadSettings();
    showVersion();
    flv_load();
});*/

function getCameraBatchUrl(item){
	var cameraBatchUrl = [];
	var win;
	var stage = item.stage;
	var cameraType = item.cameraType;
	if(parent.window.alias1==undefined){
		win = parent.parent.window;
	}else{
		win = parent.window;
	}
	if(stage=="1"){
		cameraBatchUrl[0] = cameraUrl1;
		cameraBatchUrl[1] = win.alias1;
		cameraBatchUrl[2] = win.ipCamera;
	}else if(stage=="2"){
		cameraBatchUrl[0] = cameraUrl2;
		cameraBatchUrl[1] = win.alias2;
		cameraBatchUrl[2] = win.ipCamera;
	}else if(stage=="3"){
		cameraBatchUrl[0] = cameraUrl3;
		if(cameraType.indexOf("4G")!=-1){
			cameraBatchUrl[0] = cameraUrl4;
		}
		cameraBatchUrl[1] = win.alias3;
		cameraBatchUrl[2] = win.ipCamera;
	}
	return cameraBatchUrl;
}
/**
 * 获取本地IP地址
 */
function getLocalIPAddress() {
    var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if(RTCPeerConnection)(function() {
        var rtc = new RTCPeerConnection({
            iceServers: []
        });
        if(1 || window.mozRTCPeerConnection) {
            rtc.createDataChannel('', {
                reliable: false
            });
        };

        rtc.onicecandidate = function(evt) {
            if(evt.candidate) grepSDP("a=" + evt.candidate.candidate);
        };
        rtc.createOffer(function(offerDesc) {
            grepSDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
        }, function(e) {
            console.warn("offer failed", e);
        });

        var addrs = Object.create(null);
        addrs["0.0.0.0"] = false;

        function updateDisplay(newAddr) {
            if(newAddr in addrs) return;
            else addrs[newAddr] = true;
            var displayAddrs = Object.keys(addrs).filter(function(k) {
                return addrs[k];
            });
            for(var i = 0; i < displayAddrs.length; i++) {
                if(displayAddrs[i].length > 16) {
                    displayAddrs.splice(i, 1);
                    i--;
                }
            }
            window.ipCamera = displayAddrs[0];
        }

        function grepSDP(sdp) {
            var hosts = [];
            sdp.split('\r\n').forEach(function(line, index, arr) {
                if(~line.indexOf("a=candidate")) {
                    var parts = line.split(' '),
                        addr = parts[4],
                        type = parts[7];
                    if(type === 'host') updateDisplay(addr);
                } else if(~line.indexOf("c=")) {
                    var parts = line.split(' '),
                        addr = parts[2];
                    updateDisplay(addr);
                }
            });
        }
    })();
    else {
        document.getElementById('list').textContent = "请使用主流浏览器：chrome,firefox,opera,safari";
    }
}