
//孵化中心api请求url
//var fhzxApolloApi = "http://10.100.4.19:8021/";
var fhzxApolloApi = "http://10.100.4.19:8021/";
window.fhzxApolloApi=fhzxApolloApi;

/**
 * 权限检查及后处理
 */
function authDiapatched(){
	if ($.isEmptyObject(window.authorization)) {
		window.location.replace(fhzxApolloApi + "login");
	}else{
        //开发时注掉即可
       seajs.use(frontHttpUrl+'/scheduling/app/common/api.js', function(api) {
            api.isLogin(function(response){
                console.log(response);
                if(response.data.code > 1 || response.data.code == 0){
                    window.location.replace(fhzxApolloApi + "login");
                }
            });
        });
    }
}

function getParam(paramName) {
    var paramValue = "";
    var isFound = !1;
    if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) {
        arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&"), i = 0;
        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
    }
    return paramValue == "" && (paramValue = null), paramValue
}

function getAuthInfo(key) {
    var tempValue = getParam(key);
    if (!$.isEmptyObject(tempValue)) {
        return tempValue;
    }
    tempValue = $.cookie(key);
    if (!$.isEmptyObject(tempValue)) {
        return tempValue;
    }
}

function setAuthorization(userId, userToken,appId) {
    if (!$.isEmptyObject(userId) && !$.isEmptyObject(userToken)&& !$.isEmptyObject(appId)) {
        authorization.userId = userId;
        authorization.userToken = userToken;
        authorization.appId = appId;
    }
}

//全局鉴权信息存储
var authorization = {
    //    'userToken': '37911018F4C34EC7A01E4338E8F764BC',
    //    'userId': 'E5E9AC6810D74E86B8FA811B4C60A154',
    //    'appId': '44D605DC09F04F67A1C549BCBB3BA442'
 		  //'userToken': 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJCOTI4MzFEMEVFNzc0RDdEOEZFQTY1QkRCRDEwOTc1QiIsInN1YiI6ImFkbWluIiwiaXNzIjoiZmh6eC1hcG9sbG8iLCJpYXQiOjE1NDIxNzc0NDMsImV4cCI6MTU0Mjc4MjI0M30.BoLD3KGQFWxZw7h7mhXr9krPYUxeJROpFFa7yobrBJg',
          //'userId': 'B92831D0EE774D7D8FEA65BDBD10975B',
          //'userId': 'B92831D0EE774D7D8FEA65BDBD10975B',
          
         // 'appId': '7F3B463B6C2748B9BE0A680DAF87022A'
          /*'appId': '44D605DC09F04F67A1C549BCBB3BA442'*/
};

function initializationMenus(func){
    seajs.use(frontHttpUrl+'/scheduling/app/common/api.js', function(api) {
        api.getMenuTreeByUser(func);
        //登录名
        api.getUserName(function(response){
        	window.userName = response.data.data.name;
        });
    });
}

function initialization() {
    $.cookie('userToken', authorization.userToken);
    $.cookie('userId', authorization.userId);
    $.cookie('appId', authorization.appId);
    var userId = getAuthInfo("userId");
    var userToken = getAuthInfo("userToken");
    var appId = getAuthInfo("appId");

    if (!$.isEmptyObject(userId) && !$.isEmptyObject(userToken) && !$.isEmptyObject(appId)) {
        setAuthorization(getAuthInfo("userId"), getAuthInfo("userToken"), getAuthInfo("appId"));

        $.cookie("userId", userId);
        $.cookie("userToken", userToken);
        $.cookie("appId", appId);

        window.authorization = authorization;
    } else {
        window.location.replace(fhzxApolloApi + "login");
    }
}

/**
 * 拼接菜单数据结构
 * 
 * @param {*} data 
 * @param {*} frontHttpUrl 
 */
function getMenu(data,frontHttpUrl){
    var menus = [];
    if(!$.isEmptyObject(data)){
        var show = false;
        $.each(data,function(indx,menu){
            show = false;
            if(0 == indx){
                show = true;
            }
            
            var tempMenu = {
                id: menu.resKey,
                name: menu.name,
                href: frontHttpUrl + menu.url,
                show: show
            };

            if(!$.isEmptyObject(menu.children)){
                var secondeMenus = [];
                $.each(menu.children,function(sindex,second){
                    secondeMenus.push({
                        id: second.resKey,
                        name: second.name,
                        href: frontHttpUrl + second.url,
                        show: false
                    });
                });
                tempMenu.secondarymenu=secondeMenus;
            }

            menus.push(tempMenu);
        });
    }
    return menus;
}
initialization();
