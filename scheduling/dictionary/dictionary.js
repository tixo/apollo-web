define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  
  //模块默认初始化方法
  function initialization() {
    ajax.post('dicCategory/info/findAll', {}, function (response) {
      var data = response.data;
      var dicCategory = {
        id:'root',
        name:'字典分类',
        children:data
      }

      $('#myTree').tree({
        title: 'name',
        initialState: 'expand',
        data: dicCategory,
        itemCreator: function ($li, item) {
          $li.append($('<a/>', { id: item.id }).text(item.name));
        }
      });
    });
    
    
    $('#myTree').on('click', 'a', function () {
     
      var id = $(this).attr('id');
      $.zui.store.set('pid',id);
      if('root'==id){
        $('#deviceRender').attr('src','../dicCategory/index.html');
      }else{
        $('#deviceRender').attr('src','../dicItem/index.html');
      }
    });
  }
  initialization();



  function isIE() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (window.navigator.appName == "Microsoft Internet Explorer") {
        try {
            var version = userAgent.match(/msie ([\d.]+)/)[1];
            if (isNaN(version) == false)
                return true;
        } catch (e) {
            return false;
        }
    }
    return false;
  }

  function changeFrameHeight(){
      var ifm= document.getElementById("deviceRender"); 
      ifm.height=document.documentElement.clientHeight;
  }

  window.onresize=function(){  
      changeFrameHeight();  
  } 

 

  var $iframe = $('#deviceRender');

  //iframe加载完成后你需要进行的操作 
  if (isIE) {
      //IE浏览器
      $iframe[0].onload = function () {
          changeFrameHeight() 
      }
  } else {
      $iframe[0].addEventListener('onload',function() {     
          changeFrameHeight() 
      });
  }
})