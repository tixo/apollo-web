define(function (require, exports, module) {
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

    $('#deviceTree ul li').each(function (index,data) {
        $(this).on('click', function () {
            var url = $(this).children('a').attr('url');
            $('#deviceRender').attr('src',url);

            $('#deviceTree ul').children('li:eq('+index+')').addClass('active');
            $('#deviceTree ul').children('li:eq('+index+')').siblings().removeClass('active');
            
        })
    })

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