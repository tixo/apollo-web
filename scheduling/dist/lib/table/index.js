define(function (require, exports, module) {
  var tableView = null;
  var defaultData = {
    queryParams: {
      total: 0,
      sort: 'desc',
      order: 'createTime',
      rows: 20,
      page: 1,
      filters: [],
      searchParams: {}
    },
    showBorder: true,
    showStripe: true,
    showHeader: true,
    showIndex: false,
    showCheckbox: true,
    fixedHeader: true,
    highlightRow: false,
    tableSize: 'small',
    currentRow: {},
    selectionData: [],
    tableData: []
  };

  function init(id, url, columnArray, ajax, choices, callback) {
    var montTpl = require('./table.html');
    var template = Handlebars.compile(montTpl);
    $('#' + id).append(template());
    if (choices) {
      defaultData = $.extend(defaultData, choices);
    }
    defaultData.ajax = ajax;
    defaultData.tableColumnArray = columnArray;
    tableView = new Vue({
      el: '#' + id,
      data: defaultData,
      methods: {
        getCurrentRow() {
          return this.currentRow;
        },
        setSelectionData(data) {
          this.selectionData = data;
        },
        getSelectionData() {
          return this.selectionData;
        },
        query(params) {
          var vm = this;

          if (!$.isEmptyObject(params)) {
            vm.queryParams.searchParams = params;
          }

          vm.ajax.post(url, vm.queryParams, function (response) {
            vm.tableData = response.data.rows;
            vm.queryParams.total = response.data.total;

            $.each(vm.tableColumns, function (index, column) {
              if (column.filterFill && column.filterFill == 'auto') {
                vm.setFilterChange(column, vm.tableData)
              }
            });
          });
        },
        setFilterChange(column, result) {
          var vm = this;
          var isExists = false;
          var tempFilter = null;
          //查找已选择的过滤条件是否包含该列
          $.each(vm.queryParams.filters, function (index, data) {
            if (data.filterKey == column.key) {
              tempFilter = data;
              isExists = true;
            }
          });
          //不包含该列则每次从查询结果更新该列过滤条件
          if (!isExists) {
            var tempFilters = [];
            $.each(result, function (index, data) {
              if (data[column.key] && -1 == $.inArray(data[column.key], tempFilters)) {
                // console.log(column.key);
                tempFilters.push(data[column.key]);
                column.filters.push({
                  label: data[column.key],
                  value: data[column.key]
                });
              }
            });
            //console.log(vm.tableColumns);             
          }
        },
        onCurrentChange(currentRow, oldCurrentRow) {
          this.currentRow = currentRow;
          if (callback) {
            callback(currentRow);
          }
        },
        onFilterChange(data) {
          // console.log(this.queryParams);
          this.query();
        },
        onSortChange(data) {
          this.queryParams.order = data.key;
          this.queryParams.sort = data.order;
          this.query();
        },
        onChange(page) {
          this.queryParams.page = page;
          this.query();
        },
        onPageSizeChange(pageSize) {
          this.queryParams.rows = pageSize;
          this.query();
        },
        onSelectionChange(selection) {
          this.selectionData = selection;
        },
        setFilterSelections(value, row) {
          var vm = this;
          var tempFilter = null;
          if (!$.isEmptyObject(value)) {
            $.each(vm.queryParams.filters, function (index, data) {
              if (data.filterKey == row) {
                tempFilter = data;
                data.filterValues = value;
                return;
              }
            });
            if ($.isEmptyObject(tempFilter)) {
              vm.queryParams.filters.push({
                filterKey: row,
                filterValues: value
              });
            }
          } else {
            $.each(vm.queryParams.filters, function (index, data) {
              if (data.filterKey == row) {
                vm.queryParams.filters.splice(index, 1);
                return;
              }
            });
          }
        }
      },
      computed: {
        tableColumns() {
          var columns = [];
          if (this.showCheckbox) {
            columns.push({
              type: 'selection',
              width: 60,
              align: 'center'
            })
          }
          if (this.showIndex) {
            columns.push({
              type: 'index',
              width: 60,
              align: 'center'
            })
          }

          var vm = this;
          $.each(columnArray, function (index, data) {
            if (data.filters) {
              data.filterRemote = function (value, row) {

                //自定义筛选条件:重置
                if ($.isEmptyObject(value) && columnArray[index].filterFill == 'auto') {
                  columnArray[index].filters = [];
                }

                vm.setFilterSelections(value, row);
              }
            }
          });
          vm.tableColumnArray = $.merge(columns, columnArray);
          return vm.tableColumnArray;
        }
      }
    });
  }

  //获取选中的行(单选)
  exports.getCurrentRow = function () {
    return tableView.getCurrentRow();
  }

  //获取选中的行(多选)
  exports.getSelectionData = function () {
    return tableView.getSelectionData();
  }

  /**
   * 恢复默认查询方法
   * 
   * @param {*} searchParams 
   */
  exports.reset = function (searchParams) {
    tableView.setSelectionData([]);
    tableView.query(searchParams);
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
  exports.initialization = function (id, url, columns, ajax, choices, callback) {
    init(id, url, columns, ajax, choices, callback);
    tableView.query();
  }

  /**
   * 模块默认初始化方法
   * 
   * @param {*} id 
   * @param {*} url 
   * @param {*} columns 
   */
  exports.initializationWithSearchParams = function (id, url, columns, ajax, queryParams) {
    defaultData.queryParams.searchParams = $.extend(defaultData.queryParams.searchParams, queryParams);
    init(id, url, columns, ajax);
    tableView.query();
  }

  exports.initializationWithSearchAndOrderParams = function (id, url, columns, ajax, queryParams,orderParams) {
    defaultData.queryParams.searchParams = $.extend(defaultData.queryParams.searchParams, queryParams);
    defaultData.queryParams = $.extend(defaultData.queryParams, orderParams); 
    init(id, url, columns, ajax);
    tableView.query();
  }
})