define(function(require, exports, module) {
	var stompClient = null;
	var webSocketServerUrl = "http://10.100.4.19:8021/webSocketServer";
	var webSocketServerUrlPillar = "http://10.100.4.21:8029/webSocketServer";
	var res = {
		showResponse:{},
		apiUrl:""
		
	};
    function setConnected(connected) {
        document.getElementById('connect').disabled = connected;
        document.getElementById('disconnect').disabled = !connected;
        document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
        $('#response').html();
    }
 	var websocket = {
 		/*initWebsocket:function(fun,apiUrl){
 			res.showResponse = fun;
 			res.apiUrl = apiUrl;
 		},*/
	    connect:function(fun,apiUrl,type) {
	    	var url= webSocketServerUrl;
	    	res.showResponse = fun;
 			//res.apiUrl = apiUrl;
 			if(type!=undefined && 'pillar'==type){
 				url = webSocketServerUrlPillar;
 			}
	        var socket = new SockJS(url); //链接SockJS 的endpoint 名称为'/endpointWisely"
	        stompClient = Stomp.over(socket);//使用stomp子协议的WebSocket 客户端
	        stompClient.connect({}, function(frame) {//链接Web Socket的服务端。
	            /*setConnected(true);*/
	            console.log('Connected: ' + frame);
	            stompClient.subscribe(apiUrl, function(respnose){ //订阅/topic/getResponse 目标发送的消息。这个是在控制器的@SendTo中定义的。
	                console.log(respnose);
	                showResponse(JSON.parse(respnose.body));
	            });
	        });
	    },
	    disconnect:function() {
	        if (stompClient != null) {
	            stompClient.disconnect();
	        }
	       /* setConnected(false);*/
	        console.log("Disconnected");
	    }
	}; 
	//新消息回调
    function showResponse(message) {
        res.showResponse(message);
    }
    module.exports = websocket;
});