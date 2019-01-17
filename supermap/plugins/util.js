/**
 * 主要实现了一些常用的dom操作方法
 *
 * @info  
 * @author appea
 * 
 */
define(function(require, exports, module){
    //接口方法
    var utilInterface={
        /**
         * 追加dom到子节点
         */
        appendChild:appendChild,
        /**
         * 删除节点
         */
        remove:remove,
        /**
         * 添加样式
         */
        addClass:addClass,
        /**
         * 移除样式
         */
        removeClass:removeClass,
        /**
         * 添加事件
         */
        removeEvent:removeEvent,
        addEvent:addEvent,
        /**
         * 获得容器绝对位置
         */
        getOffset:getOffset,
        /**
         * 分割
         */
        trim:trim,
        /**
         * 浏览器判断
         */
        browser:browser,
        /**
         * 操作系统判断
         */
        os:os,
        /**
         * json格式判断
         */
        isJson:isJson
    };
    
    /**
    * bug
    * innerHTML无法正确插入td、legend等嵌套标签的问题。参考https://gist.github.com/smallnewer/6576720。
    * IE中无法正确插入样式表等noscope等问题。本例中暂时没有解决。
    */
    var tagHooks = {
	        area: [1, "<map>"],
	        param: [1, "<object>"],
	        col: [2, "<table><tbody></tbody><colgroup>", "</table>"],
	        legend: [1, "<fieldset>"],
	        option: [1, "<select multiple='multiple'>"],
	        thead: [1, "<table>", "</table>"],
	        tr: [2, "<table><tbody>"],
	        td: [3, "<table><tbody><tr>"],
	        _default : [0,""]
	    };
     // 可以通过parser后执行的script的MIME
    var scriptTypes = {
        "text/javascript" : 1,
        "text/ecmascript" : 1,
        "application/ecmascript" : 1,
        "application/javascript" : 1,
        "text/vbscript" : 1
    }
    var rtagName = /<([\w:]+)/; 
    function appendChild(elem,html){
        var domParser = document.createElement("div");
        var tag = (rtagName.exec(html) || ["",""])[1].toLowerCase();
        var wrap = tagHooks[tag] || tagHooks._default;

        // 为了符合嵌套关系，手动增加外部嵌套。
        // 问题参考：https://gist.github.com/smallnewer/6576720
        domParser.innerHTML = wrap[1] + html + (wrap[2] || "");

        //使用innerHTML生成的script节点不会发出请求与执行text属性
        var els = domParser.getElementsByTagName("script");
        if (els.length) {
            var script = document.createElement("script"),
                temp;
            for (var i = 0,el ; el = els[i++]; ) {
                temp = script.cloneNode(false);//FF不能省略参数
                for (var j = 0, attr; attr = el.attributes[i++];) {
                    if (attr.specified) {
                        neo[attr.name] = attr.value;
                    };
                };
                neo.text = el.text;//必须指定,因为无法在attributes中遍历出来
                el.parentNode.replaceChild(neo, el) //替换节点
            };
        };

        //移除我们为了符合套嵌关系而添加的标签
        for (i = wrap[0]; i--; domParser = domParser.lastChild) {
        }

        var firstChild;
        var fragment = document.createDocumentFragment();
        while(firstChild = domParser.firstChild){
            fragment.appendChild(firstChild);
        }
        elem.appendChild(fragment);
    }
    
    function remove(elem){
        if(elem.nodeType===1){
            elem.parentNode.removeChild(elem);
        }
    }
    
    function empty(elem){
        if(elem.nodeType===1){
            
        }
    }
    
    function addClass(elem,value){
        var classNames,setClass,c,cl;
        if(value&&typeof value==="string"){
            classNames=value.split(" ");    //用空白分隔符分割value，转换为数组
            if(elem.nodeType==1){   //判断元素是否为Element
                if(!elem.className&&classNames.length===1){
                    elem.className=value;
                    //已有className 或者 classNames长度大于1
                }else{
                    setClass=" "+elem.className+" ";
                    for(c=0,cl=classNames.length;c<cl;c++){
                        /*
						 * 关于~，摘自《JavaScript权威指南 5th》
						 * ~ 按位非运算符，~是一元运算符，位于一个整形参数前，将运算数的所有位取反。
						 * 相当于改变它的符号并且减一。
						 * 其实这里简单的简单的对indexOf的返回值判断即可，小于0表示不存在
						 * 不存在，则追加到setClass后
						 * 
						 * 测试：
						 * ~-1 == 0;		~0 == -1; 		~1 == 2; 		~2 == -3
						 * !~-1 == true;	!~0 == fase;	!~1 == false; 	~2 == false
						 * 
						 * 所以if的判断逻辑是：不存在(-1)返回true，其他情况都返回false
						 * 从1.6.2开始，这里变风骚了；忍不住想测试验证一下：
						 * <pre>
						 * var count = 100000;
						 * console.time('1yuan'); for( i = 0; i < count; i++ ) !~-1; console.timeEnd('1yuan')
						 * console.time('2yuan'); for( i = 0; i < count; i++ ) 1 < -1; console.timeEnd('2yuan')
						 * </pre>
						 * 这个case很简单，将测试用例反复运算、调整顺序运算，并没有发现一元运算符比二元运算符快！
						 * 有待继续挖掘！不排除John Resig开了个玩笑。真心不能排除John Resig偶尔调皮一下的可能性！
						 */
                        if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
							setClass += classNames[ c ] + " "; // 追加，最后加一个空格
						}
                        /*
                         * 去掉前后的空白符
                         * trim中将替换过程分为替换前空白符和替换后空白符两步
                         * 事实上除了在trim中，我也没发现有其他代码用用到了trimLeft trimRight
                         * 如果单考虑效率的话，合并一起来更快
                         * rtrim = /^\s+|\s+$/;
                         * text.toString().replace( rtrim, "" );
                         * 这么分开可能是为了潜在的复用
                         * 因此性能不是唯一的追求，这是John Resig在可读性、复用粒度、性能之间的权衡
                         */
                        elem.className = trim( setClass );
                    }
                }
            }
        }
    }
    
    function removeClass(elem,value){
        var classNames,className,setClass,c,cl;
        if(value&&typeof value==="string"||value===undefined){
            classNames=(value||"").split(" ");
            
            if(elem.nodeType===1&&elem.className){
                if(value){
                    className = (" " + elem.className + " ").replace("\n\t\r", " " ); // 前后加空格，将\n\t\r替换为空格
					for ( c = 0, cl = classNames.length; c < cl; c++ ) {
						className = className.replace(" " + classNames[ c ] + " ", " "); // 将要删除的className替换为空格
					}
					// 删除前后的空白符，然后赋值给elem.className
					elem.className = trim( className );
				// 没有指定value undefined，清空className属性
                }else{
                    // 清空
					elem.className = "";
                }
            }
        }
    }
    
    function addEvent(elem,type,fn){
        if (elem.addEventListener)
            elem.addEventListener( type, fn, false );
        else if (elem.attachEvent) {
            elem["e"+type+fn] = fn;
            elem.attachEvent( "on"+type, function() {
                elem["e"+type+fn].call(elem, window.event);
          });
        }
    }
    
    function removeEvent(elem, type, fun){
		if(elem.removeEventListener){
			elem.removeEventListener(type, fun, false);
		} else if(elem.detachEvent){
			elem.detachEvent('on' + type, fun);
		} else {
			elem['on' + type] = null;
		}
	}
    
    function trim(text){
        var rtrim = /^\s+|\s+$/;
        return text.toString().replace( rtrim, "" );
    }
        
    var browser=(function( ua ) {
            var ret = {},
                webkit = ua.match( /WebKit\/([\d.]+)/ ),
                chrome = ua.match( /Chrome\/([\d.]+)/ ) ||
                    ua.match( /CriOS\/([\d.]+)/ ),

                ie = ua.match( /MSIE\s([\d\.]+)/ ) ||
                    ua.match( /(?:trident)(?:.*rv:([\w.]+))?/i ),
                firefox = ua.match( /Firefox\/([\d.]+)/ ),
                safari = ua.match( /Safari\/([\d.]+)/ ),
                opera = ua.match( /OPR\/([\d.]+)/ );

            webkit && (ret.webkit = parseFloat( webkit[ 1 ] ));
            chrome && (ret.chrome = parseFloat( chrome[ 1 ] ));
            ie && (ret.ie = parseFloat( ie[ 1 ] ));
            firefox && (ret.firefox = parseFloat( firefox[ 1 ] ));
            safari && (ret.safari = parseFloat( safari[ 1 ] ));
            opera && (ret.opera = parseFloat( opera[ 1 ] ));

            return ret;
        })( navigator.userAgent );
    
    var os=(function( ua ) {
            var ret = {},

                // osx = !!ua.match( /\(Macintosh\; Intel / ),
                android = ua.match( /(?:Android);?[\s\/]+([\d.]+)?/ ),
                ios = ua.match( /(?:iPad|iPod|iPhone).*OS\s([\d_]+)/ );

            // osx && (ret.osx = true);
            android && (ret.android = parseFloat( android[ 1 ] ));
            ios && (ret.ios = parseFloat( ios[ 1 ].replace( /_/g, '.' ) ));

            return ret;
        })( navigator.userAgent );
        
    function getOffset(elem) {
		o = elem;
		oLeft = o.offsetLeft;           
		while(o.offsetParent!=null) { 
			oParent = o.offsetParent;    
			oLeft += oParent.offsetLeft; 
			o = oParent;
		}
		oTop = o.offsetTop;
		while(o.offsetParent!=null)
		{  
			oParent = o.offsetParent 
			oTop += oParent.offsetTop  // Add parent top position
			o = oParent
		}
		return {"y":0,"x":0};
	}
	
	function isJson(obj){
		var isjson=typeof(obj)=="object"&&Object.prototype.toString.call(obj).toLowerCase=="[object object]" && !obj.length;
		return isjson;
	}
    
	module.exports = utilInterface;
});