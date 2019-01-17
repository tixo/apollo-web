define(function (require, exports, module) {
    var tableView = null;
    var defaultData = {
      queryParams:{
        total:0,
        sort:'desc',
        order:'createUser',
        rows:40,
        page:1,
        filters:[],
        searchParams:{                 
        }
      },
      queryData:[]
    };
    function init(id,url,ajax,callback) {
        var montTpl = require('./pager.html');
        var template = Handlebars.compile(montTpl);
        $('#'+id).append(template());
        defaultData.ajax = ajax;
        tableView = new Vue({
            el: '#'+id,
            data: defaultData,
            methods:{
              query(params){
                  var vm = this;
                  
                  if(!$.isEmptyObject(params)){
                    vm.queryParams.searchParams=params;
                  }
                  
                  vm.ajax.post(url,vm.queryParams,function (response) {
                    vm.queryData=response.data.rows;
                    vm.queryParams.total=response.data.total;

                    callback(vm.queryData);
                  });
              },
              onChange(page){
                this.queryParams.page=page;
                this.query();
              },
              onPageSizeChange(pageSize){
                this.queryParams.rows=pageSize;
                this.query();
              }
            }
          });
    }

    /**
     * 条件查询分页方法
     * 
     * @param {*} searchParams 
     */
    exports.query = function (searchParams) {
        tableView.query(searchParams);
    }

    /**
     * 模块默认初始化方法
     * 
     * @param {*} id 
     * @param {*} url 
     * @param {*} columns 
     */
    exports.initialization = function (id,url,ajax,callback) {
        init(id,url,ajax,callback);
        tableView.query();
    }

    exports.show = function (id,url,ajax,callback) {
      init(id,url,ajax,callback);
  }
})