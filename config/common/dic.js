define(function (require, exports, module) {
    var domicile = [{
        "key": "01",
        "value": "居民家中"
    }, {
        "key": "02",
        "value": "单位内部"
    }, {
        "key": "03",
        "value": "工地现场"
    }, {
        "key": "04",
        "value": "租赁房屋"
    }, {
        "key": "05",
        "value": "自购房"
    }, {
        "key": "06",
        "value": "其他"
    }];

    var household = [{
        "key": "01",
        "value": "常住户口"
    }, {
        "key": "02",
        "value": "暂住户口"
    }, {
        "key": "03",
        "value": "集体户口"
    }, {
        "key": "04",
        "value": "家庭户口"
    }, {
        "key": "05",
        "value": "军籍户口"
    }, {
        "key": "08",
        "value": "外籍户口"
    }, {
        "key": "06",
        "value": "城镇居民户口"
    }, {
        "key": "07",
        "value": "农村居民户口"
    }];

    var politication = [{
        "key": "01",
        "value": "中共党员"
    }, {
        "key": "02",
        "value": "共青团员"
    }, {
        "key": "03",
        "value": "民主党派"
    }, {
        "key": "04",
        "value": "无党派"
    }, {
        "key": "05",
        "value": "其他"
    }];

    var education = [{
        "key": "01",
        "value": "小学"
    }, {
        "key": "02",
        "value": "初中"
    }, {
        "key": "03",
        "value": "高中"
    }, {
        "key": "04",
        "value": "专科"
    }, {
        "key": "05",
        "value": "本科"
    }, {
        "key": "06",
        "value": "硕士"
    }, {
        "key": "07",
        "value": "博士"
    }];

    var nation = [{
            "key": "01",
            "value": "汉族"
        },
        {
            "key": "02",
            "value": "壮族"
        },
        {
            "key": "03",
            "value": "满族"
        },
        {
            "key": "04",
            "value": "回族 "
        },
        {
            "key": "05",
            "value": "苗族"
        },
        {
            "key": "06",
            "value": "维吾尔族 "
        },
        {
            "key": "07",
            "value": "土家族"
        },
        {
            "key": "08",
            "value": "彝族"
        },
        {
            "key": "09",
            "value": "蒙古族"
        },
        {
            "key": "10",
            "value": "藏族"
        },
        {
            "key": "11",
            "value": "布依族"
        },
        {
            "key": "12",
            "value": "侗族"
        },
        {
            "key": "13",
            "value": "瑶族"
        },
        {
            "key": "14",
            "value": "朝鲜族   "
        },
        {
            "key": "15",
            "value": "白族"
        },
        {
            "key": "16",
            "value": "哈尼族"
        },
        {
            "key": "17",
            "value": "哈萨克族"
        },
        {
            "key": "18",
            "value": "黎族"
        },
        {
            "key": "19",
            "value": "傣族"
        },
        {
            "key": "20",
            "value": "畲族"
        },
        {
            "key": "21",
            "value": "傈僳族  "
        },
        {
            "key": "22",
            "value": "仡佬族"
        },
        {
            "key": "23",
            "value": "东乡族"
        },
        {
            "key": "24",
            "value": "高山族"
        },
        {
            "key": "25",
            "value": "拉祜族"
        },
        {
            "key": "26",
            "value": "水族"
        },
        {
            "key": "27",
            "value": "佤族"
        },
        {
            "key": "28",
            "value": "纳西族   "
        },
        {
            "key": "29",
            "value": "羌族"
        },
        {
            "key": "30",
            "value": "土族"
        },
        {
            "key": "31",
            "value": "仫佬族"
        },
        {
            "key": "32",
            "value": "锡伯族"
        },
        {
            "key": "33",
            "value": "柯尔克孜族"
        },
        {
            "key": "34",
            "value": "达斡尔族"
        },
        {
            "key": "35",
            "value": "景颇族  "
        },
        {
            "key": "36",
            "value": "毛南族"
        },
        {
            "key": "37",
            "value": "撒拉族"
        },
        {
            "key": "38",
            "value": "布朗族"
        },
        {
            "key": "39",
            "value": "塔吉克族"
        },
        {
            "key": "40",
            "value": "阿昌族"
        },
        {
            "key": "41",
            "value": "普米族"
        },
        {
            "key": "42",
            "value": "鄂温克族   "
        },
        {
            "key": "43",
            "value": "怒族"
        },
        {
            "key": "44",
            "value": "京族"
        },
        {
            "key": "45",
            "value": "基诺族"
        },
        {
            "key": "46",
            "value": "德昂族"
        },
        {
            "key": "47",
            "value": "保安族"
        },
        {
            "key": "48",
            "value": "俄罗斯族"
        },
        {
            "key": "49",
            "value": "裕固族  "
        },
        {
            "key": "50",
            "value": "乌兹别克族"
        },
        {
            "key": "51",
            "value": "门巴族"
        },
        {
            "key": "52",
            "value": "鄂伦春族"
        },
        {
            "key": "53",
            "value": "独龙族"
        },
        {
            "key": "54",
            "value": "塔塔尔族"
        },
        {
            "key": "55",
            "value": "赫哲族"
        },
        {
            "key": "56",
            "value": "珞巴族"
        }
    ];

    var gender = [{
        "key": "1",
        "value": "男"
    },{
        "key": "2",
        "value": "女"
    },{
        "key": "9",
        "value": "未知"
    }];
    // 正确写法
    module.exports = {
        gender: gender,
        nation: nation,
        domicile: domicile,
        household: household,
        education: education,
        politication: politication
    };
})