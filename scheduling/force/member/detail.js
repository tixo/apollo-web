define(['utilityForm'],function (require, exports, module) {

  //模块默认初始化方法
  function initialization() {
    id = $.getParam('id');
    seajs.use('../../app/common/ajax', function (ajax) {
      ajax.post('force/info/findByPrimaryKey/'+id, {}, function (response) {
        var result = response.data;
        if(result.code > 0){
          var data = result.data;
          var groupData ={
            id:data.id,
            text: data.captainName,
            photo: data.photo,
            style: {color:'#3280fc'},
            tooltip: '警员编号: '+data.captainNo,
          }

          var member = data.member;
          if(!$.isEmptyObject(member)){
            var memArray = [];
            $.each(member,function(index,mData){
              memArray.push({
                id:mData.id,
                text: mData.name,
                photo: mData.photo,
                style: {color:'#3280fc'},
                tooltip: '警员编号: '+mData.no,
              })
            });
            groupData.children = memArray;
          }
          $('#treemapExample1').treemap({
            data: groupData,
            nodeTemplate: function(node, tree) {
                var $node = $('<div class="treemap-node"></div>');
                $node.append('<a class="treemap-node-wrapper">' + node.text + '</a>');
                if(!$.isEmptyObject(node.photo)){
                  $node.find('.treemap-node-wrapper').prepend('<img style="height:50px;width:50px;" src="' + node.photo + '"></img> ');                  
                }
                return $node;
            }
          });

        }else{
          $.showErrorInfo(result.message);
        }
      });

    });
  }


  initialization();
})