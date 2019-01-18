define(function (require, exports, module) {
  /**
   * [Format description] 日期处理格式化
   * @param {[type]} Object [Date对象 new Date()]
   * @param {[type]} f    [预期的格式]
   * 例如：Format(new Date(), 'yyyy-MM-dd hh:mm:ss')
   */
  exports.Format = function (Object, f) {
    var d = Object
    var o = {
      // 月
      'M+': d.getMonth() + 1,
      // 日
      'd+': d.getDate(),
      // 时
      'h+': d.getHours(),
      // 分
      'm+': d.getMinutes(),
      // 秒
      's+': d.getSeconds(),
      // 季度
      'q+': Math.floor((d.getMonth() + 3) / 3),
      // 毫秒
      'S': d.getMilliseconds()
    }
    if (/(y+)/.test(f)) f = f.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(f)) {
        f = f.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return f
  };
})
