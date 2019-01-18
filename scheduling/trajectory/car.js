define(function (require, exports, module) {

    function initShow(){
        $('#targetList').children('div').each(function (index) {
            $(this).on('click', function () {
                if($(this).children('div:eq(0)').find('i').hasClass('icon-eye-open')){
                    $(this).children('div:eq(0)').find('i').removeClass('icon-eye-open');
                    $(this).children('div:eq(0)').find('i').addClass('icon-eye-close');
                }else{
                    $(this).children('div:eq(0)').find('i').removeClass('icon-eye-close');
                    $(this).children('div:eq(0)').find('i').addClass('icon-eye-open');
                }
            });
        });
    }

    initShow();
})