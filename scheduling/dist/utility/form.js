$.extend({
	setheaders : function (request) {
        if(!$.isEmptyObject(top.authorization)){
            request.setRequestHeader("userId", top.authorization.userId);
            request.setRequestHeader("userToken", top.authorization.userToken);
        }
    },
	/** 
	 * 获取指定的URL参数值 
	 * URL:http://www.quwan.com/index?name=tyler 
	 * 参数：paramName URL参数 
	 * 调用方法:getParam("name") 
	 * 返回值:tyler 
	 */ 
	getParam : function (paramName) { 
		var paramValue = "";
		var isFound = !1; 
		if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=") > 1) { 
			arrSource = unescape(window.location.search).substring(1, window.location.search.length).split("&"), i = 0; 
			while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
		} 
		return paramValue == "" && (paramValue = null), paramValue 
	},
	getParams : function (url,paramName) { 
		var paramValue = "";
		var isFound = !1; 
		if (url.indexOf("?") == 0 && url.indexOf("=") > 1) { 
			arrSource = unescape(url).substring(1, url.length).split("&"), i = 0; 
			while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
		} 
		return paramValue == "" && (paramValue = null), paramValue 
	},	
	showConfirmInfo: function(action,message,func,icon){
		new $.zui.Messager('提示消息：'+message, {
			type: 'warning',
			time:0,
			close: true, 
			actions: [{
				name: 'delete',
				icon: icon? icon : 'trash',
				text: action,
				action: func
			}],
			onAction: function(name, action, messager) {
				if(name === 'delete') {
					messager.hide();
				}
			}
		}).show();
	},
	goTo: function (targetUrl) {
		window.location.href = targetUrl;
	},
	showErrorInfo: function(message){
		new $.zui.Messager('提示消息：'+message, {
			type: 'danger' // 定义颜色主题
		}).show();
	},
	isEmpty : function(value, allowEmptyString) {
		return (value === null) || (value === undefined)
				|| (!allowEmptyString ? value === '' : false)
				|| ($.isArray(value) && value.length === 0);
	},
	showSuccessTipAndGo: function(message,targetUrl){
		var myMessager = new $.zui.Messager('提示消息：'+message, {
			placement: 'bottom',
			type: 'success' // 定义颜色主题
		}); 
		// 先显示消息
        myMessager.show();
		// 2 秒之后隐藏消息
		setTimeout(function() {
			myMessager.destroy();
		}, 2000);
		
		if(!$.isEmptyObject(targetUrl)){
			$.goTo(targetUrl);
		}
	},
	formToJson: function (data) {
		if (null == data || null == 'undefined' || data.length == 0) {
			return {};
		}

		data = data.replace(/&/g, "\",\"");
		data = data.replace(/=/g, "\":\"");
		data = data.replace(/\+/g, " ");
		//		data = data.replace(/\//g, "/");
		data = "{\"" + data + "\"}";

		return JSON.parse(decodeURIComponent(data));
	},
	setForm: function (jsonValue) {
		// 单选按钮
		$("input:radio").each(function () {
			var dom = $(this);
			$.each(JSON.parse(jsonValue), function (key, value) {
				if (key == dom.attr('name') && value == dom.attr('value')) {
					dom.attr("checked", value);
				}
			});
		});

		// checkbox选项
		$("input[type=checkbox]").each(function () {
			var dom = $(this);
			$.each(JSON.parse(jsonValue), function (key, value) {
				if (key == dom.attr('name')) {
					if (value || value == 1) {
						dom.attr("checked", true);
					} else {
						dom.attr("checked", false);
					}
				}
			});
		});

		// text选项
		$("input[type=text]").each(function () {
			var dom = $(this);
			$.each(JSON.parse(jsonValue), function (key, value) {
				//				alert('key='+key+'  dom='+dom.attr('name'));
				if (key == dom.attr('name')) {
					dom.val(value);
				}
			});
		});

		// 隐藏域
		$("input[type=hidden]").each(function () {
			var dom = $(this);
			$.each(JSON.parse(jsonValue), function (key, value) {
				if (key == dom.attr('name')) {
					dom.val(value);
				}
			});
		});

		// textarea选项
		$("input[type=textarea]").each(function () {
			var dom = $(this);
			$.each(JSON.parse(jsonValue), function (key, value) {
				if (key == dom.attr('name')) {
					dom.val(value);
				}
			});
		});
		// textarea选项2
		$("textarea").each(function () {
			var dom = $(this);
			$.each(JSON.parse(jsonValue), function (key, value) {
				if (key == dom.attr('name')) {
					dom.val(value);
				}
			});
		});

		// textarea2选项
		$("select").each(function () {
			var dom = $(this);
			$.each(JSON.parse(jsonValue), function (key, value) {
				if (key == dom.attr('name')) {
					dom.val(value);
				}
			});
		});

	}
})