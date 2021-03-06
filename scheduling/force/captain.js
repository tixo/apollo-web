define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var table = require('../dist/lib/table/index');

  function search() {
    table.query({
      no: $.trim($('#no').val()),
      name: $.trim($('#name').val())
    });
  }

  //查询事件绑定
  function initSearch() {
    $('#policeQuery').on('click', function () {
      search();
    });
  }

  function initActions() {
    initSearch();
  }

  var tableColumns = [{
    title: '警员编号',
    key: 'no',
    sortable: 'custom'
  }, {
    title: '姓名',
    key: 'name',
    sortable: 'custom'
  },{
    title: '警员类别',
    key: 'isBackup',
    sortable: 'custom',
    render: (h, params) => {
      var target = '';
      var isBackup = params.row.isBackup;  
      
      if(!$.isEmpty(isBackup)){
        if(1==isBackup){
          target = '警员';
        }
        if(2==isBackup){
          target = '辅警';
        }
      }
      return target;
    }
  }, {
    title: '照片',
    key: 'photo',
    sortable: 'custom',
    render: (h, params) => {
      var imgSrc = params.row.photo;
      if (!$.isEmptyObject(imgSrc)) {
        return h('img', {
          domProps: {
            style: 'height:50px;width:60px;',
            src: imgSrc
          }
        })
      } else {
        return '未上传';
      }
    }
  }, {
    title: '性别',
    key: 'gender',
    sortable: 'custom',
    filterFill: 'custom',
    filters: [{
      label: '男',
      value: '1'
    },
    {
      label: '女',
      value: '2'
    }
  ],
  render: (h, params) => {
    var target = '';
    var gender = params.row.gender;  
    if(!$.isEmpty(gender)){
      if('1'==gender){
        target = '男';
      }
      if('2'==gender){
        target = '女';
      }
    }
    return target;
  }
  }, {
    title: '联系方式',
    key: 'telephone'
  }, {
    title: '部门及单位',
    key: 'department',
    sortable: 'custom',
    render: (h, params) => {
      var target = '';
      if (!$.isEmptyObject(params.row.unit)) {
        target = target + params.row.unit;
      }
      if (!$.isEmptyObject(params.row.department)) {
        target = target + params.row.department;
      }
      return target;
    }
  }, {
    title: '岗位',
    key: 'station',
    sortable: 'custom',
    render: (h, params) => {
      var target = '';
      if (!$.isEmptyObject(params.row.station)) {
        target = params.row.station;
      }
      return params.row.station;
    }
  }];

  //模块默认初始化方法
  function initialization() {
    table.initialization('tableView', 'police/info/findPage', tableColumns, ajax, {
      showCheckbox: false,
      highlightRow: true
    }, function (currentRow) {
      parent.$('#captainId').val(currentRow.id);
      parent.$('#captainName').val(currentRow.name);
      parent.$('#captainNo').val(currentRow.no);
      parent.$('#photo').val(currentRow.photo);
      parent.layer.closeAll();
    });

    initActions();
  }


  initialization();
})