$(function(){
    var menus=[];
    if(!$.isEmptyObject(top.new_menus)){
        menus=top.new_menus;
    }

    if(!$.isEmptyObject(menus) && !$.isEmptyObject(top.services.new_menus)){
        menus=top.new_menus;
    }

    var dom = document.getElementsByClassName('tab_nav');
    $.each(menus,function(index,menu){
        var li = document.createElement('li');
        li.id = menu.id;
        if(0==index){
            li.className='tab select';
            $("#aj-manage-ctn").attr("src",menu.href);
            $("#aj-manage-ctn").show();
        }else{
            li.className='tab';
        }
        
        li.textContent = menu.name;
        $(li).on("click",function(){
            $(this).addClass('select').siblings().removeClass('select');
            $("#aj-manage-ctn").attr("src",menu.href);
          });
        dom[0].appendChild(li);
    });
	
});