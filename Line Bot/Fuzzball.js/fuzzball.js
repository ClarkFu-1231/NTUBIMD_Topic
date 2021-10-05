fuzz = require('fuzzball')//require 模組

options = { full_process: false, wildcards: "我想知道" }

module.exports.user_question = function user_question(quest) {
    Str_quest = String(quest)
    // var cla_1 = classify_1(Str_quest)
    switch (classify_1(Str_quest)) {
        case '股價':
            var classify2 = classify_stock(quest)
            break;
        case '新聞':
            var classify2 = classify_news(quest);
            break;
        case '理財':
            var classify2 = '理財'
            break;
        case '財報':
            var classify2 = '財報'
            break;
        default:
            var classify2 = '沒有符合的條件'
    }
    return classify2
}

function classify_1(quest) {
    Str_quest = String(quest)
    a = fuzz.ratio("我想知道股價", Str_quest)
    b = fuzz.ratio("我想知道新聞", Str_quest)
    c = fuzz.ratio("我想知道理財", Str_quest)
    d = fuzz.ratio("我想知道財報", Str_quest)
    let dic = { "股價": a, "新聞": b, "理財": c, "財報": d }//將分數製作成字典
    let keyArr = Object.keys(dic)//將字典轉換成組數
    let max = 0
    let re_classify_1 = ""
    for (let i = 0; i < 4; i++) {
        if (dic[keyArr[i]] > max) {
            max = dic[keyArr[i]]
        }
    }
    // 取出字典最大值
    for (let key in dic) {
        if (dic[key] == max) {
            re_classify_1 = key
        }
    }
    // 比對最大值屬於哪個鍵
    return (re_classify_1)
}

function classify_news(quest) {
    Str_quest = String(quest)
    let choices = ["期貨新聞", "台股新聞", "外匯新聞", "房產新聞"]
    results = fuzz.extract(Str_quest, choices)//fuzz.extract(query, choices, options);
    let max = 0
    let max_text = 0
    for (let i = 0; i < 4; i++) {
        if (results[i][1] > max) {
            max = results[i][1]//比較最大值
            max_text = results[i][0]//取出最大值的字元
        }
    }
    return (max_text)
}

function classify_stock(quest) {
    Str_quest = String(quest)
    let choices = ["2317股價", "2330股價", "2377股價", "2379股價", "2383股價", "1101股價", "2002股價", "2603股價", "2610股價", "9957股價"]
    results = fuzz.extract(Str_quest, choices)//fuzz.extract(query, choices, options);
    let max = 0
    let max_text = 0
    for (let i = 0; i < 10; i++) {
        if (results[i][1] > max) {
            max = results[i][1]//比較最大值
            max_text = results[i][0]//取出最大值的字元
        }
    }
    return (max_text)
}




