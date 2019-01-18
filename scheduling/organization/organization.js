define(function (require, exports, module) {
  require('utilityForm');
  var ajax = require('../app/common/ajax');
  var orgTable = require('../organize/organize');
  
  //模块默认初始化方法
  function initialization() {
    $.zui.store.set('pid','');
    $.zui.store.set('parentOrgName','所有单位');
    ajax.post('organization/info/findOrgTree', {}, function (response) {
     
      var orgData = response.data;
      
      orgData.push({
        id:null,
        parentId:null,
        name:'所有单位'
      });
      var setting = {
        data : {
          simpleData : {
            idKey : "id", //主键id
            pIdKey : "parentId",
            name : "name",
            enable : true
          }
        },
        callback : {
          onExpand : zTreeRegisterTarget,
          beforeClick : zTreeBeforeClick,
          onClick : clickSelect,
          beforeDrag : beforeDrags,
        }
      };
      $.fn.zTree.init($("#myTree"), setting, orgData);
      var treeObj = $.fn.zTree.getZTreeObj("myTree");
      treeObj.expandAll(true);
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
      var ifm= document.getElementById("orgRender"); 
      ifm.height=document.documentElement.clientHeight;
  }

  window.onresize=function(){  
      changeFrameHeight();  
  } 

 

  var $iframe = $('#orgRender');

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

  function zTreeRegisterTarget(event, treeId, treeNode) {
    
  }
  function zTreeBeforeClick(treeId, treeNode, clickFlag) {

  };
  
  function clickSelect(event, treeId, treeNode, clickFlag) {
    
    $.zui.store.set('pid',treeNode.id);
    $.zui.store.set('parentOrgName',treeNode.name);
    $('#orgRender').attr('src','../organize/index.html');
  }
  function beforeDrags(treeId, treeNodes) {
    return false;
  }
})