define(function (require, exports, module) {

    //var img = parent.caseUnitScatters.getDataURL();

        
    function getHeaderParams(params) {
        var unit = $.trim(params.searchParams.unit);
        var unitName = ""
        if ($.isEmptyObject(unit) || 'undefined' == unit || 0 == unit.length || '1' == unit) {
            unitName = "西安市公安局航天分局"
        }else{
            if('2' == unit){
                unitName = '西安市公安局航天分局东所';
            }else{
                unitName = '西安市公安局航天分局秦宇所';
            }
        }        
        var format = require('../../common/format');
        return {
            author:unitName+'指挥中心编',
            create_date:format.Format(new Date(),'yyyy年MM月dd日')
        };
    }

    
    var period = parent.window.exports.searchParams.period;
    console.log(parent.window.exports.searchParams.time);
    routerExportPage(period, parent.window.exports);

      /**
   * 统计路由跳转
   * 
   * @param {*} period 
   * @param {*} params 
   */
  function routerExportPage(period, params) {
    //console.log(params);
    switch (parseInt(period)) {
      case 1:
        //周统计
        seajs.use(top.frontHttpUrl+'scheduling/app/js/week/export', function (week) {
          week.preview(params);
        });
        break;
      case 2:
        //月统计
        seajs.use(top.frontHttpUrl+'scheduling/app/js/month/export', function (month) {
          month.preview(params);
        });
        break;
      case 3:
        //季度统计
        seajs.use(top.frontHttpUrl+'scheduling/app/js/quarter/export', function (quarter) {
          quarter.preview(params);
        });
        break;
      case 4:
        //半年统计
        seajs.use(top.frontHttpUrl+'scheduling/app/js/half/export', function (half) {
          half.preview(params);
        });
        break;
      case 5:
        //年统计
        seajs.use(top.frontHttpUrl+'scheduling/app/js/year/export', function (year) {
          year.preview(params);
        });
        break;
      default:
        //月统计页面展示
        seajs.use(top.frontHttpUrl+'scheduling/app/js/month/export', function (month) {
          month.preview(params);
        });
    }
  }
})