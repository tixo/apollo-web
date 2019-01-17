//定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
/**
 * GC-J02 转换为 WGS84
 * @param x lon
 * @param y lat
 * @returns {*[]}
 */
function gcj02ToWgs84(x, y) {
    if (out_of_china(x, y)) {
        return [x, y]
    }
    else {
        var dy = transformy(x - 105.0, y - 35.0);
        var dx = transformx(x - 105.0, y - 35.0);
        var rady = y / 180.0 * PI;
        var magic = Math.sin(rady);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dy = (dy * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dx = (dx * 180.0) / (a / sqrtmagic * Math.cos(rady) * PI);
        mgy = y + dy;
        mgx = x + dx;
        return {x: x * 2 - mgx, y: y * 2 - mgy}
    }
}

/*
 * WGS84转GCj02
 * @param x
 * @param y
 * @returns {*[]}
 */
function wgs84ToGcj02(x, y) {
    if (out_of_china(x, y)) {
        return [x, y]
    }else {
        var dy = transformy(x - 105.0, y - 35.0);
        var dx = transformx(x - 105.0, y - 35.0);
        var rady = y / 180.0 * PI;
        var magic = Math.sin(rady);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dy = (dy * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dx = (dx * 180.0) / (a / sqrtmagic * Math.cos(rady) * PI);
        var mgy = y + dy;
        var mgx = x + dx;
        return {x: mgx, y: mgy};
    }
}

/**
 * 转换y坐标
 * @param x lon
 * @param y lat
 * @returns {*[]}
 */
function transformy(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
    return ret
}
/**
 * 转换x坐标
 * @param x lon
 * @param y lat
 * @returns {*[]}
 */
function transformx(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
    return ret
}
/**
 * 断是否在国内，不在国内则不做偏移
 * @param x lon
 * @param y lat
 * @returns {boolean}
 */
function out_of_china(x, y) {
    return (x < 72.004 || x > 137.8347) || ((y < 0.8293 || y > 55.8271) || false);
}