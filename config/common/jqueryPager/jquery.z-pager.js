var ajaxPager;
var pathUrl = parent.window.services.frontHttpUrl;
if("undefined" == typeof(seajs)){
	seajs = parent.parent.window.seajs;
	pathUrl = parent.parent.window.services.frontHttpUrl
}
seajs.use([pathUrl+"/scheduling/app/common/ajax.js"],function(ajax){
	ajaxPager = ajax;
});
;(function($){
	var methods = {
		pageInit: function(options){
			/**
			 * [opts this plug propertys]
			 * @type {Obeject}
			 */
			var opts = $.extend({},$.fn.zPager.defaults,options);
			return $(this).each(function(k,v){
				var _v = $(v);
				_v.data("options",opts);
				methods.pageData(_v, opts.current);
			})
		},
		pageData: function(_v, _current){
			/**
			 * [opts this plug propertys]
			 * @type {Obeject}
			 */
			var opts = _v.data("options");
			var t = opts.totalData, p = opts.pageData, ajaxOpts = null;
			if(opts.ajaxSetData&&(typeof(opts.ajaxSetData)==='boolean')){
				if(opts.url!=='' && typeof(opts.url)==='string'){
					var _total = $.fn.zPager.defaults.totalData;
					var parms = {'total':_total,'rows':[]};
					var  paramObject = {};
					var url = opts.url;
					if(opts.type!=undefined){
						//布控预案
						url = url+"/"+parseInt(_current)+"/"+opts.paramObject.page;
						p = opts.paramObject.page;
					}else if(opts.paramOrder!=undefined&&opts.paramSort!=undefined){
						paramObject.searchParams = opts.paramObject;
						paramObject.page = parseInt(_current);
						paramObject.rows = 10;
						paramObject.order = opts.paramOrder;
						paramObject.sort = opts.paramSort;
						
					}else{
						paramObject.searchParams = opts.paramObject;
						paramObject.page = parseInt(_current);
						paramObject.rows = 10;
					}
					/*$.ajax({
						url: opts.url, //json文件位置
						type: "get", //请求方式为get
						dataType: "json",
						success: function(response) {*/
					ajaxPager.post(url,paramObject,function(response){
						var data = response.data.data;
						if(data==undefined){
							data = response.data;
						}
				 		if(data!=null && data.total !=undefined && (data.total!==0)){
		                        parms['total'] = data.total;
		                        parms['rows'] = data.rows;
		                	}else{
		                		ajaxOpts = parms;
		                		methods.dataRender(_v, ajaxOpts.rows)
		                		_v.data("options",opts);
			            	    methods.pageRender(_v, _current);
		                		$.pageError(3);
		                	}
		               ajaxOpts = parms;
		               t = opts.totalData = ajaxOpts.total;
						if(ajaxOpts.rows.length>0){
							var ishasDataRender = (opts.dataRender && typeof(opts.dataRender)==='function');
								ishasDataRender ? opts.dataRender(ajaxOpts.rows) : methods.dataRender(_v, ajaxOpts.rows);
						}
						if(t%p === 0){
			                opts.pageCount = parseInt(t/p);
			            }else{
			                opts.pageCount = parseInt(t/p)+1;
			            }
			            if(opts.pageCount>0){
			            	_v.data("options",opts);
			            	methods.pageRender(_v, _current);
			            }
				 	},processError);
				 	/*},
						error: function() {
							alert('加载失败！');
						}
					});*/
				}else{
					$.pageError(2);
				}
			}
			function processError(XMLHttpRequest,textStatus,errorThrown) {
				var msg = '';
				switch(XMLHttpRequest.readyState){
					case 0:
						msg = '（未初始化）还没有调用send()方法';
						break;
					case 1:
						msg = '（载入）已调用send()方法，正在发送请求';
						break;
					case 2:
						msg = '（载入完成）send()方法执行完成，已经接收到全部响应内容';
						break;
					case 3:
						msg = '未查到相应数据';
						break;
					case 4:
						msg = '（完成）响应内容解析完成，可以在客户端调用了';
						break;
				}
				console.log(textStatus+'：'+XMLHttpRequest.readyState+'-'+msg);
			}
		},
		dataRender: function(_v, _data){
			var opts = _v.data("options");
			opts.functionName(_data);
		},
		pageRender: function(_v, _current){
			/**
			 * [o this plug propertys]
			 * @type {Obeject}
			 */
			var o = _v.data("options");
			var _page = o.pageCount;
			var _middle = parseInt(o.pageStep/2);
			var _tep = _middle-2;
			var _html = '';
			if(_page>o.pageStep&&_current<=_page){
				_html += methods.setPrevNext(o, 'prev');
				if(_current<=_middle){
					_html += methods.forEach(1, o.pageStep, _current, o.active);
					_html += methods.elliPsis();
				}else if(_current>_middle&&_current<(_page-_tep)){
					_html += methods.pageBtn(1);
					_html += methods.elliPsis();
					_html += methods.forEach(_current-_tep, _current-(-_tep)-(-1), _current, o.active);
					_html += methods.elliPsis();
				}else if(_current>=(_page-_tep)){
					_html += methods.pageBtn(1);
					_html += methods.elliPsis();
					_html += methods.forEach(_page-2*_tep-1, _page-(-1), _current, o.active);
				}
				_html += methods.setPrevNext(o, 'next');
			}else if(_page<=o.pageStep){
				if(_page>o.minPage){
					_html += methods.setPrevNext(o, 'prev');
				}
				_html += methods.forEach(1, _page-(-1), _current, o.active);
				if(_page>o.minPage){
					_html += methods.setPrevNext(o, 'next');
				}	
			}
			_v.html(_html);
			methods.bindEvent(_v);
		},
		bindEvent: function(_v){
			/**
			 * [o this plug propertys]
			 * @type {Obeject}
			 */
			var o = _v.data("options");
			var _a = _v.find("a");
				$.each(_a,function(index,item){
					var _this = $(this);
					_this.on("click",function(){
						if(_this.attr("disabled")){
							return false;
						}
						var _p = _this.attr("page-id");
						o.current = _p;
						_v.data("options",o);
						// methods.options.current = _p;
						methods.pageData(_v, _p);
					})
				})
		},
		forEach: function(_start,length,_current,curclass){
			/**
			 * [s page elements]
			 * @type {String}
			 */
			var s = '';
			for(var i = _start;i<length;i++){
				if(i === parseInt(_current)){
					s += methods.pageCurrent(i,curclass);
				}else{
					s += methods.pageBtn(i);
				}
			}
			return s;
		},
		pageCurrent: function(_id,_class){
			/**
			 * [class current page element calss]
			 * @type {String}
			 */
			return '<span class="'+_class+'" page-id="'+_id+'">'+_id+'</span>';
		},
		elliPsis: function(){
			/**
			 * [class ellipses...]
			 * @type {String}
			 */
			return '<span class="els">...</span>';
		},
		pageBtn: function(_id){
			/**
			 * [id page id]
			 * @type {String}
			 */
			return '<a page-id="'+_id+'">'+_id+'</a>';
		},
		addBtn: function(_property, _page, _count){
			/**
			 * [disabled is it can click button]
			 * @type {Boolean}
			 */
			var disabled = '';
			if(_count){
				disabled = (_page === 0 || _page === _count-(-1)) ? 'disabled="true"':'';
			}
			return '<a class="'+_property+'" page-id="'+_page+'" '+disabled+'></a>';
		},
		setPrevNext: function(_o, _type){
			/**
			 * [s string create prev or next buttons elements]
			 * @type {String}
			 */
			var s = '';
			function prev(){
				if(_o.btnShow){
					s += methods.addBtn(_o.firstBtn, 1); 
				}
				if(_o.btnBool){
					s += methods.addBtn(_o.prevBtn, _o.current-1, _o.pageCount);
				}
				return s;
			}
			function next(){
				if(_o.btnBool){
					s += methods.addBtn(_o.nextBtn, _o.current-(-1), _o.pageCount);
				}
				if(_o.btnShow){
					s += methods.addBtn(_o.lastBtn, _o.pageCount);
				}
				return s;
			}
			return _type==='prev'? prev(): next();
		}		
	}
	$.extend({
		pageError:function(type){
			/**
			 * [switch error type]
			 * @param  {[type]} type [no this function]
			 * @return {[type]}      [ajax error]
			 */
			switch(type){
				case 1:
					console.log('method'+method+'dose not exist on jQuery.zPager');
					break;
				case 2:
					console.log('no ajax');
					break;
				case 3:
					console.log('no data');
					break;
				default:
					console.log('default error');
			}
		}
	})

	$.fn.extend({
		zPager:function(method){
			/**
			 * [if has this method]
			 * @param  {[type]} methods[method] [apply this method]
			 * @return {[type]}                 [return property]
			 */
			if(methods[method]){
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			}else if(typeof method === 'object' || !method){
				return methods.pageInit.apply(this, arguments);
			}else{
				$.pageError(1);
			}
		}
	})

	$.fn.zPager.defaults = {
		totalData: 0, //数据总条数
		pageData: 10, //每页数据条数
		pageCount: 0, //总页数
		current: 1, //当前页码数
		pageStep: 8, //当前可见最多页码个数
		minPage: 7, //最小页码数，页码小于此数值则不显示上下分页按钮
		active: 'current', //当前页码样式
		prevBtn: 'pg-prev', //上一页按钮
		nextBtn: 'pg-next', //下一页按钮
		btnBool: true, //是否显示上一页下一页
		firstBtn: 'pg-first', //第一页按钮
		lastBtn: 'pg-last', //最后一页按钮
		btnShow: true, //是否显示第一页和最后一页按钮
		disabled: true, //按钮失效样式
		ajaxSetData: true, //是否使用ajax获取数据 此属性为真时需要url和htmlBox不为空
		url: '', //ajax路由
		htmlBox: '' ,//ajax数据写入容器
		init:true
	}

})(jQuery)