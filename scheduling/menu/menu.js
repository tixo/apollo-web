define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var menuTable = require('./table');




  //模块默认初始化方法
  function initialization() {
    ajax.post('menu/info/findAll', {}, function (response) {
      $('#myTree').tree({
        title: 'name',
        initialState: 'expand',
        data: response.data,
        itemCreator: function ($li, item) {
          $li.append($('<a/>', { id: item.id }).text(item.name));
        }
      });
    });
    //$('#myTree').attr('data-ride','tree');
    
    $('#myTree').on('click', 'a', function () {
      
      menuTable.clickQuery($(this).parent().find('a').attr('id'));
    });
    
    menuTable.initialization();
    
  }

  initialization();


})